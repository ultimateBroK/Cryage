import logging
import time
from typing import Dict, Any, List, Set, Optional

# Initialize logger
logger = logging.getLogger(__name__)

# Store for active clients and their subscriptions
clients: Dict[str, Set[str]] = {}
# Store for rooms and their subscription counts
rooms: Dict[str, int] = {}


async def register_socket_handlers(sio):
    """
    Register all Socket.IO event handlers
    """
    @sio.event
    async def connect(sid, environ):
        """
        Handle client connection event
        """
        logger.info("Client connected", extra={"sid": sid})
        clients[sid] = set()
        await sio.emit('connection:established', {
            'status': 'connected',
            'timestamp': time.time(),
            'sid': sid
        }, to=sid)

    @sio.event
    async def disconnect(sid):
        """
        Handle client disconnection event
        """
        logger.info("Client disconnected", extra={"sid": sid})
        if sid in clients:
            # Clean up room subscriptions
            for room in list(clients[sid]):
                await _leave_room(sio, sid, room)
            del clients[sid]

    @sio.event
    async def subscribe(sid, data):
        """
        Handle subscription to a specific channel

        Expected data format:
        {
            "channel": "channel_name",
            "timestamp": 1234567890
        }
        """
        channel = data.get('channel')
        if not channel:
            logger.warning("Invalid subscription request", extra={"sid": sid, "data": data})
            return {'status': 'error', 'message': 'Missing channel parameter'}

        logger.info("Client subscribing to channel", extra={"sid": sid, "channel": channel})

        # Add client to channel
        if sid in clients:
            await _join_room(sio, sid, channel)

            await sio.emit('subscription:success', {
                'channel': channel,
                'status': 'subscribed',
                'timestamp': time.time()
            }, to=sid)

            return {
                'status': 'success',
                'channel': channel,
                'timestamp': time.time()
            }

        return {'status': 'error', 'message': 'Client not found'}

    @sio.event
    async def unsubscribe(sid, data):
        """
        Handle unsubscription from a specific channel

        Expected data format:
        {
            "channel": "channel_name",
            "timestamp": 1234567890
        }
        """
        channel = data.get('channel')
        if not channel:
            logger.warning("Invalid unsubscription request", extra={"sid": sid, "data": data})
            return {'status': 'error', 'message': 'Missing channel parameter'}

        logger.info("Client unsubscribing from channel", extra={"sid": sid, "channel": channel})

        # Remove client from channel
        if sid in clients and channel in clients[sid]:
            await _leave_room(sio, sid, channel)

            await sio.emit('subscription:closed', {
                'channel': channel,
                'status': 'unsubscribed',
                'timestamp': time.time()
            }, to=sid)

            return {
                'status': 'success',
                'channel': channel,
                'timestamp': time.time()
            }

        return {'status': 'error', 'message': 'Not subscribed to channel'}

    @sio.event
    async def ping(sid, data):
        """
        Simple ping-pong for health checks

        Expected data format:
        {
            "clientTime": 1234567890,
            "timestamp": 1234567890
        }
        """
        logger.debug("Ping received", extra={"sid": sid})
        client_time = data.get('clientTime', data.get('timestamp', time.time()))
        server_time = time.time()

        await sio.emit('pong', {
            'clientTime': client_time,
            'serverTime': server_time,
            'timestamp': server_time,
            'latency': 0  # Client will calculate round-trip time
        }, to=sid)

    @sio.event
    async def get_subscriptions(sid):
        """
        Get all active subscriptions for a client
        """
        if sid in clients:
            subscriptions = list(clients[sid])
            return {
                'status': 'success',
                'subscriptions': subscriptions,
                'count': len(subscriptions),
                'timestamp': time.time()
            }

        return {'status': 'error', 'message': 'Client not found'}

    @sio.event
    async def get_room_stats(sid):
        """
        Get statistics about active rooms and subscription counts
        """
        # Only return if client is connected
        if sid in clients:
            return {
                'status': 'success',
                'rooms': rooms,
                'client_count': len(clients),
                'timestamp': time.time()
            }

        return {'status': 'error', 'message': 'Client not found'}


async def _join_room(sio, sid: str, room: str):
    """
    Internal helper to join a room and update tracking data
    """
    if room not in clients[sid]:
        clients[sid].add(room)
        await sio.enter_room(sid, room)

        # Update room counts
        rooms[room] = rooms.get(room, 0) + 1

        logger.debug(
            "Client joined room",
            extra={"sid": sid, "room": room, "count": rooms[room]}
        )


async def _leave_room(sio, sid: str, room: str):
    """
    Internal helper to leave a room and update tracking data
    """
    if room in clients[sid]:
        clients[sid].remove(room)
        await sio.leave_room(sid, room)

        # Update room counts
        if room in rooms:
            rooms[room] -= 1
            if rooms[room] <= 0:
                del rooms[room]

        logger.debug(
            "Client left room",
            extra={"sid": sid, "room": room, "count": rooms.get(room, 0)}
        )
