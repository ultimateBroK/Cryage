# cryage_backend/app/services/__init__.py

from fastapi import Depends
from typing import Callable, Dict, Type, Any, Awaitable

from app.services.base import BaseService
from app.services.redis_service import RedisService
from app.services.market_service import MarketService
from app.services.analysis_service import AnalysisService

# Export all service classes
__all__ = [
    "RedisService",
    "MarketService",
    "AnalysisService",
    "get_service",
    "initialize_services"
]

# Type for service getter functions
ServiceGetter = Callable[[], Any]

# Dictionary to store service getter functions
_service_getters: Dict[Type[BaseService], ServiceGetter] = {}


def get_service(service_class: Type[BaseService]) -> Any:
    """
    Get a service instance using dependency injection with FastAPI

    Args:
        service_class: The service class to get

    Returns:
        An instance of the service
    """
    if service_class not in _service_getters:
        # Create a getter function for this service
        def getter():
            return service_class.get_instance()

        _service_getters[service_class] = getter

    # Return the getter function for FastAPI dependency injection
    return Depends(_service_getters[service_class])


async def initialize_services() -> None:
    """
    Initialize all services at application startup
    """
    # Instantiate core services
    redis_service = RedisService.get_instance()

    # Instantiate services with dependencies
    market_service = MarketService.get_instance()
    analysis_service = AnalysisService.get_instance()

    # Run any necessary startup tasks
    if not redis_service.health_check():
        raise Exception("Redis connection failed during initialization")

    # Start the market data simulation in development mode
    import asyncio
    asyncio.create_task(market_service.simulate_market_updates())
