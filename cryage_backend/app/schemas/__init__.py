# cryage_backend/app/schemas/__init__.py

from app.schemas.common import (
    BaseResponse,
    GenericResponse,
    ErrorResponse,
    PaginatedResponse,
    StatusMessage
)
from app.schemas.market import (
    Symbol,
    Candle,
    MarketData,
    SymbolListRequest,
    MarketDataRequest
)
from app.schemas.analysis import (
    TechnicalIndicator,
    TechnicalAnalysis,
    AiAnalysis,
    AnalysisRequest
)

__all__ = [
    # Common
    "BaseResponse",
    "GenericResponse",
    "ErrorResponse",
    "PaginatedResponse",
    "StatusMessage",
    # Market
    "Symbol",
    "Candle",
    "MarketData",
    "SymbolListRequest",
    "MarketDataRequest",
    # Analysis
    "TechnicalIndicator",
    "TechnicalAnalysis",
    "AiAnalysis",
    "AnalysisRequest"
]
