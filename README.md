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
*   **🔒 Enterprise Security**: OWASP Top 10 compliance, rate limiting, JWT token rotation, structured logging (Pino), and XSS prevention.

---

## 🏗️ Architecture & Tech Stack

CarbonIQ AI is built using a modern, scalable microservices architecture. See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed diagrams and design patterns.

### Frontend (Next.js 15 App Router)
*   **Framework**: Next.js 15, React 19, TypeScript
*   **State Management**: Zustand
*   **Styling**: TailwindCSS, Shadcn UI (Custom Dark/Light Theme), Framer Motion
*   **Features**: PWA (`next-pwa`), Recharts (Data Visualization)

### Backend API (Node.js & Express)
*   **Core**: TypeScript, Express, Prisma ORM
*   **Database**: PostgreSQL
*   **Caching**: Redis (Session & Query Cache)
*   **Architecture**: Service Layer Pattern, Dependency Injection (AI & Email Interfaces)
*   **Validation**: Zod (Schema & Environment validation)

### Machine Learning Service (Python)
*   **Framework**: FastAPI, Scikit-Learn, Pandas
*   **Model**: Gradient Boosting Regressor (Emission Predictions)

### DevOps & Tooling
*   **Containerization**: Docker & Docker Compose (Multi-stage builds)
*   **CI/CD**: GitHub Actions (Lint, Test, CodeQL, Build)
*   **Local Email**: MailHog
*   **Version Control**: Husky, Commitlint, Lint-staged

---

## 🛠️ Getting Started (Local Development)

### Prerequisites
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
*   [Node.js](https://nodejs.org/) (v20+)
*   [Python](https://www.python.org/) (3.11+)

### 1. Setup Environment
Copy the example environment file and add your Google Gemini API key (optional: if omitted, the app will use deterministic mock AI).

```bash
cp .env.example .env
```

### 2. Start the Infrastructure (Docker)
Start the PostgreSQL database, Redis cache, and MailHog services:

```bash
docker-compose up -d postgres redis mailhog
```

### 3. Setup Backend
```bash
cd backend
npm install
npx prisma db push
npm run dev
```
*   API runs on `http://localhost:5000`
*   Swagger Docs available at `http://localhost:5000/api-docs`

### 4. Setup ML Service
```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8000
```
*   ML API runs on `http://localhost:8000`
*   Train the model first via: `POST http://localhost:8000/api/train`

### 5. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
*   App runs on `http://localhost:3000`

---

## 🧪 Testing Strategy

*   **Unit & Integration Tests**: Jest & Supertest (Backend)
*   **E2E Tests**: Playwright (Frontend)
*   **CI Validation**: Run `npm run test` in respective workspaces.

---

## 📜 License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details. Developed for the hackathon.
