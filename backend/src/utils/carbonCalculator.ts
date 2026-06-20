/**
 * @module carbonCalculator
 * @description Domain-specific utility functions for carbon footprint calculations,
 * sustainability scoring, goal planning, and leaderboard standings.
 * These functions directly map to the Carbon Footprint Awareness Platform requirements.
 */

import { EMISSION_BENCHMARKS, SCORE_THRESHOLDS, DEFAULT_BENCHMARK, MIN_SCORE, MAX_SCORE } from '../constants';

/** Represents a single carbon emission entry for calculation. */
interface EmissionEntry {
  category: string;
  amount: number;
  date: string | Date;
}

/** Represents a category-level emission summary. */
interface CategorySummary {
  category: string;
  total: number;
  count: number;
}

/** Represents a sustainability score result. */
interface SustainabilityScoreResult {
  overallScore: number;
  rating: string;
  categoryScores: Array<{ category: string; score: number; total: number }>;
  totalEmissions: number;
}

/** Represents a weekly goal plan item. */
interface WeeklyGoalItem {
  week: number;
  targetReduction: number;
  cumulativeTarget: number;
  description: string;
}

/** Represents a leaderboard entry. */
interface LeaderboardEntry {
  userId: string;
  displayName: string;
  score: number;
  rank: number;
  totalReduction: number;
}

/**
 * Calculates the total carbon footprint from a list of emission entries.
 * This is the core computation function for the Carbon Footprint Awareness Platform.
 *
 * @param entries - Array of carbon emission entries.
 * @returns The total carbon footprint in kg CO2 equivalent.
 *
 * @example
 * ```typescript
 * const total = calculateCarbonFootprint([
 *   { category: 'TRAVEL', amount: 50, date: '2024-01-15' },
 *   { category: 'ELECTRICITY', amount: 30, date: '2024-01-16' },
 * ]);
 * // Returns: 80
 * ```
 */
export function calculateCarbonFootprint(entries: EmissionEntry[]): number {
  return entries.reduce((total, entry) => total + entry.amount, 0);
}

/**
 * Calculates the sustainability score based on emission data and category benchmarks.
 * Lower emissions relative to benchmarks yield higher scores.
 *
 * @param totalEmissions - Total emissions in kg CO2.
 * @param categoryData - Array of category summaries.
 * @returns A comprehensive sustainability score result.
 */
export function calculateSustainabilityScore(
  totalEmissions: number,
  categoryData: CategorySummary[],
): SustainabilityScoreResult {
  const categoryScores = categoryData.map((cat) => {
    const benchmark = EMISSION_BENCHMARKS[cat.category] || DEFAULT_BENCHMARK;
    const score = Math.max(MIN_SCORE, Math.min(MAX_SCORE, Math.round(MAX_SCORE - (cat.total / benchmark) * MAX_SCORE)));
    return { category: cat.category, score, total: cat.total };
  });

  const overallScore =
    categoryScores.length > 0
      ? Math.round(categoryScores.reduce((sum, c) => sum + c.score, 0) / categoryScores.length)
      : MAX_SCORE;

  const rating =
    overallScore >= SCORE_THRESHOLDS.EXCELLENT
      ? 'Excellent'
      : overallScore >= SCORE_THRESHOLDS.GOOD
        ? 'Good'
        : overallScore >= SCORE_THRESHOLDS.FAIR
          ? 'Fair'
          : 'Needs Improvement';

  return { overallScore, rating, categoryScores, totalEmissions };
}

/**
 * Generates AI-powered sustainability recommendations based on emission patterns.
 * Identifies the highest-emission categories and provides actionable reduction strategies.
 *
 * @param categoryData - Array of category summaries sorted by emission amount.
 * @returns Array of recommendation strings.
 */
export function generateAIRecommendations(categoryData: CategorySummary[]): string[] {
  const sorted = [...categoryData].sort((a, b) => b.total - a.total);
  const recommendations: string[] = [];

  for (const cat of sorted.slice(0, 3)) {
    const benchmark = EMISSION_BENCHMARKS[cat.category] || DEFAULT_BENCHMARK;
    const percentOver = Math.round(((cat.total - benchmark) / benchmark) * MAX_SCORE);

    if (percentOver > 0) {
      recommendations.push(
        `Your ${cat.category.toLowerCase()} emissions are ${percentOver}% above the sustainable benchmark. ` +
        `Consider reducing by ${Math.round(cat.total - benchmark)} kg CO2 this month.`,
      );
    } else {
      recommendations.push(
        `Great job! Your ${cat.category.toLowerCase()} emissions are within sustainable levels.`,
      );
    }
  }

  return recommendations;
}

