# cryage_backend/app/core/config.py

from typing import List, Optional
from pydantic import validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # API configuration
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Cryage"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]

    # Redis configuration
    REDIS_HOST: str = "redis"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PREFIX: str = "cryage:"

    # Binance API configuration
    BINANCE_API_KEY: Optional[str] = None
    BINANCE_API_SECRET: Optional[str] = None
    BINANCE_BASE_URL: str = "https://api.binance.com"
    BINANCE_WS_URL: str = "wss://stream.binance.com:9443/ws"

    # Google Gemini configuration
    GEMINI_API_KEY: Optional[str] = None

    # Default cryptocurrencies and timeframes for MVP
    DEFAULT_SYMBOLS: List[str] = ["BTCUSDT", "ETHUSDT"]
    DEFAULT_TIMEFRAMES: List[str] = ["1m", "5m", "15m", "1h", "4h", "1d"]

    # Technical indicators configuration
    RSI_PERIOD: int = 14
    EMA_PERIODS: List[int] = [34, 89, 200]

    # Cache settings
    CACHE_EXPIRY_SECONDS: int = 300  # 5 minutes

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
