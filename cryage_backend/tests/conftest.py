import asyncio
import pytest
from fastapi.testclient import TestClient
from app.main import create_app
from app.core.config import settings
import socketio


@pytest.fixture
def app():
    """Create a FastAPI test application."""
    app = create_app()
    return app


@pytest.fixture
def client(app):
    """Create a FastAPI test client."""
    with TestClient(app) as client:
        yield client


@pytest.fixture
def sio_client(app):
    """Create a SocketIO test client."""
    sio = socketio.AsyncClient()
    return sio


@pytest.fixture
def base_url():
    """Return the base URL for the test client."""
    return f"http://localhost:{settings.PORT}"
