/**
 * @module auth.middleware.test
 * @description Tests for authentication and authorization middleware.
 * Validates JWT token extraction from cookies and Authorization headers,
 * token verification, role-based access control, and security edge cases.
 */

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, authorize, AuthenticatedRequest } from '../src/middlewares/auth';
import { AppError } from '../src/errors/AppError';

// Mock environment config
jest.mock('../src/config/env', () => ({
  env: {
    JWT_SECRET: 'test-jwt-secret-key-minimum-length',
    JWT_REFRESH_SECRET: 'test-refresh-secret-key-minimum-length',
    NODE_ENV: 'test',
  },
}));

describe('authenticate middleware', () => {
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      cookies: {},
      headers: {},
    };
    mockRes = {};
    mockNext = jest.fn();
  });

  it('should extract and verify token from accessToken cookie', () => {
    const token = jwt.sign(
      { userId: 'user-123', role: 'USER' },
      'test-jwt-secret-key-minimum-length',
    );
    mockReq.cookies = { accessToken: token };

    authenticate(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

    expect(mockReq.userId).toBe('user-123');
    expect(mockReq.userRole).toBe('USER');
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should extract and verify token from Authorization Bearer header', () => {
    const token = jwt.sign(
      { userId: 'user-456', role: 'ADMIN' },
      'test-jwt-secret-key-minimum-length',
    );
    mockReq.headers = { authorization: `Bearer ${token}` };

    authenticate(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

    expect(mockReq.userId).toBe('user-456');
    expect(mockReq.userRole).toBe('ADMIN');
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should throw AppError when no token is provided', () => {
    expect(() => {
      authenticate(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);
    }).toThrow(AppError);

    expect(() => {
      authenticate(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);
    }).toThrow('Authentication required. No token provided.');
  });

  it('should throw AppError for an expired token', () => {
    const token = jwt.sign(
      { userId: 'user-789', role: 'USER' },
      'test-jwt-secret-key-minimum-length',
      { expiresIn: '0s' }, // immediately expired
    );
    mockReq.cookies = { accessToken: token };

    expect(() => {
      authenticate(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);
    }).toThrow('Invalid or expired token.');
  });

  it('should throw AppError for a token signed with a different secret', () => {
    const token = jwt.sign({ userId: 'user-999', role: 'USER' }, 'wrong-secret-key');
    mockReq.cookies = { accessToken: token };

    expect(() => {
      authenticate(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);
    }).toThrow('Invalid or expired token.');
  });

  it('should throw AppError for a malformed token', () => {
    mockReq.cookies = { accessToken: 'not.a.valid.jwt.token' };

    expect(() => {
      authenticate(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);
    }).toThrow('Invalid or expired token.');
  });

  it('should prefer cookie over Authorization header when both present', () => {
    const cookieToken = jwt.sign(
      { userId: 'cookie-user', role: 'USER' },
      'test-jwt-secret-key-minimum-length',
    );
    const headerToken = jwt.sign(
      { userId: 'header-user', role: 'ADMIN' },
      'test-jwt-secret-key-minimum-length',
    );
    mockReq.cookies = { accessToken: cookieToken };
    mockReq.headers = { authorization: `Bearer ${headerToken}` };

    authenticate(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

    // Cookie takes priority
    expect(mockReq.userId).toBe('cookie-user');
  });
});

describe('authorize middleware', () => {
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRes = {};
    mockNext = jest.fn();
  });

  it('should allow access for a user with the required role', () => {
    const req = { userRole: 'ADMIN' } as AuthenticatedRequest;
    const middleware = authorize('ADMIN', 'SUPERADMIN');

    middleware(req, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should throw AppError when user role is not in allowed list', () => {
    const req = { userRole: 'USER' } as AuthenticatedRequest;
    const middleware = authorize('ADMIN');

    expect(() => {
      middleware(req, mockRes as Response, mockNext);
    }).toThrow('Insufficient permissions.');
  });

  it('should throw AppError when userRole is undefined (unauthenticated)', () => {
    const req = {} as AuthenticatedRequest;
    const middleware = authorize('ADMIN');

    expect(() => {
      middleware(req, mockRes as Response, mockNext);
    }).toThrow('Insufficient permissions.');
  });
});
