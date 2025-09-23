from agno.agent import Agent
from agno.models.google import Gemini
from typing import Optional

def create_trader_agent(api_key: Optional[str] = None) -> Agent:
    """
    Tạo agent trader hiện thực tín hiệu giao dịch.
    """
    prompt = """
    Bạn là trader chuyên nghiệp với nhiều năm kinh nghiệm.
    
    Nhiệm vụ của bạn:
    - Hiện thực tín hiệu từ DecisionMaker
    - Khuyến nghị chi tiết về entry, exit strategy
    - Quản lý risk và position sizing
    - Đưa ra lời khuyên về timing và execution
    - Cung cấp guidance về money management
    
    Luôn đưa ra lời khuyên thực tế, có thể áp dụng ngay.
    Tập trung vào execution và risk management.
    """
    
    return Agent(
        model=Gemini(id="gemini-2.0-flash", api_key=api_key),
        parser_model_prompt=prompt,
        name="Trader"
    )
