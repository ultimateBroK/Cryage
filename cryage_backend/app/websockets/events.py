import asyncio
import logging
import time
from typing import Dict, Any, Optional, List, Union

# Initialize logger
logger = logging.getLogger(__name__)


class WebSocketEvents:
    """
    Utility class for managing WebSocket events
    """
    def __init__(self, sio):
        self.sio = sio

    async def emit_to_channel(self, event_name: str, data: Dict[str, Any], channel: str):
        """
        Emit an event to all clients subscribed to a specific channel

        Args:
            event_name: The name of the event to emit
            data: The data to send with the event
            channel: The channel to emit to
        """
        try:
            # Add timestamp to data if not present
            if 'timestamp' not in data:
                data['timestamp'] = time.time()

            logger.debug(
                "Emitting to channel",
                extra={"event": event_name, "channel": channel}
            )
            await self.sio.emit(event_name, data, room=channel)
            return True
        except Exception as e:
            logger.error(
                "Error emitting to channel",
                extra={"event": event_name, "channel": channel, "error": str(e)}
            )
            return False

    async def emit_to_all(self, event_name: str, data: Dict[str, Any]):
        """
        Emit an event to all connected clients

        Args:
            event_name: The name of the event to emit
            data: The data to send with the event
        """
        try:
            # Add timestamp to data if not present
            if 'timestamp' not in data:
                data['timestamp'] = time.time()

            logger.debug(
                "Emitting to all clients",
                extra={"event": event_name}
            )
            await self.sio.emit(event_name, data)
            return True
        except Exception as e:
            logger.error(
                "Error emitting to all clients",
                extra={"event": event_name, "error": str(e)}
            )
            return False

    async def emit_market_update(self, symbol: str, timeframe: str, data: Dict[str, Any]):
        """
        Emit a market update event to the appropriate channel

        Args:
            symbol: The market symbol (e.g., 'BTC-USDT')
            timeframe: The timeframe (e.g., '1m', '5m', '1h')
            data: The market data
        """
        channel = f"market:{symbol}:{timeframe}"
        event_name = "market:update"

        # Ensure data contains symbol and timeframe
        data["symbol"] = symbol
        data["timeframe"] = timeframe

        return await self.emit_to_channel(event_name, data, channel)

    async def emit_candle_update(self, symbol: str, timeframe: str, candle: Dict[str, Any]):
        """
        Emit a candle update event to the appropriate channel

        Args:
            symbol: The market symbol (e.g., 'BTC-USDT')
            timeframe: The timeframe (e.g., '1m', '5m', '1h')
            candle: The candle data
        """
        channel = f"candle:{symbol}:{timeframe}"
        event_name = "candle:update"

        data = {
            "symbol": symbol,
            "timeframe": timeframe,
            "candle": candle,
            "timestamp": time.time()
        }

        return await self.emit_to_channel(event_name, data, channel)

    async def emit_analysis_update(
        self,
        symbol: str,
        timeframe: str,
        data: Dict[str, Any],
        analysis_type: str = "technical"
    ):
        """
        Emit an analysis update event to the appropriate channel

        Args:
            symbol: The market symbol (e.g., 'BTC-USDT')
            timeframe: The timeframe (e.g., '1m', '5m', '1h')
            data: The analysis data
            analysis_type: The type of analysis ('technical' or 'ai')
        """
        # Generic analysis channel
        channel = f"analysis:{symbol}:{timeframe}"
        event_name = "analysis:update"

        # Ensure data contains symbol and timeframe
        data["symbol"] = symbol
        data["timeframe"] = timeframe
        data["analysisType"] = analysis_type

        # Emit to both the generic channel and the specific channel
        await self.emit_to_channel(event_name, data, channel)

        # Specific analysis channel
        specific_channel = f"analysis:{analysis_type}:{symbol}:{timeframe}"
        specific_event = f"analysis:{analysis_type}:update"

        return await self.emit_to_channel(specific_event, data, specific_channel)

    async def broadcast_system_message(self, message: str, level: str = "info"):
        """
        Broadcast a system message to all connected clients

        Args:
            message: The message to broadcast
            level: The message level (info, warning, error)
        """
        event_name = "system:message"
        data = {
            "message": message,
            "level": level,
            "timestamp": time.time()
        }

        try:
            logger.debug("Broadcasting system message", extra={"level": level})
            await self.sio.emit(event_name, data)
            return True
        except Exception as e:
            logger.error(
                "Error broadcasting system message",
                extra={"error": str(e)}
            )
            return False

    async def emit_batch_updates(
        self,
        updates: List[Dict[str, Any]]
    ):
        """
        Emit multiple updates in batch to reduce overhead

        Args:
            updates: List of update objects with event_name, channel, and data
        """
        for update in updates:
            event_name = update.get('event_name')
            channel = update.get('channel')
            data = update.get('data', {})

            if not event_name or not channel or not data:
                logger.warning("Invalid batch update item", extra={"update": update})
                continue

            await self.emit_to_channel(event_name, data, channel)

        return True

    async def emit_status_update(self, status: str, details: Optional[Dict[str, Any]] = None):
        """
        Emit a system status update to all clients

        Args:
            status: The status message
            details: Additional status details
        """
        event_name = "system:status"
        data = {
            "status": status,
            "timestamp": time.time()
        }

        if details:
            data.update(details)

        return await self.emit_to_all(event_name, data)
