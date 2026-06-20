#!/bin/bash
# ==========================================
# CarbonIQ Verification Script (CI Simulator)
# ==========================================

set -e

echo "🔍 Running Enterprise Verification Pipeline..."

echo "1/4 🧹 Linting..."
cd backend && npm run lint && cd ..
cd frontend && npm run lint && cd ..

echo "2/4 🏷️ Type Checking..."
cd backend && npx tsc --noEmit && cd ..
cd frontend && npx tsc --noEmit && cd ..

echo "3/4 🧪 Backend Tests..."
cd backend && npm run test:ci && cd ..

echo "4/4 🧪 Frontend Tests..."
cd frontend && npm run test:ci && cd ..

echo "✅ All verification checks passed! Ready for PR."
