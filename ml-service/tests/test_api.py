from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "carboniq-ml-service"}

def test_predict_emissions():
    payload = {
        "userId": "test-user-123",
        "category": "TRAVEL",
        "recentAmounts": [10.5, 12.0, 11.2],
        "metadata": {"vehicleType": "car"}
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert "confidence" in data
    assert "factors" in data
