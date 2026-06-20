"""
CarbonIQ AI — ML Service API Routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

from src.models.predictor import train_model, predict_emissions

router = APIRouter()


class PredictionRequest(BaseModel):
    """Input schema for emission prediction."""
    travel_km: float = Field(..., ge=0, description="Kilometers traveled")
    electricity_kwh: float = Field(..., ge=0, description="Electricity consumed in kWh")
    meat_meals: int = Field(..., ge=0, description="Number of meat meals")
    shopping_items: int = Field(..., ge=0, description="Number of shopping items")
    waste_kg: float = Field(..., ge=0, description="Waste produced in kg")
    month: int = Field(..., ge=1, le=12, description="Month of year (1-12)")


class PredictionResponse(BaseModel):
    """Output schema for emission prediction."""
    predicted_emissions_kg: float
    input_data: dict


class TrainResponse(BaseModel):
    """Output schema for model training."""
    metrics: dict
    feature_importance: dict
    feature_cols: list


@router.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Predict carbon emissions based on lifestyle features.

    Uses a trained GradientBoosting regression model.
    Returns the predicted total CO2 emissions in kg.
    """
    input_data = request.model_dump()
    result = predict_emissions(input_data)

    if result is None:
        raise HTTPException(
            status_code=503,
            detail="Model not trained yet. Call POST /api/train first.",
        )

    return result


@router.post("/train", response_model=TrainResponse)
async def train():
    """
    Train the emission prediction model.

    Generates synthetic training data, applies feature engineering,
    trains a GradientBoosting model, performs cross-validation,
    and saves the model to disk.
    """
    try:
        result = train_model()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")


@router.get("/model/status")
async def model_status():
    """Check if a trained model exists."""
    from src.models.predictor import load_model

    model, scaler = load_model()
    if model is not None:
        return {
            "status": "ready",
            "model_type": type(model).__name__,
            "n_estimators": model.n_estimators,
        }
    return {"status": "not_trained", "message": "No model found. Train first via POST /api/train."}
