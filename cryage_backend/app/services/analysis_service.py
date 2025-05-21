from typing import Dict, List, Optional, Any, Union
import numpy as np
import pandas as pd
from datetime import datetime
import logging

from app.services.base import BaseService
from app.services.redis_service import RedisService
from app.services.market_service import MarketService
from app.core.config import settings


class AnalysisService(BaseService):
    """
    Service for processing technical analysis on market data.
    Calculates indicators and provides signals for trading decisions.
    """
    def __init__(self, RedisService: RedisService, MarketService: MarketService) -> None:
        """
        Initialize the analysis service with required dependencies

        Args:
            RedisService: Redis service for caching results
            MarketService: Market service for retrieving price data
        """
        super().__init__()
        self.redis = RedisService
        self.market = MarketService
        self.logger.info("Analysis service initialized")

        # Cache time settings
        self.cache_expiry = self.settings.CACHE_EXPIRY_SECONDS

    async def get_analysis(self, symbol: str, timeframe: str) -> Dict[str, Any]:
        """
        Get or calculate technical analysis for a symbol and timeframe

        Args:
            symbol: Trading pair symbol (e.g., BTCUSDT)
            timeframe: Candle timeframe (e.g., 1m, 1h, 1d)

        Returns:
            Dictionary with analysis results
        """
        # Check cache first
        cache_key = f"analysis:{symbol}:{timeframe}"
        cached = self.redis.get(cache_key)
        if cached:
            self.logger.debug(f"Retrieved {symbol} {timeframe} analysis from cache")
            return cached

        # Get market data
        market_data = await self.market.get_klines(symbol, timeframe, limit=200)
        if not market_data or not market_data.get("candles"):
            self.logger.error(f"No market data available for {symbol} {timeframe}")
            return self._get_default_analysis(symbol, timeframe)

        # Convert to pandas DataFrame for easier analysis
        df = pd.DataFrame(market_data["candles"])

        try:
            # Calculate all indicators
            indicators = {}

            # Calculate RSI
            indicators["rsi"] = self._calculate_rsi(df, self.settings.RSI_PERIOD)

            # Calculate EMA values
            for period in self.settings.EMA_PERIODS:
                indicators[f"ema{period}"] = self._calculate_ema(df, period)

            # Calculate MACD
            macd, signal, hist = self._calculate_macd(df)
            indicators["macd"] = {
                "macd": macd,
                "signal": signal,
                "histogram": hist
            }

            # Determine trend and signal
            trend, signal = self._determine_trend(df, indicators)
            indicators["trend"] = {
                "direction": trend,
                "signal": signal,
                "strength": self._calculate_trend_strength(df, indicators)
            }

            # Format the result
            result = {
                "symbol": symbol,
                "timeframe": timeframe,
                "indicators": indicators,
                "lastUpdated": datetime.now().isoformat()
            }

            # Cache the result
            self.redis.set(cache_key, result, expiry=self.cache_expiry)
            return result

        except Exception as e:
            self.logger.error(f"Error calculating analysis for {symbol} {timeframe}: {str(e)}")
            return self._get_default_analysis(symbol, timeframe)

    def _get_default_analysis(self, symbol: str, timeframe: str) -> Dict[str, Any]:
        """
        Get default (placeholder) analysis data

        Args:
            symbol: Trading pair symbol
            timeframe: Candle timeframe

        Returns:
            Default analysis data
        """
        return {
            "symbol": symbol,
            "timeframe": timeframe,
            "indicators": {
                "rsi": {
                    "type": "rsi",
                    "value": 50,
                    "signal": "neutral",
                    "color": "#787878"
                },
                "ema34": {
                    "type": "ema",
                    "value": [30000 + i * 10 for i in range(34)],
                    "signal": "neutral",
                    "color": "#1e88e5"
                },
                "ema89": {
                    "type": "ema",
                    "value": [30000 + i * 5 for i in range(89)],
                    "signal": "neutral",
                    "color": "#9c27b0"
                },
                "ema200": {
                    "type": "ema",
                    "value": [30000 + i * 2 for i in range(200)],
                    "signal": "neutral",
                    "color": "#ff9800"
                },
                "macd": {
                    "type": "macd",
                    "value": {
                        "macd": [0.5 * i for i in range(20)],
                        "signal": [0.4 * i for i in range(20)],
                        "histogram": [0.1 * i for i in range(20)]
                    },
                    "signal": "neutral",
                    "color": "#4caf50"
                },
                "trend": {
                    "type": "trend",
                    "value": "sideways",
                    "signal": "neutral",
                    "strength": 0.5,
                    "color": "#787878"
                }
            },
            "lastUpdated": datetime.now().isoformat()
        }

    def _calculate_rsi(self, df: pd.DataFrame, periods: int = 14) -> Dict[str, Any]:
        """
        Calculate RSI (Relative Strength Index)

        Args:
            df: DataFrame with price data
            periods: RSI period

        Returns:
            RSI indicator data
        """
        # Get close prices
        close_prices = np.array(df["close"].values)

        # Calculate price differences
        deltas = np.diff(close_prices)
        seed = deltas[:periods+1]
        up = seed[seed >= 0].sum() / periods
        down = -seed[seed < 0].sum() / periods
        rs = up / down if down != 0 else 0
        rsi = np.zeros_like(close_prices)
        rsi[:periods] = 100. - 100. / (1. + rs)

        # Calculate RSI for the rest of the data
        for i in range(periods, len(close_prices)):
            delta = deltas[i-1]

            if delta > 0:
                upval = delta
                downval = 0
            else:
                upval = 0
                downval = -delta

            up = (up * (periods - 1) + upval) / periods
            down = (down * (periods - 1) + downval) / periods

            rs = up / down if down != 0 else 0
            rsi[i] = 100. - 100. / (1. + rs)

        # Determine signal based on RSI value
        latest_rsi = rsi[-1]

        if latest_rsi > 70:
            signal = "sell"
            color = "#e03131"
        elif latest_rsi < 30:
            signal = "buy"
            color = "#36bd5a"
        else:
            signal = "neutral"
            color = "#787878"

        return {
            "type": "rsi",
            "value": float(latest_rsi),
            "signal": signal,
            "color": color
        }

    def _calculate_ema(self, df: pd.DataFrame, period: int) -> Dict[str, Any]:
        """
        Calculate EMA (Exponential Moving Average)

        Args:
            df: DataFrame with price data
            period: EMA period

        Returns:
            EMA indicator data
        """
        # Get close prices
        close_prices = np.array(df["close"].values)

        # Calculate EMA
        ema = np.zeros_like(close_prices)
        ema[0] = close_prices[0]

        multiplier = 2 / (period + 1)

        for i in range(1, len(close_prices)):
            ema[i] = (close_prices[i] - ema[i-1]) * multiplier + ema[i-1]

        # Get latest price and EMA
        latest_price = close_prices[-1]
        latest_ema = ema[-1]

        # Determine signal
        if latest_price > latest_ema * 1.02:  # 2% above EMA
            signal = "buy"
            color = "#36bd5a"
        elif latest_price < latest_ema * 0.98:  # 2% below EMA
            signal = "sell"
            color = "#e03131"
        else:
            signal = "neutral"
            color = "#787878"

        if period == 34:
            color = "#1e88e5"  # Blue
        elif period == 89:
            color = "#9c27b0"  # Purple
        elif period == 200:
            color = "#ff9800"  # Orange

        return {
            "type": "ema",
            "value": ema.tolist(),
            "signal": signal,
            "color": color
        }

    def _calculate_macd(self, df: pd.DataFrame, fast_period: int = 12, slow_period: int = 26, signal_period: int = 9) -> tuple:
        """
        Calculate MACD (Moving Average Convergence Divergence)

        Args:
            df: DataFrame with price data
            fast_period: Fast EMA period
            slow_period: Slow EMA period
            signal_period: Signal line period

        Returns:
            Tuple of (MACD line, Signal line, Histogram)
        """
        # Get close prices
        close_prices = np.array(df["close"].values)

        # Calculate EMAs
        ema_fast = np.zeros_like(close_prices)
        ema_slow = np.zeros_like(close_prices)

        ema_fast[0] = close_prices[0]
        ema_slow[0] = close_prices[0]

        multiplier_fast = 2 / (fast_period + 1)
        multiplier_slow = 2 / (slow_period + 1)

        for i in range(1, len(close_prices)):
            ema_fast[i] = (close_prices[i] - ema_fast[i-1]) * multiplier_fast + ema_fast[i-1]
            ema_slow[i] = (close_prices[i] - ema_slow[i-1]) * multiplier_slow + ema_slow[i-1]

        # Calculate MACD line
        macd_line = ema_fast - ema_slow

        # Calculate signal line
        signal_line = np.zeros_like(macd_line)
        signal_line[0] = macd_line[0]

        multiplier_signal = 2 / (signal_period + 1)

        for i in range(1, len(macd_line)):
            signal_line[i] = (macd_line[i] - signal_line[i-1]) * multiplier_signal + signal_line[i-1]

        # Calculate histogram
        histogram = macd_line - signal_line

        return macd_line.tolist(), signal_line.tolist(), histogram.tolist()

    def _determine_trend(self, df: pd.DataFrame, indicators: Dict[str, Any]) -> tuple:
        """
        Determine overall trend and trading signal

        Args:
            df: DataFrame with price data
            indicators: Dictionary of calculated indicators

        Returns:
            Tuple of (trend, signal)
        """
        # Get close prices
        close_prices = np.array(df["close"].values)

        # Determine trend based on EMAs
        ema_short = np.array(indicators["ema34"]["value"])
        ema_mid = np.array(indicators["ema89"]["value"])
        ema_long = np.array(indicators["ema200"]["value"])

        latest_price = close_prices[-1]
        latest_short = ema_short[-1]
        latest_mid = ema_mid[-1]
        latest_long = ema_long[-1]

        # Determine trend based on EMA alignment
        if latest_price > latest_short > latest_mid > latest_long:
            trend = "bullish"
        elif latest_price < latest_short < latest_mid < latest_long:
            trend = "bearish"
        else:
            trend = "sideways"

        # Determine signal based on RSI and trend
        rsi_value = indicators["rsi"]["value"]

        if trend == "bullish" and rsi_value < 70:
            signal = "buy"
        elif trend == "bearish" and rsi_value > 30:
            signal = "sell"
        else:
            signal = "neutral"

        return trend, signal

    def _calculate_trend_strength(self, df: pd.DataFrame, indicators: Dict[str, Any]) -> float:
        """
        Calculate trend strength (0-1)

        Args:
            df: DataFrame with price data
            indicators: Dictionary of calculated indicators

        Returns:
            Trend strength value (0-1)
        """
        # Get RSI as a component of strength
        rsi = indicators["rsi"]["value"]

        # Normalize RSI to 0-1 scale
        if rsi > 50:
            rsi_component = (rsi - 50) / 50  # 0.0 to 1.0 for RSI 50-100
        else:
            rsi_component = (50 - rsi) / 50  # 0.0 to 1.0 for RSI 0-50

        # Get EMA alignment as a component
        ema_short = np.array(indicators["ema34"]["value"])
        ema_mid = np.array(indicators["ema89"]["value"])
        ema_long = np.array(indicators["ema200"]["value"])

        # Calculate average distance between EMAs as percentage
        latest_short = ema_short[-1]
        latest_mid = ema_mid[-1]
        latest_long = ema_long[-1]

        # Calculate distances
        short_mid_dist = abs(latest_short - latest_mid) / latest_mid
        mid_long_dist = abs(latest_mid - latest_long) / latest_long

        # Normalize to 0-1 scale (cap at 10% difference)
        ema_component = min((short_mid_dist + mid_long_dist) / 0.2, 1.0)

        # Combine components
        strength = (rsi_component * 0.4) + (ema_component * 0.6)
        return float(strength)

# Define dependencies outside the class
AnalysisService.depends_on(RedisService, MarketService)
