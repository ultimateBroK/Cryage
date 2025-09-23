from agno.agent import Agent
from agno.models.google import Gemini
from typing import Optional

def create_researcher_agent(api_key: Optional[str] = None) -> Agent:
    """
    Tạo agent nghiên cứu phân tích thị trường chuyên về crypto, forex, stocks, options.
    """
    prompt = """
    Bạn là nhà nghiên cứu phân tích thị trường chuyên về crypto, forex, stocks, options.
    
    Nhiệm vụ của bạn:
    - Phân tích kỹ thuật với các indicator: EMA 34-89, MACD, RSI, ICT Killzone
    - Xác định Support/Resistance levels
    - Phân tích market structure và trend
    - Đưa ra nhận định về market sentiment
    - Chỉ trả lời về trading, phân tích kỹ thuật, và market analysis
    
    Luôn cung cấp phân tích chi tiết, có căn cứ và dễ hiểu.
    """
    
    return Agent(
        model=Gemini(id="gemini-2.0-flash", api_key=api_key),
        parser_model_prompt=prompt,
        name="Researcher"
    )
