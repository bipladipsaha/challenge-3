/**
 * @module AppError.test
 * @description Tests for the AppError class hierarchy.
 * Validates correct status codes, error codes, operational flags,
 * and proper prototype chain for instanceof checks.
 */

import {
  AppError,
  AuthenticationError,
  TokenExpiredError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  ExternalServiceError,
} from '../src/errors/AppError';
import { HttpStatus, ErrorCode } from '../src/constants';

describe('AppError base class', () => {
  it('should create an error with correct defaults', () => {
    const error = new AppError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(error.errorCode).toBe(ErrorCode.INTERNAL_ERROR);
    expect(error.isOperational).toBe(true);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it('should allow custom status and error codes', () => {
    const error = new AppError('Custom', HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
    expect(error.statusCode).toBe(400);
    expect(error.errorCode).toBe('VALIDATION_ERROR');
  });

  it('should support non-operational (programmer) errors', () => {
    const error = new AppError('Bug', 500, ErrorCode.INTERNAL_ERROR, false);
    expect(error.isOperational).toBe(false);
  });

  it('should have a proper stack trace', () => {
    const error = new AppError('Traceable');
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('Traceable');
  });
});

describe('AuthenticationError', () => {
  it('should have correct status code and error code', () => {
    const error = new AuthenticationError();
    expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    expect(error.errorCode).toBe(ErrorCode.AUTHENTICATION_FAILED);
    expect(error.message).toBe('Authentication failed.');
    expect(error).toBeInstanceOf(AppError);
  });

  it('should accept a custom message', () => {
    const error = new AuthenticationError('Invalid credentials');
    expect(error.message).toBe('Invalid credentials');
  });
});

describe('TokenExpiredError', () => {
  it('should have correct status code and error code', () => {
    const error = new TokenExpiredError();
    expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    expect(error.errorCode).toBe(ErrorCode.TOKEN_EXPIRED);
  });
});

describe('ForbiddenError', () => {
  it('should have correct status code and error code', () => {
    const error = new ForbiddenError();
    expect(error.statusCode).toBe(HttpStatus.FORBIDDEN);
    expect(error.errorCode).toBe(ErrorCode.INSUFFICIENT_PERMISSIONS);
  });
});

describe('NotFoundError', () => {
  it('should have correct status code and error code', () => {
    const error = new NotFoundError();
    expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(error.errorCode).toBe(ErrorCode.RESOURCE_NOT_FOUND);
  });
});

describe('ConflictError', () => {
  it('should have correct status code and error code', () => {
    const error = new ConflictError();
    expect(error.statusCode).toBe(HttpStatus.CONFLICT);
    expect(error.errorCode).toBe(ErrorCode.RESOURCE_CONFLICT);
  });
});

describe('ValidationError', () => {
  it('should have correct status code and carry details', () => {
    const details = { fields: ['email', 'password'] };
    const error = new ValidationError('Bad input', details);
    expect(error.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(error.errorCode).toBe(ErrorCode.VALIDATION_ERROR);
    expect(error.details).toEqual(details);
  });

  it('should default to undefined details', () => {
    const error = new ValidationError();
    expect(error.details).toBeUndefined();
  });
});

describe('ExternalServiceError', () => {
  it('should have correct status code and error code', () => {
    const error = new ExternalServiceError();
    expect(error.statusCode).toBe(HttpStatus.SERVICE_UNAVAILABLE);
    expect(error.errorCode).toBe(ErrorCode.EXTERNAL_SERVICE_ERROR);
  });
});

describe('Error hierarchy instanceof checks', () => {
  it('all subclasses should be instanceof AppError and Error', () => {
    const errors = [
      new AuthenticationError(),
      new TokenExpiredError(),
      new ForbiddenError(),
      new NotFoundError(),
      new ConflictError(),
      new ValidationError(),
      new ExternalServiceError(),
    ];
    errors.forEach((error) => {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(Error);
    });
  });
});
