import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as entriesService from '../services/entries/entries.service';
import { queryEntriesSchema } from '../validators/entries.validator';

/**
 * @openapi
 * /entries:
 *   post:
 *     tags: [Carbon Entries]
 *     summary: Create a new carbon entry
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category, amount]
 *             properties:
 *               category: { type: string, enum: [TRAVEL, ELECTRICITY, FOOD, SHOPPING, WATER, WASTE, OTHER] }
 *               amount: { type: number }
 *               description: { type: string }
 *               date: { type: string, format: date-time }
 *     responses:
 *       201: { description: Entry created }
 */
export const createEntry = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const entry = await entriesService.createEntry(req.userId!, req.body);
    res.status(201).json({ status: 'success', data: entry });
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /entries:
 *   get:
 *     tags: [Carbon Entries]
 *     summary: Get paginated carbon entries
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, default: date }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, default: desc }
 *     responses:
 *       200: { description: Paginated entries }
 */
export const getEntries = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = queryEntriesSchema.parse(req.query);
    const result = await entriesService.getEntries(req.userId!, query);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const getEntryById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const entry = await entriesService.getEntryById(req.userId!, req.params.id);
    res.status(200).json({ status: 'success', data: entry });
  } catch (error) {
    next(error);
  }
};

export const updateEntry = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const entry = await entriesService.updateEntry(req.userId!, req.params.id, req.body);
    res.status(200).json({ status: 'success', data: entry });
  } catch (error) {
    next(error);
  }
};

export const deleteEntry = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    await entriesService.deleteEntry(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /entries/summary:
 *   get:
 *     tags: [Carbon Entries]
 *     summary: Get carbon emission summary and trends
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Summary statistics }
 */
export const getSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const summary = await entriesService.getSummary(req.userId!);
    res.status(200).json({ status: 'success', data: summary });
  } catch (error) {
    next(error);
  }
};
