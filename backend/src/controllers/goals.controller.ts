/**
 * @module goalsController
 * @description Handles all HTTP requests related to sustainability goal management.
 * Provides endpoints for creating, retrieving, updating, and deleting user goals.
 */

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { getUserId } from '../utils/authHelper';
import * as goalsService from '../services/goals/goals.service';
import { HttpStatus, API_STATUS } from '../constants';

/**
 * Creates a new sustainability goal for the authenticated user.
 *
 * @param req - Authenticated request containing goal creation data.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const createGoal = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const goal = await goalsService.createGoal(getUserId(req), req.body);
    res.status(HttpStatus.CREATED).json({ status: API_STATUS.SUCCESS, data: goal });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all sustainability goals for the authenticated user.
 *
 * @param req - Authenticated request containing the user ID.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const getGoals = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const goals = await goalsService.getGoals(getUserId(req));
    res.status(HttpStatus.OK).json({ status: API_STATUS.SUCCESS, data: goals });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a specific sustainability goal by its ID.
 *
 * @param req - Authenticated request containing the goal ID parameter.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const getGoalById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const goal = await goalsService.getGoalById(getUserId(req), req.params.id);
    res.status(HttpStatus.OK).json({ status: API_STATUS.SUCCESS, data: goal });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing sustainability goal.
 *
 * @param req - Authenticated request containing update data and goal ID.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const updateGoal = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const goal = await goalsService.updateGoal(getUserId(req), req.params.id, req.body);
    res.status(HttpStatus.OK).json({ status: API_STATUS.SUCCESS, data: goal });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a specific sustainability goal by its ID.
 *
 * @param req - Authenticated request containing the goal ID.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const deleteGoal = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await goalsService.deleteGoal(getUserId(req), req.params.id);
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
