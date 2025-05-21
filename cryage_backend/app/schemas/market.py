from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class Symbol(BaseModel):
    """Cryptocurrency symbol/trading pair model"""
    symbol: str
    baseAsset: str
    quoteAsset: str
    status: str
    displayName: Optional[str] = None


class Candle(BaseModel):
    """Candlestick data model"""
    timestamp: int
    open: float
    high: float
    low: float
    close: float
    volume: float


class MarketData(BaseModel):
    """Market data model with candles"""
    symbol: str
    timeframe: str
    candles: List[Candle]
    lastUpdated: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class SymbolListRequest(BaseModel):
    """Request model for filtering symbols list"""
    status: Optional[str] = "TRADING"
    baseAsset: Optional[str] = None
    quoteAsset: Optional[str] = None
    limit: Optional[int] = 100
    offset: Optional[int] = 0


class MarketDataRequest(BaseModel):
    """Request model for market data"""
    symbol: str
    timeframe: str
    limit: Optional[int] = 100
    fromTimestamp: Optional[int] = None
    toTimestamp: Optional[int] = None
