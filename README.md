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
*   **♿ WCAG 2.2 AA Accessible**: Semantic landmarks, aria-current navigation, prefers-reduced-motion, skip-to-content links, and keyboard-first design.

---

## 🏗️ Architecture Overview

The system operates on a robust microservices architecture designed for high availability and scalability.

```mermaid
graph TD
    Client[Next.js PWA Client] --> |HTTPS / JSON| API[Express API Gateway]
    API --> |Prisma ORM| DB[(PostgreSQL)]
    API --> |Cache Hits| Redis[(Redis Cache)]
    API <--> |gRPC / REST| ML[FastAPI ML Service]
    API <--> |API| Gemini[Google Gemini AI]
    
    subgraph Frontend
    Client
    end
    
    subgraph Backend Services
    API
    DB
    Redis
    end
    
    subgraph External
    ML
    Gemini
    end
```

### Authentication & Authorization Sequence

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API Gateway
    participant D as PostgreSQL
    participant R as Redis

    C->>A: POST /auth/login (email, password)
    A->>D: Lookup user by email
    D-->>A: User record + passwordHash
    A->>A: bcrypt.compare(password, hash)
    A->>A: Generate JWT (access + refresh)
    A->>D: Store hashed refreshToken
    A-->>C: Set-Cookie: accessToken, refreshToken (HTTPOnly, Secure, SameSite)

    C->>A: GET /entries (Cookie: accessToken)
    A->>A: jwt.verify(accessToken)
    A->>R: Check cache (summary:userId)
    R-->>A: Cache hit / miss
    A->>D: Query if cache miss
    D-->>A: Data
    A->>R: Cache result (TTL: 1hr)
    A-->>C: JSON response
