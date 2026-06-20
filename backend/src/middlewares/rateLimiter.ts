/**
 * @module rateLimiter
 * @description Express middleware for rate limiting API requests.
 * Provides separate limiters for general API endpoints and authentication routes
 * to prevent brute-force attacks and abuse.
 */

import rateLimit from 'express-rate-limit';
import { RATE_LIMIT, API_STATUS } from '../constants';

/**
 * General API rate limiter.
 * Limits each IP to {@link RATE_LIMIT.MAX_REQUESTS} requests
 * per {@link RATE_LIMIT.WINDOW_MS} millisecond window.
 */
export const rateLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  limit: RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    status: API_STATUS.ERROR,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

/**
 * Authentication-specific rate limiter.
 * Limits each IP to {@link RATE_LIMIT.AUTH_MAX_REQUESTS} login/register attempts
 * per {@link RATE_LIMIT.AUTH_WINDOW_MS} millisecond window to prevent brute-force attacks.
 */
export const authLimiter = rateLimit({
  windowMs: RATE_LIMIT.AUTH_WINDOW_MS,
  limit: RATE_LIMIT.AUTH_MAX_REQUESTS,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    status: API_STATUS.ERROR,
    message: 'Too many authentication attempts, please try again after an hour',
  },
});
