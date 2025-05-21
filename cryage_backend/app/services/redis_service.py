import redis
from typing import Any, Dict, Optional, List, Union
import json
import asyncio
from app.services.base import BaseService


class RedisService(BaseService):
    """
    Redis service for managing Redis connections and operations.
    Implements connection pooling for efficient Redis usage.
    """
    def __init__(self) -> None:
        """Initialize the Redis connection pool"""
        super().__init__()
        self.logger.info("Initializing Redis service")

        # Create a connection pool
        self.pool = redis.ConnectionPool(
            host=self.settings.REDIS_HOST,
            port=self.settings.REDIS_PORT,
            db=self.settings.REDIS_DB,
            decode_responses=True
        )

        self.prefix = self.settings.REDIS_PREFIX
        self.logger.info(f"Redis connection pool created at {self.settings.REDIS_HOST}:{self.settings.REDIS_PORT}")

    def get_connection(self) -> redis.Redis:
        """
        Get a Redis connection from the pool

        Returns:
            A Redis connection from the pool
        """
        return redis.Redis(connection_pool=self.pool)

    def get_key(self, key: str) -> str:
        """
        Get a key with the application prefix

        Args:
            key: The base key

        Returns:
            Prefixed key
        """
        return f"{self.prefix}{key}"

    def set(self, key: str, value: Any, expiry: Optional[int] = None) -> bool:
        """
        Set a key-value pair in Redis

        Args:
            key: The key
            value: The value (will be JSON serialized)
            expiry: Optional expiry time in seconds

        Returns:
            True if successful
        """
        try:
            with self.get_connection() as conn:
                full_key = self.get_key(key)
                # Serialize value to JSON if not a string
                if not isinstance(value, str):
                    value = json.dumps(value)
                conn.set(full_key, value, ex=expiry)
                return True
        except Exception as e:
            self.logger.error(f"Error setting Redis key {key}: {str(e)}")
            return False

    def get(self, key: str, default: Any = None) -> Any:
        """
        Get a value from Redis

        Args:
            key: The key
            default: Default value if key doesn't exist

        Returns:
            The value (JSON deserialized) or default
        """
        try:
            with self.get_connection() as conn:
                full_key = self.get_key(key)
                value = conn.get(full_key)

                if value is None:
                    return default

                # Try to deserialize JSON
                try:
                    return json.loads(value)
                except (json.JSONDecodeError, TypeError):
                    # Return raw value if not JSON
                    return value
        except Exception as e:
            self.logger.error(f"Error getting Redis key {key}: {str(e)}")
            return default

    def delete(self, key: str) -> bool:
        """
        Delete a key from Redis

        Args:
            key: The key to delete

        Returns:
            True if deleted, False otherwise
        """
        try:
            with self.get_connection() as conn:
                full_key = self.get_key(key)
                return bool(conn.delete(full_key))
        except Exception as e:
            self.logger.error(f"Error deleting Redis key {key}: {str(e)}")
            return False

    def get_pattern(self, pattern: str) -> Dict[str, Any]:
        """
        Get all keys matching a pattern

        Args:
            pattern: The key pattern to match

        Returns:
            Dictionary of key-value pairs
        """
        try:
            result = {}
            with self.get_connection() as conn:
                full_pattern = self.get_key(pattern)
                keys = conn.keys(full_pattern)

                if not keys:
                    return {}

                # Get all values for the keys
                for key in keys:
                    # Remove prefix for the result dictionary
                    short_key = key[len(self.prefix):]
                    value = conn.get(key)

                    # Try to deserialize JSON
                    try:
                        result[short_key] = json.loads(value) if value else None
                    except (json.JSONDecodeError, TypeError):
                        result[short_key] = value

                return result
        except Exception as e:
            self.logger.error(f"Error getting keys with pattern {pattern}: {str(e)}")
            return {}

    def publish(self, channel: str, message: Any) -> int:
        """
        Publish a message to a Redis channel

        Args:
            channel: The channel name
            message: The message (will be JSON serialized)

        Returns:
            Number of clients that received the message
        """
        try:
            with self.get_connection() as conn:
                # Serialize message to JSON if not a string
                if not isinstance(message, str):
                    message = json.dumps(message)
                return conn.publish(channel, message)
        except Exception as e:
            self.logger.error(f"Error publishing to channel {channel}: {str(e)}")
            return 0

    async def subscribe(self, channels: List[str], callback: callable) -> None:
        """
        Subscribe to Redis channels and process messages asynchronously

        Args:
            channels: List of channel names
            callback: Async function to call with channel and message
        """
        try:
            # Create a new connection for pubsub
            conn = self.get_connection()
            pubsub = conn.pubsub()
            pubsub.subscribe(channels)

            # Start listening for messages in a separate task
            async def listen():
                self.logger.info(f"Subscribed to Redis channels: {channels}")
                for message in pubsub.listen():
                    if message['type'] == 'message':
                        channel = message['channel']
                        data = message['data']

                        # Try to parse JSON
                        try:
                            if isinstance(data, str):
                                data = json.loads(data)
                        except json.JSONDecodeError:
                            pass

                        # Call the callback with channel and data
                        await callback(channel, data)

            # Create and return the listener task
            asyncio.create_task(listen())

        except Exception as e:
            self.logger.error(f"Error subscribing to channels {channels}: {str(e)}")

    def flush_db(self) -> bool:
        """
        Clear all keys in the current database (use with caution!)

        Returns:
            True if successful
        """
        try:
            self.logger.warning("Flushing Redis database")
            with self.get_connection() as conn:
                conn.flushdb()
            return True
        except Exception as e:
            self.logger.error(f"Error flushing database: {str(e)}")
            return False

    def health_check(self) -> bool:
        """
        Check if Redis is available

        Returns:
            True if Redis is available, False otherwise
        """
        try:
            with self.get_connection() as conn:
                return conn.ping()
        except Exception as e:
            self.logger.error(f"Redis health check failed: {str(e)}")
            return False
