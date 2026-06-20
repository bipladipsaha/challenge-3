/**
 * @module aiController
 * @description Handles all AI-powered endpoints including carbon advice,
 * habit analysis, eco-coach chat, challenge generation, sustainability scoring,
 * and emission prediction. Integrates with Google Gemini AI and the ML prediction service.
 *
 * @remarks
 * This controller delegates all scoring and prediction logic to `carbonCalculator.ts`
 * to maintain the Single Responsibility Principle. The controller is only responsible
 * for HTTP request/response handling.
 */

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { aiService } from '../services/ai/GeminiService';
import * as entriesService from '../services/entries/entries.service';
import { calculateSustainabilityScore, predictFutureEmissions } from '../utils/carbonCalculator';
import { HttpStatus, API_STATUS } from '../constants';

/**
 * Generates AI-powered carbon reduction advice based on the user's emission summary.
 *
 * @param req - Authenticated request containing the user ID.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const getAdvice = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const summary = await entriesService.getSummary(req.userId!);
    const advice = await aiService.generateCarbonAdvice(summary);
    res.status(HttpStatus.OK).json({ status: API_STATUS.SUCCESS, data: { advice } });
  } catch (error) {
    next(error);
  }
};

/**
 * Performs AI-driven analysis of the user's carbon emission habits.
 *
 * @param req - Authenticated request containing the user ID.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const getHabitAnalysis = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await entriesService.getEntries(req.userId!, {
      page: 1,
      limit: 100,
      sortBy: 'date',
      sortOrder: 'desc',
    });
    const analysis = await aiService.generateHabitAnalysis(result.entries);
    res.status(HttpStatus.OK).json({ status: API_STATUS.SUCCESS, data: { analysis } });
  } catch (error) {
    next(error);
  }
};

/**
 * Chat endpoint for the AI Eco Coach.
 * Accepts a user message and optional conversation history.
 *
 * @param req - Authenticated request with message and history in body.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const chatWithCoach = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { message, history = [] } = req.body;
    const response = await aiService.chatWithEcoCoach(message, history);
    res.status(HttpStatus.OK).json({ status: API_STATUS.SUCCESS, data: { response } });
  } catch (error) {
    next(error);
  }
};

/**
 * Generates personalized sustainability challenges based on the user's emission profile.
 *
 * @param req - Authenticated request containing the user ID.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const generateChallenges = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const summary = await entriesService.getSummary(req.userId!);
    const challenges = await aiService.generateChallenges(summary);
    res.status(HttpStatus.OK).json({ status: API_STATUS.SUCCESS, data: { challenges } });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculates a sustainability score for the user based on their emission data.
 * Delegates all scoring logic to the centralized `carbonCalculator` utility.
 *
 * @param req - Authenticated request containing the user ID.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const getSustainabilityScore = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const summary = await entriesService.getSummary(req.userId!);
    const scoreResult = calculateSustainabilityScore(summary.total, summary.byCategory);

    res.status(HttpStatus.OK).json({
      status: API_STATUS.SUCCESS,
      data: scoreResult,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Predicts future carbon emissions using linear regression analysis
 * on the user's monthly emission trend data.
 * Delegates all prediction logic to the centralized `carbonCalculator` utility.
 *
 * @param req - Authenticated request containing the user ID.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const predictEmissions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const summary = await entriesService.getSummary(req.userId!);
    const monthlyTotals = summary.monthlyTrend.map(
      (m: { total: number; month: string }) => m.total,
    );
    const predictions = predictFutureEmissions(monthlyTotals);

    res.status(HttpStatus.OK).json({
      status: API_STATUS.SUCCESS,
      data: {
        predictions: {
          next30Days: predictions.next30Days,
          next90Days: predictions.next90Days,
          nextYear: predictions.nextYear,
        },
        trend: predictions.trend,
      },
    });
  } catch (error) {
    next(error);
  }
};
