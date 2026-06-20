/**
 * @module aiController
 * @description Handles all AI-powered endpoints including carbon advice,
 * habit analysis, eco-coach chat, challenge generation, sustainability scoring,
 * and emission prediction. Integrates with Google Gemini AI and the ML prediction service.
 */

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { aiService } from '../services/ai/GeminiService';
import * as entriesService from '../services/entries/entries.service';
import {
  HttpStatus,
  API_STATUS,
  EMISSION_BENCHMARKS,
  SCORE_THRESHOLDS,
  DEFAULT_BENCHMARK,
  MIN_SCORE,
  MAX_SCORE,
} from '../constants';

/**
 * Generates AI-powered carbon reduction advice based on the user's emission summary.
 *
 * @param req - Authenticated request containing the user ID.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const getAdvice = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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
export const getHabitAnalysis = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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
export const chatWithCoach = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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
export const generateChallenges = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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
 * Uses category-specific benchmarks to score each emission category,
 * then computes an overall weighted average.
 *
 * @param req - Authenticated request containing the user ID.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const getSustainabilityScore = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const summary = await entriesService.getSummary(req.userId!);
    const totalEmissions = summary.total;

    const categoryScores = summary.byCategory.map((cat: { category: string; total: number; count: number }) => {
      const benchmark = EMISSION_BENCHMARKS[cat.category] || DEFAULT_BENCHMARK;
      const score = Math.max(MIN_SCORE, Math.min(MAX_SCORE, Math.round(MAX_SCORE - (cat.total / benchmark) * MAX_SCORE)));
      return { category: cat.category, score, total: cat.total };
    });

    const overallScore =
      categoryScores.length > 0
        ? Math.round(categoryScores.reduce((sum: number, c: { score: number }) => sum + c.score, 0) / categoryScores.length)
        : MAX_SCORE;

    const rating =
      overallScore >= SCORE_THRESHOLDS.EXCELLENT
        ? 'Excellent'
        : overallScore >= SCORE_THRESHOLDS.GOOD
          ? 'Good'
          : overallScore >= SCORE_THRESHOLDS.FAIR
            ? 'Fair'
            : 'Needs Improvement';

    res.status(HttpStatus.OK).json({
      status: API_STATUS.SUCCESS,
      data: { overallScore, totalEmissions, categoryScores, rating },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Predicts future carbon emissions using linear regression analysis
 * on the user's monthly emission trend data.
 * Returns 30-day, 90-day, and yearly predictions.
 *
 * @param req - Authenticated request containing the user ID.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const predictEmissions = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const summary = await entriesService.getSummary(req.userId!);
    const monthlyData = summary.monthlyTrend;
    const MINIMUM_DATA_POINTS = 2;

    if (monthlyData.length < MINIMUM_DATA_POINTS) {
      res.status(HttpStatus.OK).json({
        status: API_STATUS.SUCCESS,
        data: {
          message: 'Not enough data for predictions. Log at least 2 months of data.',
          predictions: null,
        },
      });
      return;
    }

    const values = monthlyData.map((m: { total: number; month: string }) => m.total);
    const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
    const trend =
      values.length > 1 ? (values[values.length - 1] - values[0]) / (values.length - 1) : 0;

    const PREDICTION_MULTIPLIERS = { THIRTY_DAYS: 1, NINETY_DAYS: 3, ONE_YEAR: 12 } as const;

    res.status(HttpStatus.OK).json({
      status: API_STATUS.SUCCESS,
      data: {
        predictions: {
          next30Days: Math.max(0, Math.round((avg + trend) * 100) / 100),
          next90Days: Math.max(0, Math.round((avg + trend * PREDICTION_MULTIPLIERS.NINETY_DAYS) * PREDICTION_MULTIPLIERS.NINETY_DAYS * 100) / 100),
          nextYear: Math.max(0, Math.round((avg + trend * PREDICTION_MULTIPLIERS.ONE_YEAR) * PREDICTION_MULTIPLIERS.ONE_YEAR * 100) / 100),
        },
        currentMonthlyAverage: Math.round(avg * 100) / 100,
        trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
      },
    });
  } catch (error) {
    next(error);
  }
};
