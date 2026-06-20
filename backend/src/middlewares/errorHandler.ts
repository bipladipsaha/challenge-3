/**
 * @module errorHandler
 * @description Centralized Express error-handling middleware.
 * Catches all errors thrown in route handlers and services,
 * normalizes them into a consistent JSON response format,
 * and logs unhandled exceptions for operational monitoring.
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';
import { AppError, ValidationError } from '../errors/AppError';
import { HttpStatus, API_STATUS, ErrorCode } from '../constants';

/**
 * Express error-handling middleware.
 * Must be registered after all route handlers.
 *
 * @param err - The error object caught by Express.
 * @param _req - The incoming HTTP request (unused but required by Express signature).
 * @param res - The outgoing HTTP response.
 * @param _next - The next middleware function (unused but required by Express signature).
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(HttpStatus.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      errorCode: ErrorCode.VALIDATION_ERROR,
      message: 'Validation Error',
      errors: err.errors,
    });
    return;
  }

  // Handle ValidationError with details
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      status: API_STATUS.ERROR,
      errorCode: err.errorCode,
      message: err.message,
      details: err.details,
    });
    return;
  }

  // Handle known operational AppErrors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: API_STATUS.ERROR,
      errorCode: err.errorCode,
      message: err.message,
    });
    return;
  }

  // Unhandled / programmer errors — log and return generic 500
  logger.error(err, 'Unhandled Exception');

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    status: API_STATUS.ERROR,
    errorCode: ErrorCode.INTERNAL_ERROR,
    message: 'Internal Server Error',
  });
};
