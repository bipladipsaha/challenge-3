# ========================================
# CarbonIQ AI — ML Service Dockerfile (Multi-Stage)
# ========================================

# --- Stage 1: Build ---
FROM python:3.11-slim AS builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# --- Stage 2: Production ---
FROM python:3.11-slim AS production

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY . .

# Create models directory
RUN mkdir -p models

# Security: non-root user
RUN addgroup --system --gid 1001 mluser && \
    adduser --system --uid 1001 mluser && \
    chown -R mluser:mluser /app

USER mluser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import httpx; httpx.get('http://localhost:8000/health')" || exit 1

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
