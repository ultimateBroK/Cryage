from binance.client import Client
from binance.exceptions import BinanceAPIException
from typing import Dict, List, Optional, Any
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BinanceTool:
    def __init__(self):
        """Initialize Binance client with API keys from environment variables."""
        self.api_key = os.getenv("BINANCE_API_KEY", "")
        self.api_secret = os.getenv("BINANCE_API_SECRET", "")
        
        if self.api_key and self.api_secret:
            self.client = Client(self.api_key, self.api_secret)
        else:
            # Use public client for price data only
            self.client = Client()
            logger.warning("Binance API keys not found. Using public client for price data only.")
    
    def get_crypto_price(self, symbol: str) -> Dict[str, Any]:
        """
        Lấy giá hiện tại của cặp coin.
        
        Args:
            symbol: Cặp coin (ví dụ: 'BTCUSDT', 'ETHUSDT')
            
        Returns:
            Dict chứa thông tin giá
        """
        try:
            ticker = self.client.get_symbol_ticker(symbol=symbol)
            return {
                "symbol": symbol,
                "price": float(ticker['price']),
                "status": "success"
            }
        except BinanceAPIException as e:
            logger.error(f"Binance API error: {e}")
            return {
                "symbol": symbol,
                "price": None,
                "error": str(e),
                "status": "error"
            }
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return {
                "symbol": symbol,
                "price": None,
                "error": str(e),
                "status": "error"
            }
    
    def get_24hr_ticker(self, symbol: str) -> Dict[str, Any]:
        """
        Lấy thông tin 24h ticker cho symbol.
        
        Args:
            symbol: Cặp coin
            
        Returns:
            Dict chứa thông tin 24h
        """
        try:
            ticker = self.client.get_ticker(symbol=symbol)
            return {
                "symbol": symbol,
                "price": float(ticker['lastPrice']),
                "price_change": float(ticker['priceChange']),
                "price_change_percent": float(ticker['priceChangePercent']),
                "high": float(ticker['highPrice']),
                "low": float(ticker['lowPrice']),
                "volume": float(ticker['volume']),
                "count": int(ticker['count']),
                "status": "success"
            }
        except Exception as e:
            logger.error(f"Error getting 24hr ticker: {e}")
            return {
                "symbol": symbol,
                "error": str(e),
                "status": "error"
            }
    
    def get_klines(self, symbol: str, interval: str = "1h", limit: int = 100) -> Dict[str, Any]:
        """
        Lấy dữ liệu kline (candlestick) cho phân tích kỹ thuật.
        
        Args:
            symbol: Cặp coin
            interval: Khoảng thời gian (1m, 5m, 15m, 1h, 4h, 1d)
            limit: Số lượng kline
            
        Returns:
            Dict chứa dữ liệu kline
        """
        try:
            klines = self.client.get_klines(symbol=symbol, interval=interval, limit=limit)
            
            # Convert to more readable format
            formatted_klines = []
            for kline in klines:
                formatted_klines.append({
                    "open_time": int(kline[0]),
                    "open": float(kline[1]),
                    "high": float(kline[2]),
                    "low": float(kline[3]),
                    "close": float(kline[4]),
                    "volume": float(kline[5]),
                    "close_time": int(kline[6]),
                    "quote_volume": float(kline[7]),
                    "count": int(kline[8]),
                    "taker_buy_volume": float(kline[9]),
                    "taker_buy_quote_volume": float(kline[10])
                })
            
            return {
                "symbol": symbol,
                "interval": interval,
                "klines": formatted_klines,
                "status": "success"
            }
        except Exception as e:
            logger.error(f"Error getting klines: {e}")
            return {
                "symbol": symbol,
                "error": str(e),
                "status": "error"
            }
    
    def get_market_depth(self, symbol: str, limit: int = 100) -> Dict[str, Any]:
        """
        Lấy order book depth.
        
        Args:
            symbol: Cặp coin
            limit: Số lượng orders (5, 10, 20, 50, 100, 500, 1000, 5000)
            
        Returns:
            Dict chứa order book
        """
        try:
            depth = self.client.get_order_book(symbol=symbol, limit=limit)
            return {
                "symbol": symbol,
                "bids": [[float(price), float(qty)] for price, qty in depth['bids']],
                "asks": [[float(price), float(qty)] for price, qty in depth['asks']],
                "status": "success"
            }
        except Exception as e:
            logger.error(f"Error getting market depth: {e}")
            return {
                "symbol": symbol,
                "error": str(e),
                "status": "error"
            }

# Global instance
binance_tool = BinanceTool()

# Convenience functions for easy access
def get_crypto_price(symbol: str) -> float:
    """Lấy giá hiện tại của crypto."""
    result = binance_tool.get_crypto_price(symbol)
    return result.get("price", 0.0)

def get_crypto_24hr_data(symbol: str) -> Dict[str, Any]:
    """Lấy dữ liệu 24h của crypto."""
    return binance_tool.get_24hr_ticker(symbol)

def get_crypto_klines(symbol: str, interval: str = "1h", limit: int = 100) -> Dict[str, Any]:
    """Lấy dữ liệu kline cho phân tích kỹ thuật."""
    return binance_tool.get_klines(symbol, interval, limit)
