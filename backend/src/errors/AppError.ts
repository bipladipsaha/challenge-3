/**
 * @module AppError
 * @description Centralized, structured error hierarchy for the CarbonIQ API.
 * Extends the native Error class to provide consistent HTTP error codes,
 * application-level error codes, and operational vs. programmer error distinction.
 */

import { ErrorCode, HttpStatus } from '../constants';

/**
 * Base application error class.
 * All custom errors in the application should extend this class.
 *
 * @extends Error
 * @example
 * ```typescript
 * throw new AppError('Resource not found', HttpStatus.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND);
 * ```
 */
export class AppError extends Error {
  /** HTTP status code to return in the response. */
  public readonly statusCode: number;

  /** Application-specific error code for client-side handling. */
  public readonly errorCode: string;

  /** Whether this error is an expected operational error vs. a programming bug. */
  public readonly isOperational: boolean;

  /**
   * Creates a new AppError instance.
   * @param message - Human-readable error description.
   * @param statusCode - HTTP status code (defaults to 500).
   * @param errorCode - Application-specific error code.
   * @param isOperational - Whether this is an operational error (default: true).
   */
  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: string = ErrorCode.INTERNAL_ERROR,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when authentication fails (invalid credentials, missing token, etc.).
 * Returns HTTP 401.
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed.') {
    super(message, HttpStatus.UNAUTHORIZED, ErrorCode.AUTHENTICATION_FAILED);
  }
}

/**
 * Error thrown when a JWT token has expired.
 * Returns HTTP 401.
 */
export class TokenExpiredError extends AppError {
  constructor(message: string = 'Token has expired.') {
    super(message, HttpStatus.UNAUTHORIZED, ErrorCode.TOKEN_EXPIRED);
  }
}

/**
 * Error thrown when the user lacks permission to access a resource.
 * Returns HTTP 403.
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Insufficient permissions.') {
    super(message, HttpStatus.FORBIDDEN, ErrorCode.INSUFFICIENT_PERMISSIONS);
  }
}

/**
 * Error thrown when a requested resource is not found.
 * Returns HTTP 404.
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found.') {
    super(message, HttpStatus.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND);
  }
}

/**
 * Error thrown when a resource conflict occurs (e.g., duplicate email).
 * Returns HTTP 409.
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists.') {
    super(message, HttpStatus.CONFLICT, ErrorCode.RESOURCE_CONFLICT);
  }
}

/**
 * Error thrown when input validation fails.
 * Returns HTTP 422.
 */
export class ValidationError extends AppError {
  /** Detailed validation error messages. */
  public readonly details: unknown;

  /**
   * @param message - Error summary message.
   * @param details - Detailed validation error information.
   */
  constructor(message: string = 'Validation failed.', details?: unknown) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, ErrorCode.VALIDATION_ERROR);
    this.details = details;
  }
}

/**
 * Error thrown when an external service (AI, email, etc.) is unavailable.
 * Returns HTTP 503.
 */
export class ExternalServiceError extends AppError {
  constructor(message: string = 'External service is temporarily unavailable.') {
    super(message, HttpStatus.SERVICE_UNAVAILABLE, ErrorCode.EXTERNAL_SERVICE_ERROR);
  }
}
