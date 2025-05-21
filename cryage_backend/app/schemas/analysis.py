from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field
from datetime import datetime


class TechnicalIndicator(BaseModel):
    """Technical indicator model"""
    type: str
    value: Union[float, List[float], str, Dict[str, Any]]
    signal: Optional[str] = None  # "buy", "sell", "neutral"
    color: Optional[str] = None  # For chart visualization


class TechnicalAnalysis(BaseModel):
    """Technical analysis model with indicators"""
    symbol: str
    timeframe: str
    indicators: Dict[str, TechnicalIndicator]
    lastUpdated: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class AiAnalysis(BaseModel):
    """AI-based analysis model"""
    symbol: str
    timeframe: str
    summary: str
    sentiment: str  # "bullish", "bearish", "neutral"
    confidence: float  # 0-1
    keyPoints: List[str]
    lastUpdated: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class AnalysisRequest(BaseModel):
    """Request model for analysis data"""
    symbol: str
    timeframe: str
    indicators: Optional[List[str]] = None  # List of indicator names to include
    includeCandles: Optional[bool] = False  # Whether to include candlestick data
