"""
CarbonIQ AI — Emission Prediction Model
Training pipeline, feature engineering, and model persistence.
"""

import os
import logging
from typing import Dict, List, Optional, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.preprocessing import StandardScaler

logger = logging.getLogger(__name__)

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "emission_predictor.joblib")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.joblib")


def generate_synthetic_data(num_samples: int = 1000) -> pd.DataFrame:
    """
    Generates synthetic training data for carbon emission prediction.
    Features: travel_km, electricity_kwh, meat_meals, shopping_items, waste_kg, month
    Target: total_emissions (kg CO2)
    """
    np.random.seed(42)

    data = {
        "travel_km": np.random.exponential(50, num_samples),
        "electricity_kwh": np.random.normal(300, 100, num_samples).clip(50),
        "meat_meals": np.random.poisson(10, num_samples),
        "shopping_items": np.random.poisson(5, num_samples),
        "waste_kg": np.random.exponential(8, num_samples),
        "month": np.random.randint(1, 13, num_samples),
    }

    df = pd.DataFrame(data)

    # Realistic emission calculation with noise
    df["total_emissions"] = (
        df["travel_km"] * 0.21  # ~210g CO2/km for average car
        + df["electricity_kwh"] * 0.45  # ~450g CO2/kWh global average
        + df["meat_meals"] * 3.3  # ~3.3kg CO2 per meat meal
        + df["shopping_items"] * 5.0  # ~5kg CO2 per general shopping item
        + df["waste_kg"] * 2.5  # ~2.5kg CO2 per kg of waste
        + np.random.normal(0, 10, num_samples)  # Noise
    ).clip(0)

    return df


def feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    """Applies feature engineering transformations."""
    df = df.copy()
    df["is_winter"] = df["month"].isin([11, 12, 1, 2]).astype(int)
    df["travel_electricity_ratio"] = df["travel_km"] / (df["electricity_kwh"] + 1)
    df["high_consumption"] = (
        (df["travel_km"] > df["travel_km"].median())
        & (df["electricity_kwh"] > df["electricity_kwh"].median())
    ).astype(int)
    return df


def train_model() -> Dict:
    """
    Full training pipeline: data generation, feature engineering,
    model training, cross-validation, and persistence.
    """
    logger.info("Starting model training pipeline...")

    # Generate data
    df = generate_synthetic_data(2000)
    df = feature_engineering(df)

    # Features and target
    feature_cols = [
        "travel_km", "electricity_kwh", "meat_meals",
        "shopping_items", "waste_kg", "month",
        "is_winter", "travel_electricity_ratio", "high_consumption",
    ]
    X = df[feature_cols]
    y = df["total_emissions"]

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train model
    model = GradientBoostingRegressor(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.1,
        random_state=42,
    )
    model.fit(X_train_scaled, y_train)

    # Evaluate
    y_pred = model.predict(X_test_scaled)
    metrics = {
        "mse": float(mean_squared_error(y_test, y_pred)),
        "rmse": float(np.sqrt(mean_squared_error(y_test, y_pred))),
        "mae": float(mean_absolute_error(y_test, y_pred)),
        "r2_score": float(r2_score(y_test, y_pred)),
    }

    # Cross-validation
    cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring="r2")
    metrics["cv_r2_mean"] = float(cv_scores.mean())
    metrics["cv_r2_std"] = float(cv_scores.std())

    # Feature importance
    feature_importance = dict(
        zip(feature_cols, model.feature_importances_.tolist())
    )

    # Save model and scaler
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

    logger.info(f"Model saved to {MODEL_PATH}")
    logger.info(f"Metrics: {metrics}")

    return {
        "metrics": metrics,
        "feature_importance": feature_importance,
        "feature_cols": feature_cols,
    }


def load_model() -> Tuple[Optional[GradientBoostingRegressor], Optional[StandardScaler]]:
    """Loads the trained model and scaler from disk."""
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        return None, None
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    return model, scaler


def predict_emissions(input_data: Dict) -> Optional[Dict]:
    """
    Predicts carbon emissions from input features.
    Returns None if the model is not trained yet.
    """
    model, scaler = load_model()
    if model is None or scaler is None:
        return None

    df = pd.DataFrame([input_data])
    df = feature_engineering(df)

    feature_cols = [
        "travel_km", "electricity_kwh", "meat_meals",
        "shopping_items", "waste_kg", "month",
        "is_winter", "travel_electricity_ratio", "high_consumption",
    ]

    X = df[feature_cols]
    X_scaled = scaler.transform(X)
    prediction = model.predict(X_scaled)[0]

    return {
        "predicted_emissions_kg": round(float(prediction), 2),
        "input_data": input_data,
    }
