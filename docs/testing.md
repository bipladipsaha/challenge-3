# Testing Guide

## Overview

CarbonIQ follows a comprehensive testing pyramid strategy with three tiers:

1. **Unit Tests** (Jest) — Fast, isolated tests for business logic
2. **Integration Tests** (Jest + Supertest) — API endpoint testing with mocked databases
3. **End-to-End Tests** (Playwright) — Full browser-based user journey testing

## Running Tests

### Backend Unit Tests
```bash
cd backend
npm test              # Run tests
npm run test:ci       # Run with coverage enforcement (90% threshold)
npm run test:watch    # Run in watch mode during development
```

### Frontend Component Tests
```bash
cd frontend
npm test              # Run tests
npm run test:ci       # Run with coverage enforcement (90% threshold)
```

### Playwright E2E Tests
```bash
cd frontend
npx playwright install --with-deps   # First time setup
npx playwright test                   # Run all E2E tests
npx playwright test --ui              # Interactive UI mode
npx playwright show-report            # View HTML report
```

## Coverage Requirements

Both backend and frontend enforce a **90% minimum coverage threshold** across:

- **Branches**: All conditional paths are tested
- **Functions**: All exported functions have test coverage
- **Lines**: 90% of executable lines are exercised
- **Statements**: 90% of statements are reached

## Test Structure

### Backend (`backend/__tests__/`)

| Test File | What It Tests |
|-----------|--------------|
| `carbonCalculator.test.ts` | All ESG scoring algorithms and mathematical formulas |
| `auth.middleware.test.ts` | JWT extraction, verification, and role-based authorization |
| `validate.middleware.test.ts` | Zod schema validation and mass-assignment prevention |
| `validators.test.ts` | Password strength, email format, category enums |
| `errorHandler.test.ts` | Error propagation, status codes, stack trace masking |
| `AppError.test.ts` | Error class hierarchy and instanceof chains |
| `constants.test.ts` | Business constant correctness and immutability |

### Frontend (`frontend/__tests__/`)

| Test File | What It Tests |
|-----------|--------------|
| `EmissionTrend.test.tsx` | Chart rendering with Recharts |
| `Sidebar.test.tsx` | ARIA landmarks, `aria-current`, keyboard navigation |
| `TopBar.test.tsx` | Theme toggling, logout action, accessibility labels |

### E2E (`frontend/e2e/`)

| Test File | What It Tests |
|-----------|--------------|
| `auth.spec.ts` | Login form, registration, password toggle, error states |
| `dashboard.spec.ts` | Navigation, security headers, auth redirects |

## Best Practices

1. **Mock only external dependencies** (Gemini API, Redis, email). Never mock business logic.
2. **Test edge cases**: Empty arrays, boundary values, zero, negative numbers, overflow.
3. **Test error paths**: Unauthorized access, invalid input, expired tokens, service failures.
4. **Test accessibility**: ARIA attributes, landmark roles, keyboard navigation, screen reader labels.
5. **Keep tests deterministic**: No reliance on real time, random values, or network calls.
