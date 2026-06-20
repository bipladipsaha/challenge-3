"""
CarbonIQ AI — ML Service Configuration
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    ENV: str = "development"
    PORT: int = 8000
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5000"]
    MODEL_PATH: str = "models/emission_predictor.joblib"

    class Config:
        env_file = ".env"


settings = Settings()
