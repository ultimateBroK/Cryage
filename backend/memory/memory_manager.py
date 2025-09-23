from agno.memory import Memory
from typing import Dict, List, Any, Optional
import json
import os
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class TradingMemoryManager:
    """Quản lý memory cho trading system."""
    
    def __init__(self, memory_name: str = "trading_memory"):
        self.memory = Memory(name=memory_name)
        self.chat_history: List[Dict[str, Any]] = []
        self.trading_signals: List[Dict[str, Any]] = []
        self.market_analysis: List[Dict[str, Any]] = []
        
    def add_chat_interaction(self, user_input: str, agent_response: str, agent_name: str) -> None:
        """
        Thêm tương tác chat vào memory.
        
        Args:
            user_input: Input từ user
            agent_response: Response từ agent
            agent_name: Tên agent
        """
        interaction = {
            "timestamp": datetime.now().isoformat(),
            "user_input": user_input,
            "agent_response": agent_response,
            "agent_name": agent_name
        }
        
        self.chat_history.append(interaction)
        self.memory.append(f"User: {user_input}")
        self.memory.append(f"{agent_name}: {agent_response}")
        
        logger.info(f"Added chat interaction for {agent_name}")
    
    def add_trading_signal(self, signal_data: Dict[str, Any]) -> None:
        """
        Thêm trading signal vào memory.
        
        Args:
            signal_data: Dict chứa thông tin signal
        """
        signal_data["timestamp"] = datetime.now().isoformat()
        self.trading_signals.append(signal_data)
        
        # Thêm vào memory chính
        signal_text = f"Trading Signal: {signal_data.get('signal', 'N/A')} - {signal_data.get('reasoning', 'N/A')}"
        self.memory.append(signal_text)
        
        logger.info(f"Added trading signal: {signal_data.get('signal', 'N/A')}")
    
    def add_market_analysis(self, analysis_data: Dict[str, Any]) -> None:
        """
        Thêm market analysis vào memory.
        
        Args:
            analysis_data: Dict chứa thông tin phân tích
        """
        analysis_data["timestamp"] = datetime.now().isoformat()
        self.market_analysis.append(analysis_data)
        
        # Thêm vào memory chính
        analysis_text = f"Market Analysis: {analysis_data.get('summary', 'N/A')}"
        self.memory.append(analysis_text)
        
        logger.info(f"Added market analysis")
    
    def get_recent_chat_history(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Lấy lịch sử chat gần đây."""
        return self.chat_history[-limit:]
    
    def get_recent_signals(self, limit: int = 5) -> List[Dict[str, Any]]:
        """Lấy signals gần đây."""
        return self.trading_signals[-limit:]
    
    def get_recent_analysis(self, limit: int = 5) -> List[Dict[str, Any]]:
        """Lấy phân tích gần đây."""
        return self.market_analysis[-limit:]
    
    def get_all_memory(self) -> str:
        """Lấy tất cả memory dưới dạng string."""
        return self.memory.get_all()
    
    def get_context_for_agent(self, agent_name: str, context_length: int = 5) -> str:
        """
        Lấy context phù hợp cho agent cụ thể.
        
        Args:
            agent_name: Tên agent
            context_length: Số lượng interactions gần đây
            
        Returns:
            Context string
        """
        recent_history = self.get_recent_chat_history(context_length)
        context_parts = []
        
        for interaction in recent_history:
            if interaction.get("agent_name") == agent_name or agent_name == "all":
                context_parts.append(f"User: {interaction['user_input']}")
                context_parts.append(f"Response: {interaction['agent_response']}")
        
        return "\n".join(context_parts)
    
    def search_memory(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Tìm kiếm trong memory.
        
        Args:
            query: Từ khóa tìm kiếm
            limit: Số lượng kết quả
            
        Returns:
            List các kết quả tìm kiếm
        """
        results = []
        query_lower = query.lower()
        
        # Tìm trong chat history
        for interaction in self.chat_history:
            if (query_lower in interaction["user_input"].lower() or 
                query_lower in interaction["agent_response"].lower()):
                results.append({
                    "type": "chat",
                    "data": interaction
                })
        
        # Tìm trong trading signals
        for signal in self.trading_signals:
            if query_lower in str(signal).lower():
                results.append({
                    "type": "signal",
                    "data": signal
                })
        
        # Tìm trong market analysis
        for analysis in self.market_analysis:
            if query_lower in str(analysis).lower():
                results.append({
                    "type": "analysis",
                    "data": analysis
                })
        
        return results[:limit]
    
    def clear_old_data(self, days: int = 30) -> None:
        """
        Xóa dữ liệu cũ hơn số ngày chỉ định.
        
        Args:
            days: Số ngày
        """
        cutoff_date = datetime.now().timestamp() - (days * 24 * 60 * 60)
        
        # Filter chat history
        self.chat_history = [
            interaction for interaction in self.chat_history
            if datetime.fromisoformat(interaction["timestamp"]).timestamp() > cutoff_date
        ]
        
        # Filter trading signals
        self.trading_signals = [
            signal for signal in self.trading_signals
            if datetime.fromisoformat(signal["timestamp"]).timestamp() > cutoff_date
        ]
        
        # Filter market analysis
        self.market_analysis = [
            analysis for analysis in self.market_analysis
            if datetime.fromisoformat(analysis["timestamp"]).timestamp() > cutoff_date
        ]
        
        logger.info(f"Cleared data older than {days} days")
    
    def export_memory(self, filepath: str) -> None:
        """Export memory ra file JSON."""
        memory_data = {
            "chat_history": self.chat_history,
            "trading_signals": self.trading_signals,
            "market_analysis": self.market_analysis,
            "export_timestamp": datetime.now().isoformat()
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(memory_data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Exported memory to {filepath}")
    
    def import_memory(self, filepath: str) -> None:
        """Import memory từ file JSON."""
        if not os.path.exists(filepath):
            logger.warning(f"Memory file {filepath} not found")
            return
        
        with open(filepath, 'r', encoding='utf-8') as f:
            memory_data = json.load(f)
        
        self.chat_history = memory_data.get("chat_history", [])
        self.trading_signals = memory_data.get("trading_signals", [])
        self.market_analysis = memory_data.get("market_analysis", [])
        
        logger.info(f"Imported memory from {filepath}")

# Global instance
trading_memory = TradingMemoryManager()

# Convenience functions
def add_to_memory(user_input: str, agent_response: str, agent_name: str = "Unknown") -> None:
    """Thêm tương tác vào memory."""
    trading_memory.add_chat_interaction(user_input, agent_response, agent_name)

def get_memory() -> str:
    """Lấy tất cả memory."""
    return trading_memory.get_all_memory()

def get_context_for_agent(agent_name: str, context_length: int = 5) -> str:
    """Lấy context cho agent."""
    return trading_memory.get_context_for_agent(agent_name, context_length)
