/**
 * @module authHelper
 * @description Provides type-safe utility functions for extracting authentication data
 * from HTTP requests, eliminating the need for non-null assertions (`!`).
 */

import { AuthenticatedRequest } from '../middlewares/auth';
import { AuthenticationError } from '../errors/AppError';

/**
 * Extracts and guarantees the presence of a user ID from an authenticated request.
 * Throws a typed AuthenticationError if the user ID is missing, satisfying strict
 * TypeScript compilation without using the non-null assertion operator.
 *
 * @param req - The Express request object containing potential authentication data.
 * @returns The guaranteed user ID string.
 * @throws {AuthenticationError} If the user ID is not present on the request.
 */
export const getUserId = (req: AuthenticatedRequest): string => {
  if (!req.userId) {
    throw new AuthenticationError('User not authenticated.');
  }
  return req.userId;
};
