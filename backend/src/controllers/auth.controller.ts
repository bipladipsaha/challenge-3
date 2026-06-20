/**
 * @module authController
 * @description Handles all authentication-related HTTP request/response operations.
 * Implements secure cookie-based JWT authentication with HTTPOnly, Secure, SameSite cookies.
 * All token storage uses HTTP-only cookies to prevent XSS-based token theft.
 */

import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth/auth.service';
import { AuthenticatedRequest } from '../middlewares/auth';
import { HttpStatus, API_STATUS, TOKEN_CONFIG } from '../constants';
import { AuthenticationError } from '../errors/AppError';

/**
 * Sets both access and refresh token cookies on the HTTP response.
 * Uses HTTPOnly + Secure + SameSite=strict to prevent XSS and CSRF attacks.
 *
 * @param res - Express response object.
 * @param accessToken - The JWT access token to set.
 * @param refreshToken - The JWT refresh token to set.
 */
const setTokenCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  res.cookie(TOKEN_CONFIG.ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE,
  });
  res.cookie(TOKEN_CONFIG.REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: TOKEN_CONFIG.REFRESH_TOKEN_PATH,
    maxAge: TOKEN_CONFIG.REFRESH_TOKEN_MAX_AGE,
  });
};

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user account
 *     description: Creates a new user account and returns user data with auth cookies set.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, firstName, lastName]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *     responses:
 *       201: { description: User registered successfully }
 *       409: { description: Email already exists }
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accessToken, refreshToken, user } = await authService.register(req.body);
    setTokenCookies(res, accessToken, refreshToken);

    res.status(HttpStatus.CREATED).json({
      status: API_STATUS.SUCCESS,
      message: 'User registered successfully.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate a user
 *     description: Validates credentials and sets HTTPOnly auth cookies on success.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accessToken, refreshToken, user } = await authService.login(req.body);
    setTokenCookies(res, accessToken, refreshToken);

    res.status(HttpStatus.OK).json({
      status: API_STATUS.SUCCESS,
      message: 'Login successful.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     description: Uses the refresh token cookie to issue a new access token.
 *     responses:
 *       200: { description: Tokens refreshed successfully }
 *       401: { description: Invalid or missing refresh token }
 */
export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) {
      throw new AuthenticationError('No refresh token provided.');
    }
    const { accessToken, refreshToken } = await authService.refreshAccessToken(token);
    setTokenCookies(res, accessToken, refreshToken);

    res.status(HttpStatus.OK).json({
      status: API_STATUS.SUCCESS,
      message: 'Tokens refreshed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout the authenticated user
 *     description: Clears authentication cookies and invalidates the user session.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Logout successful }
 *       401: { description: Not authenticated }
 */
export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AuthenticationError('Not authenticated.');
    }
    await authService.logout(req.userId);

    res.clearCookie(TOKEN_CONFIG.ACCESS_TOKEN_COOKIE);
    res.clearCookie(TOKEN_CONFIG.REFRESH_TOKEN_COOKIE, { path: TOKEN_CONFIG.REFRESH_TOKEN_PATH });

    res.status(HttpStatus.OK).json({
      status: API_STATUS.SUCCESS,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /auth/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get the authenticated user's profile
 *     description: Returns the profile data for the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: User profile data }
 *       401: { description: Not authenticated }
 */
export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AuthenticationError('Not authenticated.');
    }
    const profile = await authService.getProfile(req.userId);
    res.status(HttpStatus.OK).json({
      status: API_STATUS.SUCCESS,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