```

### Entity-Relationship Diagram

```mermaid
erDiagram
    User ||--o{ CarbonEntry : logs
    User ||--o{ Goal : sets
    User ||--o{ Badge : earns
    User {
        string id PK
        string email UK
        string passwordHash
        string firstName
        string lastName
        string role
        string refreshToken
        boolean isEmailVerified
        datetime createdAt
    }
    CarbonEntry {
        string id PK
        string userId FK
        enum category
        float amount
        string description
        datetime date
    }
    Goal {
        string id PK
        string userId FK
        string title
        float targetAmount
        float currentAmount
        enum status
        datetime deadline
    }
    Badge {
        string id PK
        string userId FK
        string name
        string description
        datetime awardedAt
    }
```

- **Frontend (Client)**: Next.js 15 App Router application providing a responsive PWA. Utilizes `next/dynamic` for code splitting and `zustand` for state.
- **Backend (API Layer)**: Node.js/Express service enforcing strict validation, route-limiting, and managing database connections via Prisma.
- **Data Layer (PostgreSQL)**: Relational data store holding structured schemas for Users, Entries, Goals, and Badges.
- **Cache Layer (Redis)**: Accelerates repetitive API requests and caches expensive summary aggregations.
- **ML Service (FastAPI)**: Independent Python service operating regression models to forecast future carbon usage.

---

## 🎯 Problem Statement & ESG Alignment Matrix

CarbonIQ explicitly addresses the **Carbon Footprint Awareness Platform** requirements by directly implementing the following domain-specific modules:

| Requirement | Implementation Detail | Source Module |
|-------------|----------------------|---------------|
| **Footprint Calculator** | Dynamic aggregation of kg CO₂ equivalent across 7 categories using standard benchmarks. | `utils/carbonCalculator.ts: calculateCarbonFootprint()` |
| **Sustainability Scoring** | Weighted AI scoring algorithm evaluating user emissions against normalized ESG benchmarks. | `utils/carbonCalculator.ts: calculateSustainabilityScore()` |
| **AI Recommendations** | Google Gemini LLM integration identifying highest emission categories and generating localized reduction strategies. | `services/ai/GeminiService.ts: generateCarbonAdvice()` |
| **Emission Forecasting** | Time-series linear regression models predicting 30, 90, and 365-day emission trends. | `utils/carbonCalculator.ts: predictFutureEmissions()` |
| **Sustainability Report** | Comprehensive report aggregating score, predictions, recommendations, and trend data. | `utils/carbonCalculator.ts: generateSustainabilityReport()` |
| **Gamification** | Leaderboard generation algorithm ranking users by percentage reduction over time. | `utils/carbonCalculator.ts: generateLeaderboardStandings()` |
| **Goal Tracking** | Automated weekly emission reduction plan generation algorithm. | `utils/carbonCalculator.ts: createWeeklyGoalPlan()` |
| **Habit Analysis** | AI-powered analysis of carbon emission habits detecting unhealthy patterns. | `services/ai/GeminiService.ts: generateHabitAnalysis()` |
| **Eco Coach Chat** | Interactive AI chatbot providing real-time sustainability guidance. | `services/ai/GeminiService.ts: chatWithEcoCoach()` |
| **Challenge System** | Personalized sustainability challenges generated based on user emission profiles. | `services/ai/GeminiService.ts: generateChallenges()` |

---

## 🔒 Security Architecture

CarbonIQ implements defense-in-depth security across all layers:

| Layer | Protection | Implementation |
|-------|-----------|----------------|
| **Transport** | HTTPS, HSTS | `Strict-Transport-Security: max-age=31536000` |
| **Authentication** | JWT with rotation | HTTPOnly Secure SameSite cookies, bcrypt hashing |
| **Authorization** | Role-based access | `authenticate` + `authorize` middleware |
| **Input Validation** | Zod schemas | Server-side validation middleware on all routes |
| **Rate Limiting** | IP-based throttling | 100 req/15min general, 10 req/hr auth |
| **XSS Prevention** | CSP + Helmet | Content-Security-Policy headers |
| **Clickjacking** | Frame denial | `X-Frame-Options: DENY`, `frame-ancestors 'none'` |
| **CSRF** | SameSite cookies | `SameSite=strict` on all auth cookies |
| **Mass Assignment** | Schema stripping | Zod strips unknown fields by default |
| **Error Exposure** | Structured errors | `AppError` hierarchy, no stack traces in production |

---

## 🧪 Testing Strategy

### Test Pyramid

```mermaid
graph TD
    A[E2E Tests - Playwright] --> B[Integration Tests - Supertest]
    B --> C[Unit Tests - Jest]
    
    style A fill:#e74c3c,color:#fff
    style B fill:#f39c12,color:#fff
    style C fill:#2ecc71,color:#fff
```

### Backend Tests (Jest)
```bash
cd backend && npm test
```
- **Coverage Threshold**: 90% (branches, functions, lines, statements)
- **Test Suites**: `carbonCalculator`, `errorHandler`, `auth.middleware`, `validate.middleware`, `validators`, `constants`, `AppError`

### Frontend Tests (React Testing Library)
```bash
cd frontend && npm test
```
- **Coverage Threshold**: 90%
- **Test Suites**: `EmissionTrend`, `Sidebar`, `TopBar`

### End-to-End Tests (Playwright)
```bash
cd frontend && npx playwright test
```
- **Browsers**: Chromium, Firefox, WebKit
- **Test Suites**: Authentication flow, Dashboard navigation, Security headers

### ML Service Tests (Pytest)
```bash
cd ml-service && pytest
```

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

### API Endpoints Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/v1/auth/register` | Register a new user account | ❌ |
| `POST` | `/api/v1/auth/login` | Authenticate and receive tokens | ❌ |
| `POST` | `/api/v1/auth/refresh` | Refresh access token | 🍪 |
| `POST` | `/api/v1/auth/logout` | Invalidate session | ✅ |
| `GET` | `/api/v1/auth/profile` | Get authenticated user profile | ✅ |
| `GET` | `/api/v1/entries` | Get paginated carbon entries | ✅ |
| `POST` | `/api/v1/entries` | Create a new carbon entry | ✅ |
| `GET` | `/api/v1/entries/:id` | Get a specific entry | ✅ |
| `PUT` | `/api/v1/entries/:id` | Update an entry | ✅ |
| `DELETE` | `/api/v1/entries/:id` | Delete an entry | ✅ |
| `GET` | `/api/v1/entries/summary` | Get emission summary & trends | ✅ |
| `GET` | `/api/v1/goals` | Get all user goals | ✅ |
| `POST` | `/api/v1/goals` | Create a new goal | ✅ |
| `PUT` | `/api/v1/goals/:id` | Update a goal | ✅ |
| `DELETE` | `/api/v1/goals/:id` | Delete a goal | ✅ |
| `GET` | `/api/v1/ai/advice` | Get AI carbon advice | ✅ |
| `GET` | `/api/v1/ai/habits` | Get AI habit analysis | ✅ |
| `POST` | `/api/v1/ai/chat` | Chat with AI Eco Coach | ✅ |
| `GET` | `/api/v1/ai/challenges` | Generate sustainability challenges | ✅ |
| `GET` | `/api/v1/ai/score` | Get sustainability score | ✅ |
| `GET` | `/api/v1/ai/predictions` | Get emission predictions | ✅ |

---

## ♿ Accessibility Compliance (WCAG 2.2 AA)

| Requirement | Implementation |
|-------------|----------------|
| Semantic Landmarks | `<main>`, `<nav>`, `<aside>`, `<header>` with ARIA roles |
| Active Navigation | `aria-current="page"` on active sidebar links |
| Skip Navigation | `skip-to-content` bypass link for keyboard users |
| Focus Management | Global `focus-visible` outline rings |
| Motion Sensitivity | `@media (prefers-reduced-motion: reduce)` in CSS |
| Form Labels | Explicit `<label>` elements with `htmlFor` |
| Error Announcements | `role="alert"` on error messages |
| Loading States | `role="status"` with `aria-live="polite"` |
| Decorative Icons | `aria-hidden="true"` on all Lucide icons |
| Color Contrast | Curated HSL palette meeting 4.5:1 contrast ratio |

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
