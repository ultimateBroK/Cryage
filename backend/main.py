from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import uvicorn
import os
import logging
from datetime import datetime

# Import trading system components
from teams.trading_team import create_trading_team, run_workflow
from memory.memory_manager import trading_memory
from storage.vector_db import vector_db
from tools.binance_tool import binance_tool
from evals.eval_agent import TradingAgentEvaluator

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Cryage Trading Backend",
    description="Backend API for Cryage crypto trading agent with Agno + Gemini",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserMessage(BaseModel):
    message: str
    symbol: Optional[str] = "BTCUSDT"

class TradingSignal(BaseModel):
    signal: str
    symbol: str
    entry: Optional[str] = None
    stop_loss: Optional[str] = None
    take_profit: Optional[str] = None
    reasoning: str

class MarketAnalysisRequest(BaseModel):
    symbol: str
    analysis_type: Optional[str] = "comprehensive"

class EvaluationRequest(BaseModel):
    test_type: Optional[str] = "all"
    api_key: Optional[str] = None

# Initialize trading team
trading_team = None

def get_trading_team():
    """Get or create trading team instance."""
    global trading_team
    if trading_team is None:
        api_key = os.getenv("GEMINI_API_KEY")
        trading_team = create_trading_team(api_key)
    return trading_team

@app.get("/")
async def root():
    return {
        "message": "Cryage Trading Backend API",
        "version": "1.0.0",
        "features": ["trading_analysis", "market_data", "memory", "vector_db", "evaluation"]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "cryage-trading-backend",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/trade-predict")
async def trade_predict(user_message: UserMessage):
    """
    Main trading prediction endpoint.
    
    Args:
        user_message: User message with trading question
        
    Returns:
        Trading analysis and signal
    """
    try:
        team = get_trading_team()
        result = team.analyze_market(user_message.symbol, user_message.message)
        
        return {
            "success": True,
            "signal": result.get("signal"),
            "response": result.get("response"),
            "market_data": result.get("market_data"),
            "timestamp": result.get("timestamp")
        }
        
    except Exception as e:
        logger.error(f"Error in trade prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/market-data/{symbol}")
async def get_market_data(symbol: str):
    """
    Get market data for a symbol.
    
    Args:
        symbol: Trading symbol (e.g., BTCUSDT)
        
    Returns:
        Market data including price, volume, technical analysis
    """
    try:
        # Get current price
        price_data = binance_tool.get_crypto_price(symbol)
        
        # Get 24h ticker data
        ticker_data = binance_tool.get_24hr_ticker(symbol)
        
        # Get klines for technical analysis
        klines_data = binance_tool.get_klines(symbol, "1h", 100)
        
        return {
            "symbol": symbol,
            "current_price": price_data.get("price"),
            "price_change_24h": ticker_data.get("price_change_percent"),
            "volume_24h": ticker_data.get("volume"),
            "high_24h": ticker_data.get("high"),
            "low_24h": ticker_data.get("low"),
            "klines": klines_data.get("klines", [])[-10:] if klines_data.get("status") == "success" else [],
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting market data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/market-analysis")
async def market_analysis(request: MarketAnalysisRequest):
    """
    Get comprehensive market analysis.
    
    Args:
        request: Market analysis request
        
    Returns:
        Detailed market analysis
    """
    try:
        team = get_trading_team()
        result = team.analyze_market(request.symbol, f"Phân tích thị trường {request.symbol}")
        
        return {
            "success": True,
            "analysis": result.get("response"),
            "market_data": result.get("market_data"),
            "signal": result.get("signal"),
            "timestamp": result.get("timestamp")
        }
        
    except Exception as e:
        logger.error(f"Error in market analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/memory/history")
async def get_memory_history(limit: int = 10):
    """
    Get chat history from memory.
    
    Args:
        limit: Number of recent interactions to return
        
    Returns:
        Recent chat history
    """
    try:
        history = trading_memory.get_recent_chat_history(limit)
        return {
            "success": True,
            "history": history,
            "count": len(history)
        }
        
    except Exception as e:
        logger.error(f"Error getting memory history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/memory/signals")
async def get_trading_signals(limit: int = 5):
    """
    Get recent trading signals.
    
    Args:
        limit: Number of recent signals to return
        
    Returns:
        Recent trading signals
    """
    try:
        signals = trading_memory.get_recent_signals(limit)
        return {
            "success": True,
            "signals": signals,
            "count": len(signals)
        }
        
    except Exception as e:
        logger.error(f"Error getting trading signals: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/memory/search")
async def search_memory(query: str, limit: int = 10):
    """
    Search memory for relevant information.
    
    Args:
        query: Search query
        limit: Number of results to return
        
    Returns:
        Search results from memory
    """
    try:
        results = trading_memory.search_memory(query, limit)
        return {
            "success": True,
            "results": results,
            "count": len(results)
        }
        
    except Exception as e:
        logger.error(f"Error searching memory: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/vector-db/stats")
async def get_vector_db_stats():
    """
    Get vector database statistics.
    
    Returns:
        Vector database statistics
    """
    try:
        stats = vector_db.get_index_stats()
        return {
            "success": True,
            "stats": stats
        }
        
    except Exception as e:
        logger.error(f"Error getting vector DB stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/vector-db/query")
async def query_knowledge(query: str, top_k: int = 5):
    """
    Query knowledge from vector database.
    
    Args:
        query: Query text
        top_k: Number of results to return
        
    Returns:
        Knowledge search results
    """
    try:
        results = vector_db.query_knowledge(query, top_k)
        return {
            "success": True,
            "results": results,
            "count": len(results)
        }
        
    except Exception as e:
        logger.error(f"Error querying knowledge: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/evaluate")
async def evaluate_system(request: EvaluationRequest):
    """
    Run system evaluation tests.
    
    Args:
        request: Evaluation request
        
    Returns:
        Evaluation results
    """
    try:
        evaluator = TradingAgentEvaluator(request.api_key)
        
        if request.test_type == "all":
            results = evaluator.run_all_tests()
        else:
            # Run specific test
            if request.test_type == "basic":
                results = evaluator.test_basic_response()
            elif request.test_type == "signals":
                results = evaluator.test_signal_extraction()
            elif request.test_type == "market_data":
                results = evaluator.test_market_data_integration()
            elif request.test_type == "memory":
                results = evaluator.test_memory_functionality()
            elif request.test_type == "vector_db":
                results = evaluator.test_vector_db_functionality()
            else:
                raise HTTPException(status_code=400, detail="Invalid test type")
        
        return {
            "success": True,
            "evaluation_results": results
        }
        
    except Exception as e:
        logger.error(f"Error in evaluation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/team/status")
async def get_team_status():
    """
    Get trading team status.
    
    Returns:
        Team status and statistics
    """
    try:
        team = get_trading_team()
        status = team.get_team_status()
        return {
            "success": True,
            "status": status
        }
        
    except Exception as e:
        logger.error(f"Error getting team status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def main():
    """Main function to run the server."""
    print("Starting Cryage Trading Backend...")
    print("Available endpoints:")
    print("- POST /trade-predict: Main trading prediction")
    print("- GET /market-data/{symbol}: Get market data")
    print("- POST /market-analysis: Comprehensive market analysis")
    print("- GET /memory/history: Get chat history")
    print("- GET /memory/signals: Get trading signals")
    print("- POST /memory/search: Search memory")
    print("- GET /vector-db/stats: Get vector DB stats")
    print("- POST /vector-db/query: Query knowledge")
    print("- POST /evaluate: Run system evaluation")
    print("- GET /team/status: Get team status")

if __name__ == "__main__":
    main()
