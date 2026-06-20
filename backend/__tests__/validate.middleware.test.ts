/**
 * @module validate.middleware.test
 * @description Tests for the Zod validation middleware factory.
 * Validates correct request body parsing, schema enforcement, error formatting,
 * and passthrough of valid data to downstream handlers.
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../src/middlewares/validate';

function createMockReqResNext(body: unknown) {
  const req = { body } as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  const next = jest.fn() as NextFunction;
  return { req, res, next };
}

describe('validate middleware', () => {
  const testSchema = z.object({
    email: z.string().email(),
    age: z.number().int().positive(),
  });

  it('should call next() and sanitize body when input is valid', () => {
    const { req, res, next } = createMockReqResNext({
      email: 'user@example.com',
      age: 25,
    });

    validate(testSchema)(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body).toEqual({ email: 'user@example.com', age: 25 });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should strip unknown fields from body (Zod default behavior)', () => {
    const { req, res, next } = createMockReqResNext({
      email: 'user@example.com',
      age: 30,
      maliciousField: '<script>alert("xss")</script>',
    });

    validate(testSchema)(req, res, next);

    expect(next).toHaveBeenCalled();
    // Zod strips extra fields by default
    expect(req.body.maliciousField).toBeUndefined();
  });

  it('should return 400 with formatted errors when email is invalid', () => {
    const { req, res, next } = createMockReqResNext({
      email: 'not-an-email',
      age: 25,
    });

    validate(testSchema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'Validation Error',
        errors: expect.arrayContaining([
          expect.objectContaining({ field: 'email' }),
        ]),
      }),
    );
  });

  it('should return 400 when required fields are missing', () => {
    const { req, res, next } = createMockReqResNext({});

    validate(testSchema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    const errors = (res.json as jest.Mock).mock.calls[0][0].errors;
    expect(errors.length).toBeGreaterThanOrEqual(2);
  });

  it('should return 400 when age is negative', () => {
    const { req, res, next } = createMockReqResNext({
      email: 'user@example.com',
      age: -5,
    });

    validate(testSchema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when age is a float instead of integer', () => {
    const { req, res, next } = createMockReqResNext({
      email: 'user@example.com',
      age: 25.5,
    });

    validate(testSchema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
