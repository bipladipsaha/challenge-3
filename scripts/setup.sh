#!/bin/bash
# ==========================================
# CarbonIQ Setup Script
# ==========================================

set -e

echo "🌱 Setting up CarbonIQ Enterprise Environment..."

# 1. Install root dependencies (Husky, commitlint, etc.)
echo "📦 Installing root dependencies..."
npm install --legacy-peer-deps

# 2. Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install --legacy-peer-deps
cd ..

# 3. Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install --legacy-peer-deps
cd ..

# 4. Generate Prisma Client
echo "🗄️ Generating Prisma Client..."
cd backend
npx prisma generate
cd ..

# 5. Setup Git Hooks
echo "🪝 Setting up Husky hooks..."
npx husky install

echo "✅ Setup complete! Run 'docker-compose up -d' to start the database, then 'npm run dev' to start the application."
