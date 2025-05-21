from typing import Dict, List, Optional, Any, Union
import httpx
import time
import json
import asyncio
from datetime import datetime, timedelta
import logging

from app.services.base import BaseService
from app.services.redis_service import RedisService
from app.core.config import settings


class MarketService(BaseService):
    """
    Service for handling market data operations including fetching, caching,
    and streaming price data from exchanges.
    """
    def __init__(self, RedisService: RedisService) -> None:
        """
        Initialize the market service with required dependencies

        Args:
            RedisService: Redis service for caching data
        """
        super().__init__()
        self.redis = RedisService
        self.logger.info("Market service initialized")

        # Initialize HTTP client for API calls
        self.client = httpx.AsyncClient(
            base_url=self.settings.BINANCE_BASE_URL,
            timeout=30.0,
            headers={
                "User-Agent": f"{self.settings.PROJECT_NAME}/0.1.0"
            }
        )

        # Cache time settings
        self.cache_expiry = self.settings.CACHE_EXPIRY_SECONDS

        # Market update channels
        self.active_symbols = set()
        self.active_timeframes = set()

    async def get_symbols(self) -> List[Dict[str, str]]:
        """
        Get all available trading symbols

        Returns:
            List of symbol information dictionaries
        """
        # Check cache first
        cached = self.redis.get("symbols")
        if cached:
            self.logger.debug("Retrieved symbols from cache")
            return cached

        try:
            # Fetch from Binance API
            self.logger.info("Fetching symbols from Binance API")
            response = await self.client.get("/api/v3/exchangeInfo")
            data = response.json()

            # Extract and format symbols
            symbols = []
            for symbol in data.get("symbols", []):
                # Only include USDT trading pairs for now
                if symbol["status"] == "TRADING" and symbol["quoteAsset"] == "USDT":
                    symbols.append({
                        "symbol": symbol["symbol"],
                        "baseAsset": symbol["baseAsset"],
                        "quoteAsset": symbol["quoteAsset"],
                        "status": symbol["status"],
                        "displayName": f"{symbol['baseAsset']}/{symbol['quoteAsset']}"
                    })

            # Cache the result
            self.redis.set("symbols", symbols, expiry=86400)  # Cache for 24 hours
            return symbols

        except Exception as e:
            self.logger.error(f"Error fetching symbols: {str(e)}")
            # Return default symbols if API fails
            return [
                {
                    "symbol": "BTCUSDT",
                    "baseAsset": "BTC",
                    "quoteAsset": "USDT",
                    "status": "TRADING",
                    "displayName": "BTC/USDT"
                },
                {
                    "symbol": "ETHUSDT",
                    "baseAsset": "ETH",
                    "quoteAsset": "USDT",
                    "status": "TRADING",
                    "displayName": "ETH/USDT"
                }
            ]

    async def get_klines(self, symbol: str, timeframe: str, limit: int = 100) -> Dict[str, Any]:
        """
        Get historical klines (candlestick) data

        Args:
            symbol: Trading pair symbol (e.g., BTCUSDT)
            timeframe: Candle timeframe (e.g., 1m, 1h, 1d)
            limit: Number of candles to fetch

        Returns:
            Dictionary with candles and metadata
        """
        # Check cache first
        cache_key = f"klines:{symbol}:{timeframe}"
        cached = self.redis.get(cache_key)
        if cached:
            self.logger.debug(f"Retrieved {symbol} {timeframe} klines from cache")
            return cached

        try:
            # Fetch from Binance API
            self.logger.info(f"Fetching {symbol} {timeframe} klines from Binance API")
            response = await self.client.get(
                "/api/v3/klines",
                params={
                    "symbol": symbol,
                    "interval": timeframe,
                    "limit": limit
                }
            )
            data = response.json()

            # Format the candles
            candles = []
            for candle in data:
                candles.append({
                    "timestamp": candle[0],
                    "open": float(candle[1]),
                    "high": float(candle[2]),
                    "low": float(candle[3]),
                    "close": float(candle[4]),
                    "volume": float(candle[5]),
                })

            # Create result with metadata
            result = {
                "symbol": symbol,
                "timeframe": timeframe,
                "candles": candles,
                "lastUpdated": datetime.now().isoformat()
            }

            # Cache the result
            self.redis.set(cache_key, result, expiry=self.cache_expiry)
            return result

        except Exception as e:
            self.logger.error(f"Error fetching klines for {symbol} {timeframe}: {str(e)}")
            # Return placeholder data with timestamp
            now_ms = int(time.time() * 1000)

            # Generate placeholder data
            candles = []
            for i in range(limit):
                timestamp = now_ms - ((limit - i) * self._get_timeframe_ms(timeframe))
                price = 30000 + (i * 100) + ((i % 10) * 50)
                candles.append({
                    "timestamp": timestamp,
                    "open": price - 100,
                    "high": price + 200,
                    "low": price - 200,
                    "close": price,
                    "volume": 10000000 + (i * 500000)
                })

            return {
                "symbol": symbol,
                "timeframe": timeframe,
                "candles": candles,
                "lastUpdated": datetime.now().isoformat()
            }

    def _get_timeframe_ms(self, timeframe: str) -> int:
        """
        Convert timeframe string to milliseconds

        Args:
            timeframe: Timeframe string (e.g., 1m, 1h, 1d)

        Returns:
            Milliseconds for the timeframe
        """
        value = int(timeframe[:-1])
        unit = timeframe[-1]

        if unit == 'm':
            return value * 60 * 1000
        elif unit == 'h':
            return value * 60 * 60 * 1000
        elif unit == 'd':
            return value * 24 * 60 * 60 * 1000
        elif unit == 'w':
            return value * 7 * 24 * 60 * 60 * 1000
        else:
            return 60 * 1000  # Default to 1m

    async def start_market_stream(self, symbol: str, timeframe: str) -> bool:
        """
        Start streaming market data for a symbol and timeframe

        Args:
            symbol: Symbol to stream (e.g., BTCUSDT)
            timeframe: Timeframe to stream (e.g., 1m)

        Returns:
            True if started successfully
        """
        # Add to active streams
        self.active_symbols.add(symbol)
        self.active_timeframes.add(timeframe)

        # For now just log this - actual WebSocket implementation will be added later
        self.logger.info(f"Started market stream for {symbol} {timeframe}")
        return True

    async def stop_market_stream(self, symbol: str, timeframe: str) -> bool:
        """
        Stop streaming market data for a symbol and timeframe

        Args:
            symbol: Symbol to stop streaming
            timeframe: Timeframe to stop streaming

        Returns:
            True if stopped successfully
        """
        # Remove from active streams
        if symbol in self.active_symbols:
            self.active_symbols.remove(symbol)
        if timeframe in self.active_timeframes:
            self.active_timeframes.remove(timeframe)

        self.logger.info(f"Stopped market stream for {symbol} {timeframe}")
        return True

    async def simulate_market_updates(self) -> None:
        """
        Simulate market data updates for testing

        This method periodically updates Redis with simulated market data and
        publishes messages to channels for consumption by subscribers.
        """
        symbols = ["BTCUSDT", "ETHUSDT"]
        timeframes = ["1m", "5m", "15m", "1h"]

        while True:
            for symbol in symbols:
                for timeframe in timeframes:
                    # Only simulate for active streams
                    if symbol in self.active_symbols and timeframe in self.active_timeframes:
                        # Get existing data
                        cache_key = f"klines:{symbol}:{timeframe}"
                        data = self.redis.get(cache_key)

                        if not data:
                            continue

                        candles = data.get("candles", [])
                        if not candles:
                            continue

                        # Update the last candle
                        last_candle = candles[-1].copy()
                        last_candle["close"] = last_candle["close"] * (1 + (0.001 * (time.time() % 2 - 1)))
                        last_candle["high"] = max(last_candle["high"], last_candle["close"])
                        last_candle["low"] = min(last_candle["low"], last_candle["close"])
                        last_candle["volume"] += 1000

                        candles[-1] = last_candle

                        # Update the data
                        data["candles"] = candles
                        data["lastUpdated"] = datetime.now().isoformat()

                        # Save back to Redis
                        self.redis.set(cache_key, data, expiry=self.cache_expiry)

                        # Publish update
                        channel = f"market:{symbol}:{timeframe}"
                        self.redis.publish(channel, {
                            "type": "update",
                            "data": {
                                "symbol": symbol,
                                "timeframe": timeframe,
                                "candles": [last_candle],
                                "lastUpdated": datetime.now().isoformat()
                            }
                        })

            # Wait before next update
            await asyncio.sleep(1)

# Define dependency on RedisService outside the class
MarketService.depends_on(RedisService)
