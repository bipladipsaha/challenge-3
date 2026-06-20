/**
 * @module errorHandler.test
 * @description Comprehensive tests for the centralized Express error handling middleware.
 * Validates correct HTTP status codes, structured error responses, Zod validation errors,
 * AppError hierarchy, and unknown exception handling.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssueCode } from 'zod';
import { errorHandler } from '../src/middlewares/errorHandler';
import { AppError, ValidationError, AuthenticationError, NotFoundError } from '../src/errors/AppError';
import { HttpStatus, ErrorCode, API_STATUS } from '../src/constants';

// Mock the logger to prevent console output during tests
jest.mock('../src/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}));

const mockRequest = {} as Request;
const mockNext = jest.fn() as NextFunction;

function createMockResponse(): Response {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('errorHandler middleware', () => {
  let res: Response;

  beforeEach(() => {
    res = createMockResponse();
    jest.clearAllMocks();
  });

  // ─── ZodError handling ──────────────────────────────────────────────────

  describe('ZodError handling', () => {
    it('should return 400 with validation errors for ZodError', () => {
      const zodError = new ZodError([
        {
          code: ZodIssueCode.invalid_type,
          expected: 'string',
          received: 'number',
          path: ['email'],
          message: 'Expected string, received number',
        },
      ]);

      errorHandler(zodError, mockRequest, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: API_STATUS.ERROR,
          errorCode: ErrorCode.VALIDATION_ERROR,
          message: 'Validation Error',
          errors: expect.arrayContaining([
            expect.objectContaining({ path: ['email'] }),
          ]),
        }),
      );
    });
  });

  // ─── ValidationError handling ───────────────────────────────────────────

  describe('ValidationError handling', () => {
    it('should return 422 with details for ValidationError', () => {
      const validationError = new ValidationError('Invalid input', { field: 'email' });

      errorHandler(validationError, mockRequest, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: API_STATUS.ERROR,
          errorCode: ErrorCode.VALIDATION_ERROR,
          message: 'Invalid input',
          details: { field: 'email' },
        }),
      );
    });
  });

  // ─── AppError subclass handling ─────────────────────────────────────────

  describe('AppError subclass handling', () => {
    it('should return 401 for AuthenticationError', () => {
      const authError = new AuthenticationError('Bad credentials');

      errorHandler(authError, mockRequest, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: API_STATUS.ERROR,
          errorCode: ErrorCode.AUTHENTICATION_FAILED,
          message: 'Bad credentials',
        }),
      );
    });

    it('should return 404 for NotFoundError', () => {
      const notFoundError = new NotFoundError('User not found');

      errorHandler(notFoundError, mockRequest, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ErrorCode.RESOURCE_NOT_FOUND,
        }),
      );
    });

    it('should return the correct status code for generic AppError', () => {
      const appError = new AppError('Custom error', HttpStatus.CONFLICT, ErrorCode.RESOURCE_CONFLICT);

      errorHandler(appError, mockRequest, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ErrorCode.RESOURCE_CONFLICT,
          message: 'Custom error',
        }),
      );
    });
  });

  // ─── Unknown error handling ─────────────────────────────────────────────

  describe('Unknown error handling', () => {
    it('should return 500 and log unhandled exceptions', () => {
      const { logger } = require('../src/utils/logger');
      const genericError = new Error('Something unexpected broke');

      errorHandler(genericError, mockRequest, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: API_STATUS.ERROR,
          errorCode: ErrorCode.INTERNAL_ERROR,
          message: 'Internal Server Error',
        }),
      );
      expect(logger.error).toHaveBeenCalledWith(genericError, 'Unhandled Exception');
    });

    it('should not expose internal error message to the client', () => {
      const internalError = new Error('DB connection lost: postgres://secret@host');

      errorHandler(internalError, mockRequest, res, mockNext);

      const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCall.message).toBe('Internal Server Error');
      expect(jsonCall.message).not.toContain('postgres');
    });
  });
});
