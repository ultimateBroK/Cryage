from abc import ABC, abstractmethod
from typing import Dict, Type, TypeVar, Any, Optional, ClassVar, Set
import logging
from app.core.config import settings

# Type variable for service class
T = TypeVar('T', bound='BaseService')

class BaseService(ABC):
    """
    Base service class that implements singleton pattern with dependency injection.
    All services should inherit from this class.
    """
    # Class variables for dependency injection
    _instances: ClassVar[Dict[Type[T], T]] = {}
    _dependencies: ClassVar[Dict[Type[T], Set[Type[T]]]] = {}

    def __init__(self) -> None:
        """Initialize the service with a logger"""
        self.logger = logging.getLogger(f"{self.__class__.__module__}.{self.__class__.__name__}")
        self.settings = settings

    @classmethod
    def get_instance(cls: Type[T], **kwargs: Any) -> T:
        """
        Get or create a singleton instance of the service.
        If the service doesn't exist, it creates all dependencies first.

        Args:
            **kwargs: Additional arguments to pass to the constructor

        Returns:
            An instance of the service
        """
        if cls not in cls._instances:
            # Create dependencies first
            dependencies = {}
            for dependency_cls in cls._dependencies.get(cls, set()):
                dependencies[dependency_cls.__name__] = dependency_cls.get_instance()

            # Create instance with dependencies and kwargs
            cls._instances[cls] = cls(**kwargs, **dependencies)

        return cls._instances[cls]

    @classmethod
    def depends_on(cls: Type[T], *service_classes: Type[T]) -> None:
        """
        Declare dependencies for this service.

        Args:
            *service_classes: Service classes that this service depends on
        """
        if cls not in cls._dependencies:
            cls._dependencies[cls] = set()

        cls._dependencies[cls].update(service_classes)

    @classmethod
    def reset_instances(cls) -> None:
        """Clear all service instances (mainly for testing)"""
        cls._instances.clear()
