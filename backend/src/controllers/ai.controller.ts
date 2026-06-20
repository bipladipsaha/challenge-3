import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { aiService } from '../services/ai/GeminiService';
import * as entriesService from '../services/entries/entries.service';

/**
 * @openapi
 * /ai/advice:
 *   post:
 *     tags: [AI]
 *     summary: Get AI-powered carbon reduction advice
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: AI-generated advice }
 */
export const getAdvice = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const summary = await entriesService.getSummary(req.userId!);
    const advice = await aiService.generateCarbonAdvice(summary);
    res.status(200).json({ status: 'success', data: { advice } });
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /ai/habits:
 *   get:
 *     tags: [AI]
 *     summary: Get AI habit analysis
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: AI habit analysis }
 */
export const getHabitAnalysis = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await entriesService.getEntries(req.userId!, {
      page: 1,
      limit: 100,
      sortBy: 'date',
      sortOrder: 'desc',
    });
    const analysis = await aiService.generateHabitAnalysis(result.entries);
    res.status(200).json({ status: 'success', data: { analysis } });
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /ai/chat:
 *   post:
 *     tags: [AI]
 *     summary: Chat with AI Eco Coach
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message: { type: string }
 *               history: { type: array, items: { type: object } }
 *     responses:
 *       200: { description: AI chat response }
 */
export const chatWithCoach = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { message, history = [] } = req.body;
    const response = await aiService.chatWithEcoCoach(message, history);
    res.status(200).json({ status: 'success', data: { response } });
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /ai/challenges:
 *   get:
 *     tags: [AI]
 *     summary: Generate AI sustainability challenges
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Generated challenges }
 */
export const generateChallenges = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const summary = await entriesService.getSummary(req.userId!);
    const challenges = await aiService.generateChallenges(summary);
    res.status(200).json({ status: 'success', data: { challenges } });
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /ai/score:
 *   get:
 *     tags: [AI]
 *     summary: Get AI sustainability score
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Sustainability scores by category }
 */
export const getSustainabilityScore = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const summary = await entriesService.getSummary(req.userId!);
    const totalEmissions = summary.total;

    // Calculate scores based on emission benchmarks (lower is better)
    const categoryScores = summary.byCategory.map((cat: { category: string; total: number; count: number }) => {
      const benchmarks: Record<string, number> = {
        TRAVEL: 200,
        ELECTRICITY: 150,
        FOOD: 100,
        SHOPPING: 80,
        WATER: 30,
        WASTE: 50,
        OTHER: 60,
      };
      const benchmark = benchmarks[cat.category] || 100;
      const score = Math.max(0, Math.min(100, Math.round(100 - (cat.total / benchmark) * 100)));
      return { category: cat.category, score, total: cat.total };
    });

    const overallScore =
      categoryScores.length > 0
        ? Math.round(categoryScores.reduce((sum: number, c: { score: number }) => sum + c.score, 0) / categoryScores.length)
        : 100;

    res.status(200).json({
      status: 'success',
      data: {
        overallScore,
        totalEmissions,
        categoryScores,
        rating:
          overallScore >= 80
            ? 'Excellent'
            : overallScore >= 60
              ? 'Good'
              : overallScore >= 40
                ? 'Fair'
                : 'Needs Improvement',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /ai/predict:
 *   get:
 *     tags: [AI]
 *     summary: Predict future carbon emissions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Emission predictions }
 */
export const predictEmissions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const summary = await entriesService.getSummary(req.userId!);
    const monthlyData = summary.monthlyTrend;

    // Simple linear regression for predictions
    if (monthlyData.length < 2) {
      res.status(200).json({
        status: 'success',
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

    res.status(200).json({
      status: 'success',
      data: {
        predictions: {
          next30Days: Math.max(0, Math.round((avg + trend) * 100) / 100),
          next90Days: Math.max(0, Math.round((avg + trend * 3) * 3 * 100) / 100),
          nextYear: Math.max(0, Math.round((avg + trend * 12) * 12 * 100) / 100),
        },
        currentMonthlyAverage: Math.round(avg * 100) / 100,
        trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
      },
    });
  } catch (error) {
    next(error);
  }
};
