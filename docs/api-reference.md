# API Reference

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

All authenticated endpoints require a valid JWT token, automatically sent via HTTPOnly cookies set during login/register.

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecureP@ss1",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response** `201 Created`
```json
{
  "status": "success",
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER"
    }
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecureP@ss1"
}
```

### Refresh Token
```http
POST /auth/refresh
Cookie: refreshToken=<token>
```

### Logout
```http
POST /auth/logout
Cookie: accessToken=<token>
```

---

## Carbon Entries

### Create Entry
```http
POST /entries
Cookie: accessToken=<token>
Content-Type: application/json

{
  "category": "TRAVEL",
  "amount": 25.5,
  "description": "Daily commute",
  "date": "2024-01-15T10:00:00.000Z"
}
```

### List Entries (Paginated)
```http
GET /entries?page=1&limit=20&category=TRAVEL&sortBy=date&sortOrder=desc
Cookie: accessToken=<token>
```

### Get Entry
```http
GET /entries/:id
Cookie: accessToken=<token>
```

### Update Entry
```http
PUT /entries/:id
Cookie: accessToken=<token>
Content-Type: application/json

{
  "amount": 30.0
}
```

### Delete Entry
```http
DELETE /entries/:id
Cookie: accessToken=<token>
```

### Get Summary
```http
GET /entries/summary
Cookie: accessToken=<token>
```

---

## AI Endpoints

### Get Carbon Advice
```http
GET /ai/advice
Cookie: accessToken=<token>
```

### Get Habit Analysis
```http
GET /ai/habits
Cookie: accessToken=<token>
```

### Chat with Eco Coach
```http
POST /ai/chat
Cookie: accessToken=<token>
Content-Type: application/json

{
  "message": "How can I reduce my travel emissions?",
  "history": []
}
```

### Generate Challenges
```http
GET /ai/challenges
Cookie: accessToken=<token>
```

### Get Sustainability Score
```http
GET /ai/score
Cookie: accessToken=<token>
```

### Get Emission Predictions
```http
GET /ai/predictions
Cookie: accessToken=<token>
```

---

## Goals

### Create Goal
```http
POST /goals
Cookie: accessToken=<token>
Content-Type: application/json

{
  "title": "Reduce commute emissions",
  "targetAmount": 50,
  "deadline": "2024-12-31T23:59:59.000Z"
}
```

### List Goals
```http
GET /goals
Cookie: accessToken=<token>
```

### Update Goal
```http
PUT /goals/:id
Cookie: accessToken=<token>
Content-Type: application/json

{
  "status": "COMPLETED"
}
```

### Delete Goal
```http
DELETE /goals/:id
Cookie: accessToken=<token>
```

---

## Error Response Format

All errors follow a consistent structure:

```json
{
  "status": "error",
  "errorCode": "VALIDATION_ERROR",
  "message": "Human-readable error description",
  "errors": []
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400/422 | Input validation failed |
| `AUTHENTICATION_FAILED` | 401 | Invalid credentials or token |
| `TOKEN_EXPIRED` | 401 | JWT token has expired |
| `INSUFFICIENT_PERMISSIONS` | 403 | User lacks required role |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource not found |
| `RESOURCE_CONFLICT` | 409 | Duplicate resource (e.g., email) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unhandled server error |
| `AI_SERVICE_UNAVAILABLE` | 503 | External AI service down |
