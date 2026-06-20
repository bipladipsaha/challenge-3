# Contributing to CarbonIQ AI

Thank you for your interest in contributing to CarbonIQ AI! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/carboniq-ai.git
cd carboniq-ai

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start all services
docker compose up -d

# Or run individually:
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev

# ML Service
cd ml-service && pip install -r requirements.txt && uvicorn src.main:app --reload
```

## Development Workflow

1. **Fork** the repository
2. **Create** a feature branch from `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feat/your-feature-name
   ```
3. **Make** your changes following our coding standards
4. **Test** your changes thoroughly
5. **Commit** using conventional commits
6. **Push** your branch and create a Pull Request

## Coding Standards

### TypeScript

- Use strict TypeScript (`strict: true` in tsconfig)
- Define explicit types and interfaces (avoid `any`)
- Use functional components with hooks (React)
- Follow SOLID principles
- Use meaningful variable and function names

### Python

- Follow PEP 8 style guide
- Use type hints
- Write docstrings for all public functions
- Use Black for formatting

### General

- Write unit tests for new features
- Maintain 90%+ code coverage
- No console.log in production code (use logger)
- No hardcoded secrets or API keys
- Follow DRY and KISS principles

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                    |
| ---------- | ------------------------------ |
| `feat`     | New feature                    |
| `fix`      | Bug fix                        |
| `docs`     | Documentation changes          |
| `style`    | Code style changes             |
| `refactor` | Code refactoring               |
| `perf`     | Performance improvements       |
| `test`     | Adding or updating tests       |
| `build`    | Build system changes           |
| `ci`       | CI/CD changes                  |
| `chore`    | Other changes                  |
| `security` | Security improvements          |

### Examples

```bash
feat(dashboard): add carbon trend line chart
fix(auth): resolve JWT refresh token rotation bug
docs(api): update Swagger endpoint descriptions
test(calculator): add unit tests for emission calculations
security(auth): implement CSRF token validation
```

## Pull Request Process

1. Ensure all tests pass and linting is clean
2. Update documentation if needed
3. Fill out the PR template completely
4. Request review from at least one maintainer
5. Address all review comments
6. Squash commits before merging

## Reporting Issues

- Use the [Bug Report](/.github/ISSUE_TEMPLATE/bug_report.yml) template for bugs
- Use the [Feature Request](/.github/ISSUE_TEMPLATE/feature_request.yml) template for enhancements
- Check existing issues before creating a new one

## Questions?

Feel free to open a [Discussion](https://github.com/your-org/carboniq-ai/discussions) for questions or ideas.

Thank you for contributing! 🌱
