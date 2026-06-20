# 🌱 CarbonIQ AI

> **AI-Powered Carbon Footprint Awareness & Sustainability Platform**

CarbonIQ AI is an enterprise-grade platform that helps individuals understand, track, analyze, and reduce their carbon footprint using AI-driven insights, real-time analytics, predictive modeling, and a gamified sustainability scoring system.

![CarbonIQ AI Concept](https://via.placeholder.com/1200x600/10b981/ffffff?text=CarbonIQ+AI+-+Sustainability+Platform)

---

## 🚀 Key Features

*   **🤖 AI Eco Coach (Google Gemini Integration)**: Personalized sustainability advice that adapts to your lifestyle.
*   **📊 Smart Analytics & Predictive Modeling**: Track emissions via heatmaps, charts, and predict future trends (30/90/365 days) using Scikit-Learn.
*   **🏆 Gamified Challenges**: Earn badges, complete sustainability challenges, and climb the community leaderboard.
*   **📱 Progressive Web App (PWA)**: Full Next.js 15 frontend with offline support, syncing carbon logs when connectivity is restored.
*   **🔒 Enterprise Security**: OWASP Top 10 compliance, HTTPOnly Secure Cookies, rate limiting, JWT token rotation, structured logging (Pino), and XSS/CSRF prevention.
*   **⚡ High Performance**: Redis query caching, React Suspense lazy loading, and optimized Prisma database access.

---

## 🏗️ Architecture Overview

The system operates on a robust microservices architecture designed for high availability and scalability.

- **Frontend (Client)**: Next.js 15 App Router application providing a responsive PWA. Utilizes `next/dynamic` for code splitting and `zustand` for state.
- **Backend (API Layer)**: Node.js/Express service enforcing strict validation, route-limiting, and managing database connections via Prisma.
- **Data Layer (PostgreSQL)**: Relational data store holding structured schemas for Users, Entries, Goals, and Badges.
- **Cache Layer (Redis)**: Accelerates repetitive API requests and caches expensive summary aggregations.
- **ML Service (FastAPI)**: Independent Python service operating regression models to forecast future carbon usage.

---

## 🛠️ Environment Variables Configuration

Copy `.env.example` in both the root and `backend/` directories to `.env`.

**Backend (`backend/.env`):**
```env
NODE_ENV=development # or production
PORT=5000
DATABASE_URL=postgresql://carboniq:carboniq_dev@postgres:5432/carboniq_dev
REDIS_URL=redis://redis:6379
JWT_SECRET=YOUR_32_CHAR_SECRET
JWT_REFRESH_SECRET=YOUR_32_CHAR_REFRESH_SECRET
GEMINI_API_KEY=YOUR_GEMINI_KEY # Optional
```

---

## 🐳 Docker Setup & Deployment

CarbonIQ supports a fully containerized deployment environment.

### 1. Start all Services
Run the entire stack (Frontend, Backend, ML Service, Postgres, Redis):
```bash
docker-compose up --build -d
```

### 2. Verify Services
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **ML Service**: http://localhost:8000
- **Swagger Docs**: http://localhost:5000/api-docs

### 3. Teardown
```bash
docker-compose down -v
```

---

## 📖 API Documentation

The backend exposes a fully documented OpenAPI specification.
Once the backend is running, navigate to:
**👉 http://localhost:5000/api-docs**

Endpoints include:
- `POST /api/v1/auth/register` (Registers a user, sets HTTPOnly cookies)
- `POST /api/v1/auth/login` (Authenticates user, sets HTTPOnly cookies)
- `GET /api/v1/entries` (Fetches carbon logs)
- `POST /api/v1/entries` (Submits a new carbon log)
- `GET /api/v1/ai/score` (Retrieves AI-calculated sustainability score)

---

## 🧪 Testing Instructions

The project features a comprehensive testing suite spanning all microservices.

### Backend Tests (Jest + Supertest)
```bash
cd backend
npm install
npm run test
```

### Frontend Tests (Jest + React Testing Library)
```bash
cd frontend
npm install
npm run test
```

### ML Service Tests (Pytest)
```bash
cd ml-service
pip install -r requirements-dev.txt
pytest
```

---

## 🚨 Troubleshooting Guide

### Issue: "Authentication failed. Token not found."
**Cause**: The frontend cannot read the auth token because it was migrated to `HTTPOnly` Secure Cookies.
**Solution**: Ensure you access the app via `http://localhost:3000` (or the exact CORS origin). If testing via Postman, ensure the Cookie headers are correctly attached.

### Issue: "Redis Connection Refused"
**Cause**: Redis container is not running or the backend is configured with the wrong host.
**Solution**: Use `REDIS_URL=redis://localhost:6379` for local Node execution, and `REDIS_URL=redis://redis:6379` when running via Docker Compose.

### Issue: "Docker build fails on pip install (httpx)"
**Cause**: Dependency version mismatch.
**Solution**: We have resolved this in the latest commit. Please run `docker-compose build --no-cache`.

---

## 📜 License
This project is licensed under the MIT License. Developed for the sustainability challenge.
