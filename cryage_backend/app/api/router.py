from fastapi import APIRouter

from app.api.endpoints import markets, analysis

# Create main API router
api_router = APIRouter()

# Create v1 API router with version prefix
api_v1_router = APIRouter(prefix="/v1")

# Add endpoints to the v1 router
api_v1_router.include_router(
    markets.router,
    prefix="/markets",
    tags=["markets"]
)

api_v1_router.include_router(
    analysis.router,
    prefix="/analysis",
    tags=["analysis"]
)

# Include the v1 router in the main API router
api_router.include_router(api_v1_router)
