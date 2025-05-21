import pytest
import asyncio
from unittest.mock import MagicMock, patch
import socketio


@pytest.mark.asyncio
async def test_socket_connection(base_url, sio_client):
    """Test that a socket connection can be established."""
    connected = False

    @sio_client.event
    async def connect():
        nonlocal connected
        connected = True

    await sio_client.connect(f"{base_url}/socket.io/")
    await asyncio.sleep(0.1)  # Give the connection time to establish

    assert connected
    await sio_client.disconnect()


@pytest.mark.asyncio
async def test_socket_message(base_url, sio_client):
    """Test that messages can be sent and received."""
    received_message = None

    @sio_client.event
    async def test_response(data):
        nonlocal received_message
        received_message = data

    await sio_client.connect(f"{base_url}/socket.io/")
    await asyncio.sleep(0.1)  # Give the connection time to establish

    # Send a test message
    await sio_client.emit("test_event", {"message": "Hello, server!"})
    await asyncio.sleep(0.1)  # Give the server time to respond

    assert received_message is not None
    assert "message" in received_message
    assert received_message["message"] == "Hello, client!"

    await sio_client.disconnect()


@pytest.mark.asyncio
async def test_subscription(base_url, sio_client):
    """Test subscription and unsubscription functionality."""
    subscription_success = False
    unsubscription_success = False
    market_update_received = False

    @sio_client.event
    async def subscription_response(data):
        nonlocal subscription_success
        if data.get("status") == "success" and data.get("action") == "subscribe":
            subscription_success = True

    @sio_client.event
    async def unsubscription_response(data):
        nonlocal unsubscription_success
        if data.get("status") == "success" and data.get("action") == "unsubscribe":
            unsubscription_success = True

    @sio_client.event
    async def market_update(data):
        nonlocal market_update_received
        if data.get("symbol") == "BTC/USDT" and data.get("timeframe") == "1h":
            market_update_received = True

    await sio_client.connect(f"{base_url}/socket.io/")
    await asyncio.sleep(0.1)  # Give the connection time to establish

    # Subscribe to market data
    await sio_client.emit("subscribe", {
        "channel": "market_data",
        "symbol": "BTC/USDT",
        "timeframe": "1h"
    })
    await asyncio.sleep(0.1)  # Give the server time to process

    assert subscription_success

    # Wait for market update (mock response will be sent by server)
    await asyncio.sleep(0.2)
    assert market_update_received

    # Unsubscribe from market data
    await sio_client.emit("unsubscribe", {
        "channel": "market_data",
        "symbol": "BTC/USDT",
        "timeframe": "1h"
    })
    await asyncio.sleep(0.1)  # Give the server time to process

    assert unsubscription_success

    await sio_client.disconnect()
