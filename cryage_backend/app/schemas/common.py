from typing import Any, Dict, Generic, List, Optional, TypeVar, Union
from pydantic import BaseModel, Field
from datetime import datetime

T = TypeVar('T')


class BaseResponse(BaseModel):
    """Base response model for all API responses"""
    success: bool = True
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class GenericResponse(BaseResponse, Generic[T]):
    """Generic response model with data"""
    data: T


class ErrorResponse(BaseResponse):
    """Error response model"""
    success: bool = False
    error: str
    error_code: Optional[str] = None
    details: Optional[Dict[str, Any]] = None


class PaginatedResponse(BaseResponse, Generic[T]):
    """Paginated response model"""
    data: List[T]
    total: int
    page: int
    per_page: int
    pages: int


class StatusMessage(BaseModel):
    """Status message model"""
    status: str
    message: Optional[str] = None
