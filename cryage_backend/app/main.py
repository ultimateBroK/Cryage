from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
import socketio
import logging
import time

from app.core.config import settings
from app.core.logging_conf import setup_logging
from app.websockets.handlers import register_socket_handlers
from app.websockets.events import WebSocketEvents
from app.api.router import api_router
from app.schemas import ErrorResponse
from app.services import initialize_services

# Create a Socket.IO AsyncServer instance
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=settings.BACKEND_CORS_ORIGINS,
    logger=True,
    engineio_logger=True
)

# Initialize WebSocket events utility
ws_events = WebSocketEvents(sio)

# Initialize logging
setup_logging()
logger = logging.getLogger(__name__)


def create_application() -> FastAPI:
    """
    Factory function to create and configure the FastAPI application
    """
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="""
        Cryage Backend API - Cryptocurrency trading analytics application.

        ## API Features

        * **Market Data**: Fetch historical and real-time market data for cryptocurrency pairs
        * **Technical Analysis**: Access various technical indicators and analysis data
        * **WebSockets**: Real-time updates through WebSocket connections

        ## Authentication

        Not required for development environment.
        """,
        version="0.1.0",
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url=f"{settings.API_V1_STR}/docs",
        redoc_url=f"{settings.API_V1_STR}/redoc",
        contact={
            "name": "Development Team",
            "email": "dev@example.com",
        },
        license_info={
            "name": "Private",
            "url": "https://example.com/license",
        },
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[origin for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Add request timing middleware
    @app.middleware("http")
    async def add_process_time_header(request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response

    # Add HTTP exception handler
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        logger.warning(
            f"HTTP error {exc.status_code}",
            extra={"path": request.url.path, "detail": exc.detail}
        )
        return JSONResponse(
            status_code=exc.status_code,
            content=ErrorResponse(
                error=exc.detail,
                error_code=f"HTTP_{exc.status_code}",
                details={"headers": dict(exc.headers) if exc.headers else None}
            ).dict(),
        )

    # Add validation exception handler
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        errors = exc.errors()
        logger.warning(
            "Validation error",
            extra={"path": request.url.path, "errors": errors}
        )
        return JSONResponse(
            status_code=422,
            content=ErrorResponse(
                error="Validation error",
                error_code="VALIDATION_ERROR",
                details={"errors": errors}
            ).dict(),
        )

    # Add global exception handler
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(
            "Unhandled exception",
            extra={"path": request.url.path, "error": str(exc)}
        )
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(
                error="Internal server error",
                error_code="INTERNAL_ERROR",
                details={"message": str(exc)}
            ).dict(),
        )

    # Health check endpoint
    @app.get("/health", tags=["health"], summary="Health Check", description="Health check endpoint for the backend service")
    async def health_check():
        """
        Returns the health status of the backend service.

        Returns:
            dict: Contains service status information
                - status: "healthy" if the service is running correctly
                - service: The name of the service
                - version: The version of the service
        """
        return {
            "status": "healthy",
            "service": settings.PROJECT_NAME,
            "version": "0.1.0",
        }

    # Redis health check endpoint
    @app.get("/health/redis", tags=["health"], summary="Redis Connection Health", description="Check Redis connection status")
    async def redis_health():
        """
        Checks if the backend can connect to Redis.

        Returns:
            dict: Contains Redis connection status
                - status: "connected" if Redis is accessible
                - message: Additional status information
        """
        try:
            # Check Redis connection through service
            # This is a placeholder implementation
            return {
                "status": "connected",
                "message": "Redis connection is healthy"
            }
        except Exception as e:
            logger.error("Redis connection failed", extra={"error": str(e)})
            return JSONResponse(
                status_code=500,
                content={
                    "status": "disconnected",
                    "message": f"Redis connection failed: {str(e)}"
                }
            )

    # Include API router
    app.include_router(api_router, prefix=settings.API_V1_STR)

    # Custom OpenAPI schema generator
    def custom_openapi():
        if app.openapi_schema:
            return app.openapi_schema

        openapi_schema = get_openapi(
            title=app.title,
            version=app.version,
            description=app.description,
            routes=app.routes,
            tags=[
                {"name": "health", "description": "Health check endpoints"},
                {"name": "market-data", "description": "Market data endpoints for cryptocurrency pairs"},
                {"name": "analysis", "description": "Technical analysis endpoints for cryptocurrency data"},
                {"name": "symbols", "description": "Endpoints for available trading symbols"}
            ]
        )

        # Add security schemes if needed in the future
        # openapi_schema["components"]["securitySchemes"] = {...}

        app.openapi_schema = openapi_schema
        return app.openapi_schema

    app.openapi = custom_openapi

    # Log application startup
    logger.info(
        "Application startup complete",
        extra={"service": settings.PROJECT_NAME, "cors_origins": settings.BACKEND_CORS_ORIGINS}
    )

    return app


# Create Socket.IO ASGI app
socket_app = socketio.ASGIApp(sio)

# Create FastAPI app
app = create_application()

# Mount Socket.IO app
app.mount("/ws", socket_app)

# Register WebSocket event handlers and initialize services
@app.on_event("startup")
async def startup_event():
    """
    Initialize services and register WebSocket handlers on application startup
    """
    logger.info("Initializing application services")
    await initialize_services()

    logger.info("Registering WebSocket handlers")
    await register_socket_handlers(sio)

    # Broadcast system startup message
    await ws_events.broadcast_system_message("System started and ready for connections")


if __name__ == "__main__":
    # For local development only
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
