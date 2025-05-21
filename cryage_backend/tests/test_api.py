import pytest
from fastapi.testclient import TestClient


def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_symbols_endpoint(client):
    """Test the symbols endpoint returns the expected structure."""
    response = client.get("/api/symbols")
    assert response.status_code == 200

    # Check that the response contains a list of symbols
    data = response.json()
    assert "symbols" in data
    assert isinstance(data["symbols"], list)

    # If there are symbols, check they have the expected structure
    if data["symbols"]:
        symbol = data["symbols"][0]
        assert "symbol" in symbol
        assert "base_asset" in symbol
        assert "quote_asset" in symbol


def test_market_data_endpoint(client):
    """Test market data endpoint returns the expected structure."""
    response = client.get("/api/market-data/BTC/USDT/1h")
    assert response.status_code == 200

    # Check that the response contains candles and metadata
    data = response.json()
    assert "symbol" in data
    assert "timeframe" in data
    assert "candles" in data

    # Check candles structure if any are present
    if data["candles"]:
        candle = data["candles"][0]
        assert "timestamp" in candle
        assert "open" in candle
        assert "high" in candle
        assert "low" in candle
        assert "close" in candle
        assert "volume" in candle


def test_analysis_endpoint(client):
    """Test analysis endpoint returns the expected structure."""
    response = client.get("/api/analysis/core/BTC/USDT/1h")
    assert response.status_code == 200

    # Check that the response contains indicators and metadata
    data = response.json()
    assert "symbol" in data
    assert "timeframe" in data
    assert "indicators" in data

    # Check indicators structure if any are present
    if data["indicators"]:
        # Common indicator properties
        indicator = data["indicators"][0]
        assert "name" in indicator
        assert "values" in indicator
        assert "color" in indicator
        assert "type" in indicator


def test_invalid_symbol(client):
    """Test that invalid symbol returns a 404 error."""
    response = client.get("/api/market-data/INVALID/SYMBOL/1h")
    assert response.status_code == 404


def test_invalid_timeframe(client):
    """Test that invalid timeframe returns a 400 error."""
    response = client.get("/api/market-data/BTC/USDT/invalid")
    assert response.status_code == 400


def test_schema_validation(client):
    """Test that schema validation works correctly for POST requests."""
    # Test with valid data
    valid_data = {
        "symbol": "BTC/USDT",
        "timeframe": "1h",
        "limit": 100
    }
    response = client.post("/api/market-data", json=valid_data)
    assert response.status_code == 200

    # Test with invalid data (missing required field)
    invalid_data = {
        "symbol": "BTC/USDT"
        # Missing timeframe
    }
    response = client.post("/api/market-data", json=invalid_data)
    assert response.status_code == 422  # Validation error

    # Test with invalid data type
    invalid_type_data = {
        "symbol": "BTC/USDT",
        "timeframe": "1h",
        "limit": "not_a_number"  # Should be an integer
    }
    response = client.post("/api/market-data", json=invalid_type_data)
    assert response.status_code == 422  # Validation error
