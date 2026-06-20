/**
 * @module constants.test
 * @description Tests for centralized application constants to verify correctness
 * and prevent accidental modification of critical business configuration values.
 */

import {
  HttpStatus,
  ErrorCode,
  EmissionCategoryLabel,
  EMISSION_BENCHMARKS,
  SCORE_THRESHOLDS,
  RATE_LIMIT,
  TOKEN_CONFIG,
  CACHE_CONFIG,
  API_STATUS,
  PAGINATION_DEFAULTS,
  TREND_MONTHS,
  MIN_SCORE,
  MAX_SCORE,
  DEFAULT_BENCHMARK,
} from '../src/constants';

describe('HttpStatus enum', () => {
  it('should define all standard HTTP status codes', () => {
    expect(HttpStatus.OK).toBe(200);
    expect(HttpStatus.CREATED).toBe(201);
    expect(HttpStatus.NO_CONTENT).toBe(204);
    expect(HttpStatus.BAD_REQUEST).toBe(400);
    expect(HttpStatus.UNAUTHORIZED).toBe(401);
    expect(HttpStatus.FORBIDDEN).toBe(403);
    expect(HttpStatus.NOT_FOUND).toBe(404);
    expect(HttpStatus.CONFLICT).toBe(409);
    expect(HttpStatus.UNPROCESSABLE_ENTITY).toBe(422);
    expect(HttpStatus.TOO_MANY_REQUESTS).toBe(429);
    expect(HttpStatus.INTERNAL_SERVER_ERROR).toBe(500);
    expect(HttpStatus.SERVICE_UNAVAILABLE).toBe(503);
  });
});

describe('ErrorCode enum', () => {
  it('should define all application error codes', () => {
    expect(ErrorCode.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
    expect(ErrorCode.AUTHENTICATION_FAILED).toBe('AUTHENTICATION_FAILED');
    expect(ErrorCode.RESOURCE_NOT_FOUND).toBe('RESOURCE_NOT_FOUND');
    expect(ErrorCode.AI_SERVICE_UNAVAILABLE).toBe('AI_SERVICE_UNAVAILABLE');
  });
});

describe('EmissionCategoryLabel enum', () => {
  it('should define all 7 emission categories', () => {
    const categories = Object.values(EmissionCategoryLabel);
    expect(categories).toHaveLength(7);
    expect(categories).toContain('TRAVEL');
    expect(categories).toContain('ELECTRICITY');
    expect(categories).toContain('FOOD');
    expect(categories).toContain('SHOPPING');
    expect(categories).toContain('WATER');
    expect(categories).toContain('WASTE');
    expect(categories).toContain('OTHER');
  });
});

describe('EMISSION_BENCHMARKS', () => {
  it('should have a benchmark for every emission category', () => {
    Object.values(EmissionCategoryLabel).forEach((category) => {
      expect(EMISSION_BENCHMARKS[category]).toBeDefined();
      expect(EMISSION_BENCHMARKS[category]).toBeGreaterThan(0);
    });
  });
});

describe('SCORE_THRESHOLDS', () => {
  it('should define thresholds in descending order', () => {
    expect(SCORE_THRESHOLDS.EXCELLENT).toBeGreaterThan(SCORE_THRESHOLDS.GOOD);
    expect(SCORE_THRESHOLDS.GOOD).toBeGreaterThan(SCORE_THRESHOLDS.FAIR);
  });
});

describe('RATE_LIMIT', () => {
  it('should define sensible rate limit values', () => {
    expect(RATE_LIMIT.WINDOW_MS).toBe(15 * 60 * 1000);
    expect(RATE_LIMIT.MAX_REQUESTS).toBe(100);
    expect(RATE_LIMIT.AUTH_WINDOW_MS).toBe(60 * 60 * 1000);
    expect(RATE_LIMIT.AUTH_MAX_REQUESTS).toBe(10);
  });

  it('should have auth limits stricter than general limits', () => {
    expect(RATE_LIMIT.AUTH_MAX_REQUESTS).toBeLessThan(RATE_LIMIT.MAX_REQUESTS);
  });
});

describe('TOKEN_CONFIG', () => {
  it('should define cookie names and expiry values', () => {
    expect(TOKEN_CONFIG.ACCESS_TOKEN_COOKIE).toBe('accessToken');
    expect(TOKEN_CONFIG.REFRESH_TOKEN_COOKIE).toBe('refreshToken');
    expect(TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE).toBe(15 * 60 * 1000);
    expect(TOKEN_CONFIG.REFRESH_TOKEN_MAX_AGE).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it('should have refresh token last longer than access token', () => {
    expect(TOKEN_CONFIG.REFRESH_TOKEN_MAX_AGE).toBeGreaterThan(TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE);
  });
});

describe('CACHE_CONFIG', () => {
  it('should define summary TTL in seconds', () => {
    expect(CACHE_CONFIG.SUMMARY_TTL).toBe(3600);
    expect(CACHE_CONFIG.SUMMARY_KEY_PREFIX).toBe('summary:');
  });
});

describe('API_STATUS', () => {
  it('should define success and error statuses', () => {
    expect(API_STATUS.SUCCESS).toBe('success');
    expect(API_STATUS.ERROR).toBe('error');
  });
});

describe('PAGINATION_DEFAULTS', () => {
  it('should define sensible pagination defaults', () => {
    expect(PAGINATION_DEFAULTS.PAGE).toBe(1);
    expect(PAGINATION_DEFAULTS.LIMIT).toBe(20);
    expect(PAGINATION_DEFAULTS.MAX_LIMIT).toBe(100);
    expect(PAGINATION_DEFAULTS.MAX_LIMIT).toBeGreaterThan(PAGINATION_DEFAULTS.LIMIT);
  });
});

describe('Score boundaries', () => {
  it('should have MIN_SCORE less than MAX_SCORE', () => {
    expect(MIN_SCORE).toBe(0);
    expect(MAX_SCORE).toBe(100);
    expect(MIN_SCORE).toBeLessThan(MAX_SCORE);
  });
});

describe('TREND_MONTHS and DEFAULT_BENCHMARK', () => {
  it('should have reasonable values', () => {
    expect(TREND_MONTHS).toBe(12);
    expect(DEFAULT_BENCHMARK).toBe(100);
  });
});
