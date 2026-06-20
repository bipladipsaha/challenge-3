/**
 * @module constants
 * @description Centralized application constants eliminating all magic numbers and hardcoded strings.
 * Provides type-safe enums and configuration values used across the backend services.
 */

/** HTTP status codes used across the application. */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

/** Application-specific error codes for structured error responses. */
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  AI_SERVICE_UNAVAILABLE = 'AI_SERVICE_UNAVAILABLE',
}

/** Carbon emission categories matching the Prisma schema enum. */
export enum EmissionCategoryLabel {
  TRAVEL = 'TRAVEL',
  ELECTRICITY = 'ELECTRICITY',
  FOOD = 'FOOD',
  SHOPPING = 'SHOPPING',
  WATER = 'WATER',
  WASTE = 'WASTE',
  OTHER = 'OTHER',
}

/** Benchmark emissions (kg CO2) per category for sustainability scoring. */
export const EMISSION_BENCHMARKS: Record<string, number> = {
  [EmissionCategoryLabel.TRAVEL]: 200,
  [EmissionCategoryLabel.ELECTRICITY]: 150,
  [EmissionCategoryLabel.FOOD]: 100,
  [EmissionCategoryLabel.SHOPPING]: 80,
  [EmissionCategoryLabel.WATER]: 30,
  [EmissionCategoryLabel.WASTE]: 50,
  [EmissionCategoryLabel.OTHER]: 60,
};

/** Sustainability score rating thresholds. */
export const SCORE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  FAIR: 40,
} as const;

/** Rate limiter configuration values. */
export const RATE_LIMIT = {
  /** General API rate limit window in milliseconds (15 minutes). */
  WINDOW_MS: 15 * 60 * 1000,
  /** Maximum requests per window for general API endpoints. */
  MAX_REQUESTS: 100,
  /** Authentication rate limit window in milliseconds (1 hour). */
  AUTH_WINDOW_MS: 60 * 60 * 1000,
  /** Maximum authentication attempts per window. */
  AUTH_MAX_REQUESTS: 10,
} as const;

/** JWT token configuration. */
export const TOKEN_CONFIG = {
  /** Access token cookie name. */
  ACCESS_TOKEN_COOKIE: 'accessToken',
  /** Refresh token cookie name. */
  REFRESH_TOKEN_COOKIE: 'refreshToken',
  /** Access token cookie max age in milliseconds (15 minutes). */
  ACCESS_TOKEN_MAX_AGE: 15 * 60 * 1000,
  /** Refresh token cookie max age in milliseconds (7 days). */
  REFRESH_TOKEN_MAX_AGE: 7 * 24 * 60 * 60 * 1000,
  /** Refresh token cookie path. */
  REFRESH_TOKEN_PATH: '/api/v1/auth/refresh',
} as const;

/** Redis cache configuration. */
export const CACHE_CONFIG = {
  /** Summary cache TTL in seconds (1 hour). */
  SUMMARY_TTL: 60 * 60,
  /** Cache key prefix for user summaries. */
  SUMMARY_KEY_PREFIX: 'summary:',
} as const;

/** API response status strings. */
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

/** Default pagination values. */
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/** Number of months for trend analysis. */
export const TREND_MONTHS = 12;

/** Minimum score value. */
export const MIN_SCORE = 0;

/** Maximum score value. */
export const MAX_SCORE = 100;

/** Default benchmark for unknown categories. */
export const DEFAULT_BENCHMARK = 100;
