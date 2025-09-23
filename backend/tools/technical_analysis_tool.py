import pandas as pd
import numpy as np
from typing import Dict, List, Any, Tuple
import logging

logger = logging.getLogger(__name__)

class TechnicalAnalysisTool:
    """Tool for technical analysis calculations."""
    
    @staticmethod
    def calculate_ema(prices: List[float], period: int) -> List[float]:
        """
        Tính Exponential Moving Average (EMA).
        
        Args:
            prices: Danh sách giá
            period: Chu kỳ EMA
            
        Returns:
            List EMA values
        """
        if len(prices) < period:
            return [np.nan] * len(prices)
        
        df = pd.DataFrame({'price': prices})
        ema = df['price'].ewm(span=period, adjust=False).mean()
        return ema.tolist()
    
    @staticmethod
    def calculate_macd(prices: List[float], fast: int = 12, slow: int = 26, signal: int = 9) -> Dict[str, List[float]]:
        """
        Tính MACD indicator.
        
        Args:
            prices: Danh sách giá
            fast: Fast EMA period
            slow: Slow EMA period
            signal: Signal line period
            
        Returns:
            Dict với MACD line, signal line, histogram
        """
        if len(prices) < slow:
            return {"macd": [np.nan] * len(prices), "signal": [np.nan] * len(prices), "histogram": [np.nan] * len(prices)}
        
        df = pd.DataFrame({'price': prices})
        ema_fast = df['price'].ewm(span=fast, adjust=False).mean()
        ema_slow = df['price'].ewm(span=slow, adjust=False).mean()
        
        macd_line = ema_fast - ema_slow
        signal_line = macd_line.ewm(span=signal, adjust=False).mean()
        histogram = macd_line - signal_line
        
        return {
            "macd": macd_line.tolist(),
            "signal": signal_line.tolist(),
            "histogram": histogram.tolist()
        }
    
    @staticmethod
    def calculate_rsi(prices: List[float], period: int = 14) -> List[float]:
        """
        Tính Relative Strength Index (RSI).
        
        Args:
            prices: Danh sách giá
            period: Chu kỳ RSI
            
        Returns:
            List RSI values
        """
        if len(prices) < period + 1:
            return [np.nan] * len(prices)
        
        df = pd.DataFrame({'price': prices})
        delta = df['price'].diff()
        
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        
        return rsi.tolist()
    
    @staticmethod
    def calculate_bollinger_bands(prices: List[float], period: int = 20, std_dev: float = 2) -> Dict[str, List[float]]:
        """
        Tính Bollinger Bands.
        
        Args:
            prices: Danh sách giá
            period: Chu kỳ SMA
            std_dev: Standard deviation multiplier
            
        Returns:
            Dict với upper, middle, lower bands
        """
        if len(prices) < period:
            return {"upper": [np.nan] * len(prices), "middle": [np.nan] * len(prices), "lower": [np.nan] * len(prices)}
        
        df = pd.DataFrame({'price': prices})
        sma = df['price'].rolling(window=period).mean()
        std = df['price'].rolling(window=period).std()
        
        upper_band = sma + (std * std_dev)
        lower_band = sma - (std * std_dev)
        
        return {
            "upper": upper_band.tolist(),
            "middle": sma.tolist(),
            "lower": lower_band.tolist()
        }
    
    @staticmethod
    def find_support_resistance(prices: List[float], window: int = 5) -> Dict[str, List[float]]:
        """
        Tìm support và resistance levels.
        
        Args:
            prices: Danh sách giá
            window: Window size để tìm local extrema
            
        Returns:
            Dict với support và resistance levels
        """
        if len(prices) < window * 2:
            return {"support": [], "resistance": []}
        
        df = pd.DataFrame({'price': prices})
        
        # Find local minima (support)
        support = df['price'].rolling(window=window, center=True).min() == df['price']
        support_levels = df[support]['price'].tolist()
        
        # Find local maxima (resistance)
        resistance = df['price'].rolling(window=window, center=True).max() == df['price']
        resistance_levels = df[resistance]['price'].tolist()
        
        return {
            "support": support_levels,
            "resistance": resistance_levels
        }
    
    @staticmethod
    def analyze_trend(prices: List[float], short_period: int = 20, long_period: int = 50) -> Dict[str, Any]:
        """
        Phân tích trend của giá.
        
        Args:
            prices: Danh sách giá
            short_period: Chu kỳ EMA ngắn
            long_period: Chu kỳ EMA dài
            
        Returns:
            Dict với trend analysis
        """
        if len(prices) < long_period:
            return {"trend": "insufficient_data", "strength": 0}
        
        ema_short = TechnicalAnalysisTool.calculate_ema(prices, short_period)
        ema_long = TechnicalAnalysisTool.calculate_ema(prices, long_period)
        
        current_price = prices[-1]
        current_ema_short = ema_short[-1]
        current_ema_long = ema_long[-1]
        
        # Determine trend
        if current_ema_short > current_ema_long and current_price > current_ema_short:
            trend = "bullish"
        elif current_ema_short < current_ema_long and current_price < current_ema_short:
            trend = "bearish"
        else:
            trend = "sideways"
        
        # Calculate trend strength
        if not np.isnan(current_ema_short) and not np.isnan(current_ema_long):
            strength = abs(current_ema_short - current_ema_long) / current_ema_long * 100
        else:
            strength = 0
        
        return {
            "trend": trend,
            "strength": round(strength, 2),
            "ema_short": current_ema_short,
            "ema_long": current_ema_long,
            "current_price": current_price
        }

# Global instance
technical_analysis_tool = TechnicalAnalysisTool()

# Convenience functions
def calculate_indicators(prices: List[float]) -> Dict[str, Any]:
    """Tính tất cả indicators cho một danh sách giá."""
    return {
        "ema_34": TechnicalAnalysisTool.calculate_ema(prices, 34),
        "ema_89": TechnicalAnalysisTool.calculate_ema(prices, 89),
        "macd": TechnicalAnalysisTool.calculate_macd(prices),
        "rsi": TechnicalAnalysisTool.calculate_rsi(prices),
        "bollinger_bands": TechnicalAnalysisTool.calculate_bollinger_bands(prices),
        "support_resistance": TechnicalAnalysisTool.find_support_resistance(prices),
        "trend_analysis": TechnicalAnalysisTool.analyze_trend(prices)
    }