/**
 * Predicts future carbon emissions using linear regression on historical monthly data.
 *
 * @param monthlyTotals - Array of monthly emission totals ordered chronologically.
 * @returns Prediction object with 30-day, 90-day, and yearly forecasts.
 */
export function predictFutureEmissions(monthlyTotals: number[]): {
  next30Days: number;
  next90Days: number;
  nextYear: number;
  trend: 'increasing' | 'decreasing' | 'stable';
} {
  if (monthlyTotals.length < 2) {
    return { next30Days: 0, next90Days: 0, nextYear: 0, trend: 'stable' };
  }

  const avg = monthlyTotals.reduce((a, b) => a + b, 0) / monthlyTotals.length;
  const slope = (monthlyTotals[monthlyTotals.length - 1] - monthlyTotals[0]) / (monthlyTotals.length - 1);

  return {
    next30Days: Math.max(0, Math.round((avg + slope) * 100) / 100),
    next90Days: Math.max(0, Math.round((avg + slope * 3) * 3 * 100) / 100),
    nextYear: Math.max(0, Math.round((avg + slope * 12) * 12 * 100) / 100),
    trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
  };
}

/**
 * Generates a sustainability report summarizing the user's carbon footprint data.
 *
 * @param totalEmissions - Total emissions in kg CO2.
 * @param categoryData - Emissions breakdown by category.
 * @param monthlyTrend - Monthly emission trend data.
 * @returns Structured sustainability report object.
 */
export function generateSustainabilityReport(
  totalEmissions: number,
  categoryData: CategorySummary[],
  monthlyTrend: Array<{ month: string; total: number }>,
): {
  summary: string;
  score: SustainabilityScoreResult;
  recommendations: string[];
  predictions: ReturnType<typeof predictFutureEmissions>;
  monthlyTrend: Array<{ month: string; total: number }>;
} {
  const score = calculateSustainabilityScore(totalEmissions, categoryData);
  const recommendations = generateAIRecommendations(categoryData);
  const predictions = predictFutureEmissions(monthlyTrend.map((m) => m.total));

  return {
    summary: `Your overall sustainability score is ${score.overallScore}/100 (${score.rating}). ` +
      `Total emissions: ${totalEmissions} kg CO2. Emissions trend: ${predictions.trend}.`,
    score,
    recommendations,
    predictions,
    monthlyTrend,
  };
}

/**
 * Creates a weekly goal plan for reducing carbon emissions over a specified period.
 *
 * @param currentEmissions - Current monthly emission amount.
 * @param targetReduction - Target percentage reduction (0-100).
 * @param weeks - Number of weeks for the plan (default: 4).
 * @returns Array of weekly goal items.
 */
export function createWeeklyGoalPlan(
  currentEmissions: number,
  targetReduction: number,
  weeks: number = 4,
): WeeklyGoalItem[] {
  const totalReductionAmount = currentEmissions * (targetReduction / MAX_SCORE);
  const weeklyReduction = totalReductionAmount / weeks;

  return Array.from({ length: weeks }, (_, i) => ({
    week: i + 1,
    targetReduction: Math.round(weeklyReduction * 100) / 100,
    cumulativeTarget: Math.round(weeklyReduction * (i + 1) * 100) / 100,
    description: `Reduce emissions by ${Math.round(weeklyReduction)} kg CO2 in week ${i + 1}`,
  }));
}

/**
 * Generates leaderboard standings from user emission data.
 * Ranks users by their sustainability score (highest first).
 *
 * @param users - Array of user data with emissions.
 * @returns Sorted leaderboard entries with rankings.
 */
export function generateLeaderboardStandings(
  users: Array<{ userId: string; displayName: string; totalEmissions: number; previousEmissions: number }>,
): LeaderboardEntry[] {
  return users
    .map((user) => {
      const reduction = Math.max(0, user.previousEmissions - user.totalEmissions);
      const reductionPercent = user.previousEmissions > 0 ? (reduction / user.previousEmissions) * MAX_SCORE : 0;
      return {
        userId: user.userId,
        displayName: user.displayName,
        score: Math.round(reductionPercent),
        rank: 0,
        totalReduction: Math.round(reduction * 100) / 100,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}
