from agno.agent import Agent
from agno.team import Team
from agno.models.gemini import Gemini
from agno.memory.v2.memory import Memory
from agno.memory.v2.db.postgres import PostgresMemoryDb
from agno.storage.postgres import PostgresStorage
from agno.knowledge.agent import AgentKnowledge
from agno.vectordb.pgvector import PgVector
from typing import Dict, Any, Optional, List
import logging
import os
from datetime import datetime

from tools.binance_tool import binance_tool
from tools.technical_analysis_tool import technical_analysis_tool
import pandas as pd

logger = logging.getLogger(__name__)

class ModernTradingTeam:
    """Modern trading team using latest Agno v1.8.2 features."""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize modern trading team with latest Agno features.
        
        Args:
            api_key: Gemini API key
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        
        # Configure Gemini model with latest parameters
        self.model = Gemini(
            id="gemini-2.0-flash-exp",
            project_id=os.getenv("GOOGLE_CLOUD_PROJECT"),
            location=os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1"),
            vertexai=True
        )
        
        # Set up persistent memory with PostgreSQL
        self.memory = Memory(
            model=self.model,
            db=PostgresMemoryDb(
                table_name="trading_memories",
                db_url=os.getenv("DATABASE_URL", "postgresql://localhost:5432/cryage")
            )
        )
        
        # Configure storage for session history
        self.storage = PostgresStorage(
            table_name="trading_sessions",
            db_url=os.getenv("DATABASE_URL", "postgresql://localhost:5432/cryage")
        )
        
        # Set up knowledge base with hybrid search
        self.knowledge = AgentKnowledge(
            vector_db=PgVector(
                table_name="trading_knowledge",
                db_url=os.getenv("DATABASE_URL", "postgresql://localhost:5432/cryage"),
                search_type="hybrid"  # Latest hybrid search feature
            )
        )
        
        # Create specialized agents
        self.researcher_agent = self._create_researcher_agent()
        self.analyst_agent = self._create_analyst_agent()
        self.decision_agent = self._create_decision_agent()
        
        # Create collaborative team with latest workflow features
        self.team = Team(
            agents=[self.researcher_agent, self.analyst_agent, self.decision_agent],
            workflow="collaborate",
            role="Crypto Trading Analysis Team",
            description="Expert team specializing in cryptocurrency market analysis and trading decisions",
            memory=self.memory,
            storage=self.storage,
            knowledge=self.knowledge,
            enable_agentic_memory=True,
            add_history_to_messages=True,
            num_history_runs=10,
            markdown=True,
            show_member_responses=True  # Fixed in v1.8.2
        )
        
        logger.info("Modern trading team initialized with Agno v1.8.2")
    
    def _create_researcher_agent(self) -> Agent:
        """Create market researcher agent with latest Agno features."""
        return Agent(
            model=self.model,
            role="Market Researcher",
            description="Expert in cryptocurrency market research and data analysis",
            instructions=[
                "Analyze market trends and sentiment from multiple sources",
                "Gather relevant market data and news",
                "Identify key market indicators and patterns",
                "Provide comprehensive market context"
            ],
            tools=[binance_tool],
            memory=self.memory,
            storage=self.storage,
            knowledge=self.knowledge,
            markdown=True,
            # Use latest output model feature for specialized formatting
            output_model=None,  # Can be set to Pydantic model for structured output
            timezone_identifier="Asia/Ho_Chi_Minh"
        )
    
    def _create_analyst_agent(self) -> Agent:
        """Create technical analyst agent."""
        return Agent(
            model=self.model,
            role="Technical Analyst",
            description="Expert in technical analysis and chart patterns",
            instructions=[
                "Perform comprehensive technical analysis",
                "Calculate and interpret technical indicators",
                "Identify support/resistance levels and chart patterns",
                "Assess momentum and trend strength"
            ],
            tools=[technical_analysis_tool, binance_tool],
            memory=self.memory,
            storage=self.storage,
            knowledge=self.knowledge,
            markdown=True,
            timezone_identifier="Asia/Ho_Chi_Minh"
        )
    
    def _create_decision_agent(self) -> Agent:
        """Create trading decision agent."""
        return Agent(
            model=self.model,
            role="Trading Decision Maker",
            description="Expert in making trading decisions based on analysis",
            instructions=[
                "Synthesize research and technical analysis",
                "Make clear trading recommendations with rationale",
                "Set appropriate entry, stop-loss, and take-profit levels",
                "Consider risk management principles",
                "Provide clear reasoning for all recommendations"
            ],
            tools=[binance_tool],
            memory=self.memory,
            storage=self.storage,
            knowledge=self.knowledge,
            markdown=True,
            timezone_identifier="Asia/Ho_Chi_Minh"
        )
    
    async def analyze_market_async(self, symbol: str, user_input: str, user_id: str = "default") -> Dict[str, Any]:
        """
        Async market analysis using modern Agno features.
        
        Args:
            symbol: Trading symbol (e.g., 'BTCUSDT')
            user_input: User's question/request
            user_id: User identifier for session management
            
        Returns:
            Dict with analysis results
        """
        try:
            # Get current market data
            market_data = await self._get_market_data_async(symbol)
            
            # Prepare enhanced input with context
            enhanced_input = f"""
            Phân tích thị trường cho {symbol}:
            
            Dữ liệu thị trường hiện tại:
            - Giá hiện tại: {market_data.get('current_price', 'N/A')}
            - Thay đổi 24h: {market_data.get('price_change_24h', 'N/A')}%
            - Khối lượng 24h: {market_data.get('volume_24h', 'N/A')}
            - Cao nhất 24h: {market_data.get('high_24h', 'N/A')}
            - Thấp nhất 24h: {market_data.get('low_24h', 'N/A')}
            
            Phân tích kỹ thuật:
            {market_data.get('technical_analysis', 'N/A')}
            
            Yêu cầu từ người dùng: {user_input}
            
            Hãy phân tích toàn diện và đưa ra khuyến nghị trading cụ thể.
            """
            
            # Use async team run with streaming support
            response = await self.team.arun(
                enhanced_input,
                user_id=user_id,
                stream=False  # Set to True for streaming responses
            )
            
            # Extract trading signal from response
            signal_data = self._extract_trading_signal(response.content, symbol)
            
            # Store analysis in knowledge base
            await self._store_analysis_async(symbol, response.content, signal_data)
            
            return {
                "response": response.content,
                "market_data": market_data,
                "signal": signal_data,
                "timestamp": datetime.now().isoformat(),
                "session_id": response.session_id if hasattr(response, 'session_id') else None
            }
            
        except Exception as e:
            logger.error(f"Error in async market analysis: {e}")
            return {
                "error": str(e),
                "response": "Xin lỗi, tôi gặp lỗi khi phân tích thị trường.",
                "timestamp": datetime.now().isoformat()
            }
    
    def analyze_market(self, symbol: str, user_input: str, user_id: str = "default") -> Dict[str, Any]:
        """
        Synchronous market analysis for backward compatibility.
        
        Args:
            symbol: Trading symbol
            user_input: User's question/request  
            user_id: User identifier
            
        Returns:
            Dict with analysis results
        """
        try:
            # Get current market data
            market_data = self._get_market_data(symbol)
            
            # Prepare enhanced input
            enhanced_input = f"""
            Phân tích thị trường cho {symbol}:
            
            Dữ liệu thị trường hiện tại:
            - Giá hiện tại: {market_data.get('current_price', 'N/A')}
            - Thay đổi 24h: {market_data.get('price_change_24h', 'N/A')}%
            - Khối lượng 24h: {market_data.get('volume_24h', 'N/A')}
            
            Phân tích kỹ thuật:
            {market_data.get('technical_analysis', 'N/A')}
            
            Yêu cầu: {user_input}
            """
            
            # Use synchronous team run
            response = self.team.run(enhanced_input, user_id=user_id)
            
            # Extract trading signal
            signal_data = self._extract_trading_signal(response.content, symbol)
            
            return {
                "response": response.content,
                "market_data": market_data,
                "signal": signal_data,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error in market analysis: {e}")
            return {
                "error": str(e),
                "response": "Xin lỗi, tôi gặp lỗi khi phân tích thị trường.",
                "timestamp": datetime.now().isoformat()
            }
    
    async def _get_market_data_async(self, symbol: str) -> Dict[str, Any]:
        """Get comprehensive market data asynchronously."""
        # Implementation similar to sync version but with async operations
        return self._get_market_data(symbol)
    
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
    
    async def _store_analysis_async(self, symbol: str, analysis: str, signal_data: Optional[Dict]) -> None:
        """Store analysis in knowledge base asynchronously."""
        try:
            # Create document for knowledge base
            analysis_doc = {
                "title": f"Market Analysis - {symbol} - {datetime.now().strftime('%Y-%m-%d %H:%M')}",
                "content": analysis,
                "metadata": {
                    "symbol": symbol,
                    "timestamp": datetime.now().isoformat(),
                    "type": "market_analysis",
                    "signal": signal_data.get("signal") if signal_data else None
                }
            }
            
            # Add to knowledge base (async operation in newer versions)
            await self.knowledge.aadd_text(
                text=analysis,
                metadata=analysis_doc["metadata"]
            )
            
        except Exception as e:
            logger.error(f"Error storing analysis: {e}")
    
    def _format_technical_analysis(self, indicators: Dict[str, Any]) -> str:
        """Format technical analysis for display."""
        if not indicators:
            return "Chưa có dữ liệu phân tích kỹ thuật"
        
        analysis_parts = []
        
        # EMA Analysis
        if indicators.get("ema_34") and indicators.get("ema_89"):
            ema_34 = indicators["ema_34"][-1]
            ema_89 = indicators["ema_89"][-1]
            if not (pd.isna(ema_34) or pd.isna(ema_89)):
                if ema_34 > ema_89:
                    analysis_parts.append("EMA 34 > EMA 89 (Xu hướng tăng)")
                else:
                    analysis_parts.append("EMA 34 < EMA 89 (Xu hướng giảm)")
        
        # RSI Analysis
        if indicators.get("rsi"):
            rsi = indicators["rsi"][-1]
            if not pd.isna(rsi):
                if rsi > 70:
                    analysis_parts.append(f"RSI {rsi:.1f} (Quá mua)")
                elif rsi < 30:
                    analysis_parts.append(f"RSI {rsi:.1f} (Quá bán)")
                else:
                    analysis_parts.append(f"RSI {rsi:.1f} (Trung tính)")
        
        # MACD Analysis
        if indicators.get("macd"):
            macd = indicators["macd"]
            if macd.get("macd") and macd.get("signal"):
                macd_line = macd["macd"][-1]
                signal_line = macd["signal"][-1]
                if not (pd.isna(macd_line) or pd.isna(signal_line)):
                    if macd_line > signal_line:
                        analysis_parts.append("MACD > Signal (Tích cực)")
                    else:
                        analysis_parts.append("MACD < Signal (Tiêu cực)")
        
        return "; ".join(analysis_parts) if analysis_parts else "Chưa có chỉ báo kỹ thuật"
    
    def _extract_trading_signal(self, response: str, symbol: str) -> Optional[Dict[str, Any]]:
        """Extract trading signal from team response."""
        response_lower = response.lower()
        
        signal_data = {
            "symbol": symbol,
            "timestamp": datetime.now().isoformat()
        }
        
        # Extract signal type (Vietnamese and English)
        if any(word in response_lower for word in ["buy", "mua", "mở long"]):
            signal_data["signal"] = "BUY"
        elif any(word in response_lower for word in ["sell", "bán", "mở short"]):
            signal_data["signal"] = "SELL"
        elif any(word in response_lower for word in ["hold", "giữ", "chờ"]):
            signal_data["signal"] = "HOLD"
        else:
            return None
        
        # Extract levels
        lines = response.split('\n')
        for line in lines:
            line_lower = line.lower()
            if any(word in line_lower for word in ["entry", "vào lệnh"]):
                signal_data["entry"] = line.strip()
            elif any(word in line_lower for word in ["stop", "cắt lỗ"]):
                signal_data["stop_loss"] = line.strip()
            elif any(word in line_lower for word in ["profit", "target", "chốt lời"]):
                signal_data["take_profit"] = line.strip()
        
        signal_data["reasoning"] = response
        return signal_data
    
    def get_team_status(self) -> Dict[str, Any]:
        """Get team status and statistics."""
        return {
            "agents": [
                {
                    "name": "Market Researcher",
                    "role": "Market data collection and research"
                },
                {
                    "name": "Technical Analyst", 
                    "role": "Technical analysis and indicators"
                },
                {
                    "name": "Trading Decision Maker",
                    "role": "Trading recommendations and risk management"
                }
            ],
            "workflow": "collaborate",
            "features": [
                "Persistent memory with PostgreSQL",
                "Hybrid search knowledge base",
                "Async support",
                "Session management",
                "Vietnamese language support"
            ],
            "agno_version": "1.8.2",
            "model": "gemini-2.0-flash-exp"
        }

# Factory functions for backward compatibility
def create_trading_team(api_key: Optional[str] = None) -> ModernTradingTeam:
    """Create a new modern trading team instance."""
    return ModernTradingTeam(api_key)

async def run_workflow_async(user_input: str, symbol: str = "BTCUSDT", 
                           api_key: Optional[str] = None, user_id: str = "default") -> Dict[str, Any]:
    """
    Run the complete trading workflow asynchronously.
    
    Args:
        user_input: User's question/request
        symbol: Trading symbol
        api_key: Gemini API key
        user_id: User identifier
        
    Returns:
        Dict with workflow results
    """
    team = create_trading_team(api_key)
    return await team.analyze_market_async(symbol, user_input, user_id)

def run_workflow(user_input: str, symbol: str = "BTCUSDT", 
                api_key: Optional[str] = None, user_id: str = "default") -> Dict[str, Any]:
    """
    Run the complete trading workflow (sync version).
    
    Args:
        user_input: User's question/request
        symbol: Trading symbol  
        api_key: Gemini API key
        user_id: User identifier
        
    Returns:
        Dict with workflow results
    """
    team = create_trading_team(api_key)
    return team.analyze_market(symbol, user_input, user_id)