from agno.team import Team
from typing import Dict, Any, Optional, List
import logging
from datetime import datetime

from agents.researcher import create_researcher_agent
from agents.decision_maker import create_decision_maker_agent
from agents.trader import create_trader_agent
from memory.memory_manager import trading_memory
from storage.vector_db import vector_db
from tools.binance_tool import binance_tool
from tools.technical_analysis_tool import technical_analysis_tool
import pandas as pd

logger = logging.getLogger(__name__)

class TradingTeam:
    """Trading team with collaborative workflow between agents."""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize trading team.
        
        Args:
            api_key: Gemini API key
        """
        self.api_key = api_key
        self.researcher = create_researcher_agent(api_key)
        self.decision_maker = create_decision_maker_agent(api_key)
        self.trader = create_trader_agent(api_key)
        
        # Create team with collaborative workflow
        self.team = Team(
            agents=[self.researcher, self.decision_maker, self.trader],
            workflow="collaborate"
        )
        
        logger.info("Trading team initialized")
    
    def analyze_market(self, symbol: str, user_input: str) -> Dict[str, Any]:
        """
        Analyze market using the full team workflow.
        
        Args:
            symbol: Trading symbol (e.g., 'BTCUSDT')
            user_input: User's question/request
            
        Returns:
            Dict with analysis results
        """
        try:
            # Get current market data
            market_data = self._get_market_data(symbol)
            
            # Get relevant context from vector database
            context = vector_db.get_relevant_context(user_input, "all", top_k=3)
            
            # Get recent memory context
            memory_context = trading_memory.get_context_for_agent("all", context_length=3)
            
            # Prepare enhanced input with context
            enhanced_input = f"""
            Market Data for {symbol}:
            Current Price: {market_data.get('current_price', 'N/A')}
            Price Change 24h: {market_data.get('price_change_24h', 'N/A')}%
            Volume 24h: {market_data.get('volume_24h', 'N/A')}
            
            Technical Analysis:
            {market_data.get('technical_analysis', 'N/A')}
            
            Relevant Context:
            {context}
            
            Recent Memory:
            {memory_context}
            
            User Question: {user_input}
            """
            
            # Get team response
            team_response = self.team.chat(enhanced_input)
            
            # Store interaction in memory
            trading_memory.add_chat_interaction(
                user_input=user_input,
                agent_response=team_response,
                agent_name="TradingTeam"
            )
            
            # Extract trading signal if present
            signal_data = self._extract_trading_signal(team_response, symbol)
            if signal_data:
                trading_memory.add_trading_signal(signal_data)
                vector_db.insert_trading_signal(signal_data)
            
            # Store market analysis
            analysis_data = {
                "title": f"Market Analysis for {symbol}",
                "summary": team_response,
                "symbol": symbol,
                "timestamp": datetime.now().isoformat()
            }
            trading_memory.add_market_analysis(analysis_data)
            vector_db.insert_market_analysis(analysis_data)
            
            return {
                "response": team_response,
                "market_data": market_data,
                "signal": signal_data,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error in market analysis: {e}")
            return {
                "error": str(e),
                "response": "Sorry, I encountered an error while analyzing the market.",
                "timestamp": datetime.now().isoformat()
            }
    
    def _get_market_data(self, symbol: str) -> Dict[str, Any]:
        """Get comprehensive market data for symbol."""
        try:
            # Get current price and 24h data
            price_data = binance_tool.get_crypto_price(symbol)
            ticker_data = binance_tool.get_24hr_ticker(symbol)
            klines_data = binance_tool.get_klines(symbol, "1h", 100)
            
            # Calculate technical indicators
            if klines_data.get("status") == "success":
                prices = [float(kline["close"]) for kline in klines_data["klines"]]
                indicators = technical_analysis_tool.calculate_indicators(prices)
            else:
                indicators = {}
            
            return {
                "current_price": price_data.get("price"),
                "price_change_24h": ticker_data.get("price_change_percent"),
                "volume_24h": ticker_data.get("volume"),
                "high_24h": ticker_data.get("high"),
                "low_24h": ticker_data.get("low"),
                "technical_analysis": self._format_technical_analysis(indicators),
                "klines": klines_data.get("klines", [])[-10:] if klines_data.get("status") == "success" else []
            }
            
        except Exception as e:
            logger.error(f"Error getting market data: {e}")
            return {"error": str(e)}
    
    def _format_technical_analysis(self, indicators: Dict[str, Any]) -> str:
        """Format technical analysis for display."""
        if not indicators:
            return "Technical analysis not available"
        
        analysis_parts = []
        
        # EMA Analysis
        if indicators.get("ema_34") and indicators.get("ema_89"):
            ema_34 = indicators["ema_34"][-1]
            ema_89 = indicators["ema_89"][-1]
            if not (pd.isna(ema_34) or pd.isna(ema_89)):
                if ema_34 > ema_89:
                    analysis_parts.append("EMA 34 > EMA 89 (Bullish trend)")
                else:
                    analysis_parts.append("EMA 34 < EMA 89 (Bearish trend)")
        
        # RSI Analysis
        if indicators.get("rsi"):
            rsi = indicators["rsi"][-1]
            if not pd.isna(rsi):
                if rsi > 70:
                    analysis_parts.append(f"RSI {rsi:.1f} (Overbought)")
                elif rsi < 30:
                    analysis_parts.append(f"RSI {rsi:.1f} (Oversold)")
                else:
                    analysis_parts.append(f"RSI {rsi:.1f} (Neutral)")
        
        # MACD Analysis
        if indicators.get("macd"):
            macd = indicators["macd"]
            if macd.get("macd") and macd.get("signal"):
                macd_line = macd["macd"][-1]
                signal_line = macd["signal"][-1]
                if not (pd.isna(macd_line) or pd.isna(signal_line)):
                    if macd_line > signal_line:
                        analysis_parts.append("MACD > Signal (Bullish)")
                    else:
                        analysis_parts.append("MACD < Signal (Bearish)")
        
        # Trend Analysis
        if indicators.get("trend_analysis"):
            trend = indicators["trend_analysis"]
            analysis_parts.append(f"Trend: {trend.get('trend', 'Unknown')} (Strength: {trend.get('strength', 0)}%)")
        
        return "; ".join(analysis_parts) if analysis_parts else "No technical indicators available"
    
    def _extract_trading_signal(self, response: str, symbol: str) -> Optional[Dict[str, Any]]:
        """Extract trading signal from team response."""
        response_lower = response.lower()
        
        signal_data = {
            "symbol": symbol,
            "timestamp": datetime.now().isoformat()
        }
        
        # Extract signal type
        if "buy" in response_lower or "mua" in response_lower:
            signal_data["signal"] = "BUY"
        elif "sell" in response_lower or "bán" in response_lower:
            signal_data["signal"] = "SELL"
        elif "hold" in response_lower or "giữ" in response_lower:
            signal_data["signal"] = "HOLD"
        else:
            return None
        
        # Extract entry, stop loss, take profit (basic extraction)
        lines = response.split('\n')
        for line in lines:
            line_lower = line.lower()
            if "entry" in line_lower:
                signal_data["entry"] = line.strip()
            elif "stop" in line_lower:
                signal_data["stop_loss"] = line.strip()
            elif "profit" in line_lower or "target" in line_lower:
                signal_data["take_profit"] = line.strip()
        
        signal_data["reasoning"] = response
        
        return signal_data
    
    def get_team_status(self) -> Dict[str, Any]:
        """Get team status and statistics."""
        return {
            "agents": ["Researcher", "DecisionMaker", "Trader"],
            "workflow": "collaborate",
            "memory_items": len(trading_memory.chat_history),
            "signals_count": len(trading_memory.trading_signals),
            "analysis_count": len(trading_memory.market_analysis),
            "vector_db_stats": vector_db.get_index_stats()
        }

def create_trading_team(api_key: Optional[str] = None) -> TradingTeam:
    """Create a new trading team instance."""
    return TradingTeam(api_key)

def run_workflow(user_input: str, symbol: str = "BTCUSDT", api_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Run the complete trading workflow.
    
    Args:
        user_input: User's question/request
        symbol: Trading symbol
        api_key: Gemini API key
        
    Returns:
        Dict with workflow results
    """
    team = create_trading_team(api_key)
    return team.analyze_market(symbol, user_input)
