/**
 * @module entriesController
 * @description Handles all HTTP requests related to carbon footprint entries.
 * Provides endpoints for creating, retrieving, updating, deleting, and summarizing emissions.
 */

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as entriesService from '../services/entries/entries.service';
import { queryEntriesSchema } from '../validators/entries.validator';
import { HttpStatus, API_STATUS } from '../constants';

/**
 * Creates a new carbon emission entry.
 *
 * @param req - Authenticated request containing entry data.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const createEntry = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const entry = await entriesService.createEntry(req.userId!, req.body);
    res.status(HttpStatus.CREATED).json({ status: API_STATUS.SUCCESS, data: entry });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves paginated and filtered carbon entries for the user.
 *
 * @param req - Authenticated request containing query parameters.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const getEntries = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = queryEntriesSchema.parse(req.query);
    const result = await entriesService.getEntries(req.userId!, query);
    res.status(HttpStatus.OK).json({ status: API_STATUS.SUCCESS, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a specific carbon entry by ID.
 *
 * @param req - Authenticated request containing the entry ID.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const getEntryById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const entry = await entriesService.getEntryById(req.userId!, req.params.id);
    res.status(HttpStatus.OK).json({ status: API_STATUS.SUCCESS, data: entry });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing carbon entry.
 *
 * @param req - Authenticated request containing update data.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const updateEntry = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const entry = await entriesService.updateEntry(req.userId!, req.params.id, req.body);
    res.status(HttpStatus.OK).json({ status: API_STATUS.SUCCESS, data: entry });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a specific carbon entry by ID.
 *
 * @param req - Authenticated request containing the entry ID.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const deleteEntry = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await entriesService.deleteEntry(req.userId!, req.params.id);
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves the user's aggregated carbon emission summary and trends.
 *
 * @param req - Authenticated request.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const getSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const summary = await entriesService.getSummary(req.userId!);
    res.status(HttpStatus.OK).json({ status: API_STATUS.SUCCESS, data: summary });
  } catch (error) {
    next(error);
  }
};
