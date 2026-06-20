"""
CarbonIQ AI — ML Service Entry Point
FastAPI application for carbon emission predictions using Scikit-Learn.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes import router as api_router
from src.core.config import settings

app = FastAPI(
    title="CarbonIQ AI ML Service",
    description="Machine Learning microservice for carbon emission predictions",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "ml-service", "version": "1.0.0"}
