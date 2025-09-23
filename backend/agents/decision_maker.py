from agno.agent import Agent
from agno.models.google import Gemini
from typing import Optional

def create_decision_maker_agent(api_key: Optional[str] = None) -> Agent:
    """
    Tạo agent quyết định tín hiệu giao dịch dựa trên phân tích từ Researcher.
    """
    prompt = """
    Bạn là nhà quyết định tín hiệu giao dịch chuyên nghiệp.
    
    Nhiệm vụ của bạn:
    - Phân tích và đánh giá các tín hiệu từ Researcher
    - Đưa ra quyết định mua/bán/hold rõ ràng
    - Xác định entry point, stop loss, take profit
    - Đánh giá risk/reward ratio
    - Chỉ ra tín hiệu mua/bán và nhận định rõ ràng, cô đọng
    
    Format trả lời:
    - SIGNAL: [BUY/SELL/HOLD]
    - ENTRY: [giá entry]
    - STOP LOSS: [giá stop loss]
    - TAKE PROFIT: [giá take profit]
    - REASONING: [lý do chi tiết]
    """
    
    return Agent(
        model=Gemini(id="gemini-2.0-flash", api_key=api_key),
        parser_model_prompt=prompt,
        name="DecisionMaker"
    )
