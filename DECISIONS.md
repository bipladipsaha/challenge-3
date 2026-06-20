# Architecture Decision Records (ADR)

This document captures key architectural decisions for the CarbonIQ AI platform.

---

## ADR-001: HTTPOnly Cookie-Based Authentication

**Status**: Accepted
**Date**: 2024-01-15

### Context
The application needs to store JWT tokens securely on the client side. Common approaches include `localStorage`, `sessionStorage`, or HTTP cookies.

### Decision
We use **HTTPOnly Secure SameSite=strict cookies** for both access and refresh tokens.

### Rationale
- `localStorage` is vulnerable to XSS attacks — any injected script can steal tokens.
- HTTPOnly cookies are **not accessible via JavaScript**, eliminating XSS-based token theft.
- `SameSite=strict` prevents CSRF attacks by restricting cookie transmission to same-origin requests.
- `Secure` flag ensures cookies are only sent over HTTPS in production.

### Consequences
- API calls must include `credentials: 'include'` in fetch/axios config.
- CORS must be configured with explicit `origin` and `credentials: true`.

---

## ADR-002: Zod for Runtime Validation

**Status**: Accepted
**Date**: 2024-01-15

### Context
We need runtime validation for API request bodies, query parameters, and environment variables.

### Decision
We use **Zod** as the single validation library across all layers.

### Rationale
- TypeScript-first library with automatic type inference (`z.infer<typeof schema>`).
- Eliminates the need for separate DTO classes — the schema IS the type.
- Built-in `.safeParse()` provides structured error objects without throwing.
- Strips unknown fields by default, preventing mass-assignment vulnerabilities.

### Consequences
- All request bodies pass through Zod middleware before reaching controllers.
- Environment variables are validated at startup, failing fast on misconfiguration.

---

## ADR-003: Structured Error Hierarchy

**Status**: Accepted
**Date**: 2024-02-01

### Context
The application needs consistent error handling across all API endpoints.

### Decision
We implement a typed **AppError class hierarchy** with specific subclasses for each error category.

### Rationale
- `instanceof` checks enable the error handler to respond with correct HTTP status codes automatically.
- Application-level error codes (`ErrorCode` enum) allow clients to handle errors programmatically.
- The `isOperational` flag distinguishes expected business errors from programming bugs.
- Internal error details (stack traces, DB connection strings) are never exposed to clients.

### Consequences
- All services throw typed errors (e.g., `NotFoundError`, `AuthenticationError`).
- The centralized error handler in `errorHandler.ts` catches and normalizes all responses.

---

## ADR-004: Redis Caching Strategy

**Status**: Accepted
**Date**: 2024-02-15

### Context
Emission summary aggregations involve multiple database queries (aggregate, groupBy, findMany) and are expensive to compute on every request.

### Decision
We cache emission summaries in **Redis** with a 1-hour TTL, keyed by `summary:{userId}`.

### Rationale
- Summary data changes infrequently (only when entries are created/updated/deleted).
- Cache is proactively invalidated on write operations, ensuring consistency.
- Graceful degradation: if Redis is unavailable, queries fall through to PostgreSQL.

### Consequences
- Write operations must invalidate the cache for the affected user.
- Cache keys use the centralized `CACHE_CONFIG.SUMMARY_KEY_PREFIX` constant.

---

## ADR-005: Pino for Structured Logging

**Status**: Accepted
**Date**: 2024-01-20

### Context
The application needs production-grade logging with structured output for log aggregation tools (ELK, Datadog, CloudWatch).

### Decision
We use **Pino** as the structured JSON logger, with `pino-http` for request-level logging.

### Rationale
- Pino is the fastest Node.js logger with zero-overhead JSON serialization.
- Structured JSON output is directly ingestible by log aggregation platforms.
- `pino-http` automatically logs request ID, method, URL, status code, and response time.
- No `console.log` or `console.error` statements exist in the codebase.

### Consequences
- All logging must use the centralized `logger` instance from `utils/logger.ts`.
- Request IDs are automatically propagated through the `pino-http` middleware.
