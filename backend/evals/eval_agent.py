import unittest
from typing import Dict, Any, List, Optional
import logging
from datetime import datetime
import json

from teams.trading_team import create_trading_team, run_workflow
from memory.memory_manager import trading_memory
from storage.vector_db import vector_db

logger = logging.getLogger(__name__)

class TradingAgentEvaluator:
    """Evaluation system for testing agent performance."""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize evaluator.
        
        Args:
            api_key: Gemini API key
        """
        self.api_key = api_key
        self.test_results: List[Dict[str, Any]] = []
        
    def test_basic_response(self) -> Dict[str, Any]:
        """Test basic agent response functionality."""
        test_input = "Phân tích tín hiệu BTC hôm nay?"
        symbol = "BTCUSDT"
        
        try:
            result = run_workflow(test_input, symbol, self.api_key)
            
            # Check if response contains trading signal
            response = result.get("response", "").lower()
            has_signal = any(keyword in response for keyword in ["mua", "bán", "buy", "sell", "hold", "giữ"])
            
            # Check if response is not empty
            has_content = len(response.strip()) > 0
            
            # Check if market data is present
            has_market_data = result.get("market_data") is not None
            
            test_result = {
                "test_name": "basic_response",
                "passed": has_signal and has_content and has_market_data,
                "details": {
                    "has_signal": has_signal,
                    "has_content": has_content,
                    "has_market_data": has_market_data,
                    "response_length": len(response)
                },
                "timestamp": datetime.now().isoformat()
            }
            
            self.test_results.append(test_result)
            return test_result
            
        except Exception as e:
            error_result = {
                "test_name": "basic_response",
                "passed": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
            self.test_results.append(error_result)
            return error_result
    
    def test_signal_extraction(self) -> Dict[str, Any]:
        """Test trading signal extraction."""
        test_cases = [
            {
                "input": "Tín hiệu mua BTC với entry 50000, stop loss 48000, take profit 55000",
                "expected_signal": "BUY"
            },
            {
                "input": "Bán ETH ngay lập tức, giá đang giảm mạnh",
                "expected_signal": "SELL"
            },
            {
                "input": "Giữ nguyên position, chờ tín hiệu rõ ràng hơn",
                "expected_signal": "HOLD"
            }
        ]
        
        passed_tests = 0
        total_tests = len(test_cases)
        
        for i, test_case in enumerate(test_cases):
            try:
                result = run_workflow(test_case["input"], "BTCUSDT", self.api_key)
                signal = result.get("signal", {})
                actual_signal = signal.get("signal", "").upper()
                expected = test_case["expected_signal"]
                
                if actual_signal == expected:
                    passed_tests += 1
                    
            except Exception as e:
                logger.error(f"Error in signal extraction test {i}: {e}")
        
        test_result = {
            "test_name": "signal_extraction",
            "passed": passed_tests == total_tests,
            "details": {
                "passed_tests": passed_tests,
                "total_tests": total_tests,
                "success_rate": passed_tests / total_tests
            },
            "timestamp": datetime.now().isoformat()
        }
        
        self.test_results.append(test_result)
        return test_result
    
    def test_market_data_integration(self) -> Dict[str, Any]:
        """Test market data integration."""
        try:
            result = run_workflow("Phân tích giá BTC hiện tại", "BTCUSDT", self.api_key)
            market_data = result.get("market_data", {})
            
            # Check if essential market data is present
            has_price = market_data.get("current_price") is not None
            has_volume = market_data.get("volume_24h") is not None
            has_technical = market_data.get("technical_analysis") is not None
            
            test_result = {
                "test_name": "market_data_integration",
                "passed": has_price and has_volume and has_technical,
                "details": {
                    "has_price": has_price,
                    "has_volume": has_volume,
                    "has_technical": has_technical,
                    "market_data_keys": list(market_data.keys())
                },
                "timestamp": datetime.now().isoformat()
            }
            
            self.test_results.append(test_result)
            return test_result
            
        except Exception as e:
            error_result = {
                "test_name": "market_data_integration",
                "passed": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
            self.test_results.append(error_result)
            return error_result
    
    def test_memory_functionality(self) -> Dict[str, Any]:
        """Test memory functionality."""
        try:
            # Add some test interactions
            test_input = "Test memory functionality"
            test_response = "Memory test response"
            
            trading_memory.add_chat_interaction(test_input, test_response, "TestAgent")
            
            # Check if memory was stored
            recent_history = trading_memory.get_recent_chat_history(1)
            has_memory = len(recent_history) > 0
            
            # Check if memory contains our test data
            memory_contains_test = any(
                interaction["user_input"] == test_input and 
                interaction["agent_response"] == test_response
                for interaction in recent_history
            )
            
            test_result = {
                "test_name": "memory_functionality",
                "passed": has_memory and memory_contains_test,
                "details": {
                    "has_memory": has_memory,
                    "memory_contains_test": memory_contains_test,
                    "memory_count": len(trading_memory.chat_history)
                },
                "timestamp": datetime.now().isoformat()
            }
            
            self.test_results.append(test_result)
            return test_result
            
        except Exception as e:
            error_result = {
                "test_name": "memory_functionality",
                "passed": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
            self.test_results.append(error_result)
            return error_result
    
    def test_vector_db_functionality(self) -> Dict[str, Any]:
        """Test vector database functionality."""
        try:
            # Test knowledge insertion
            test_texts = ["Test trading knowledge", "Test market analysis"]
            test_metadata = [{"type": "test"}, {"type": "test"}]
            
            insert_success = vector_db.insert_knowledge(test_texts, test_metadata)
            
            # Test knowledge query
            query_results = vector_db.query_knowledge("test trading", top_k=2)
            has_query_results = len(query_results) > 0
            
            test_result = {
                "test_name": "vector_db_functionality",
                "passed": insert_success and has_query_results,
                "details": {
                    "insert_success": insert_success,
                    "has_query_results": has_query_results,
                    "query_results_count": len(query_results)
                },
                "timestamp": datetime.now().isoformat()
            }
            
            self.test_results.append(test_result)
            return test_result
            
        except Exception as e:
            error_result = {
                "test_name": "vector_db_functionality",
                "passed": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
            self.test_results.append(error_result)
            return error_result
    
    def run_all_tests(self) -> Dict[str, Any]:
        """Run all evaluation tests."""
        logger.info("Starting agent evaluation tests...")
        
        # Run all tests
        self.test_basic_response()
        self.test_signal_extraction()
        self.test_market_data_integration()
        self.test_memory_functionality()
        self.test_vector_db_functionality()
        
        # Calculate overall results
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result.get("passed", False))
        success_rate = passed_tests / total_tests if total_tests > 0 else 0
        
        overall_result = {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": total_tests - passed_tests,
            "success_rate": success_rate,
            "test_results": self.test_results,
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"Evaluation completed. Success rate: {success_rate:.2%}")
        return overall_result
    
    def export_test_results(self, filepath: str) -> None:
        """Export test results to JSON file."""
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.test_results, f, ensure_ascii=False, indent=2)
        logger.info(f"Test results exported to {filepath}")

def test_agent_response():
    """Simple test function for basic agent response."""
    test_input = "Phân tích tín hiệu BTC hôm nay?"
    try:
        result = run_workflow(test_input, "BTCUSDT")
        response = result.get("response", "")
        
        # Check if response contains trading signal
        has_signal = any(keyword in response.lower() for keyword in ["mua", "bán", "buy", "sell", "hold", "giữ"])
        
        if has_signal:
            print("✅ Test passed: Agent returned trading signal")
        else:
            print("❌ Test failed: Agent did not return trading signal")
            
        return has_signal
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        return False

def run_comprehensive_evaluation(api_key: Optional[str] = None) -> Dict[str, Any]:
    """Run comprehensive evaluation of the trading system."""
    evaluator = TradingAgentEvaluator(api_key)
    return evaluator.run_all_tests()

if __name__ == "__main__":
    # Run basic test
    print("Running basic agent test...")
    test_agent_response()
    
    # Run comprehensive evaluation
    print("\nRunning comprehensive evaluation...")
    results = run_comprehensive_evaluation()
    print(f"Evaluation completed. Success rate: {results['success_rate']:.2%}")
