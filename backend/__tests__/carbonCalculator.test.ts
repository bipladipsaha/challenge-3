/**
 * @module carbonCalculator.test
 * @description Comprehensive unit tests for all domain-specific carbon calculation utilities.
 * Validates business logic, edge cases, boundary conditions, and mathematical correctness
 * for sustainability scoring, emission predictions, goal planning, and leaderboard generation.
 */

import {
  calculateCarbonFootprint,
  calculateSustainabilityScore,
  generateAIRecommendations,
  predictFutureEmissions,
  generateSustainabilityReport,
  createWeeklyGoalPlan,
  generateLeaderboardStandings,
} from '../src/utils/carbonCalculator';

// ─── calculateCarbonFootprint ────────────────────────────────────────────────

describe('calculateCarbonFootprint', () => {
  it('should return 0 for an empty entries array', () => {
    expect(calculateCarbonFootprint([])).toBe(0);
  });

  it('should sum a single entry correctly', () => {
    const entries = [{ category: 'TRAVEL', amount: 42.5, date: '2024-01-15' }];
    expect(calculateCarbonFootprint(entries)).toBe(42.5);
  });

  it('should sum multiple entries across categories', () => {
    const entries = [
      { category: 'TRAVEL', amount: 50, date: '2024-01-01' },
      { category: 'ELECTRICITY', amount: 30, date: '2024-01-02' },
      { category: 'FOOD', amount: 20, date: '2024-01-03' },
    ];
    expect(calculateCarbonFootprint(entries)).toBe(100);
  });

  it('should handle entries with zero amount', () => {
    const entries = [
      { category: 'TRAVEL', amount: 0, date: '2024-01-01' },
      { category: 'FOOD', amount: 50, date: '2024-01-02' },
    ];
    expect(calculateCarbonFootprint(entries)).toBe(50);
  });

  it('should handle very large emission values without overflow', () => {
    const entries = [
      { category: 'TRAVEL', amount: 999999.99, date: '2024-01-01' },
      { category: 'ELECTRICITY', amount: 0.01, date: '2024-01-02' },
    ];
    expect(calculateCarbonFootprint(entries)).toBe(1000000);
  });

  it('should handle decimal precision correctly', () => {
    const entries = [
      { category: 'FOOD', amount: 0.1, date: '2024-01-01' },
      { category: 'FOOD', amount: 0.2, date: '2024-01-02' },
    ];
    expect(calculateCarbonFootprint(entries)).toBeCloseTo(0.3, 10);
  });
});

// ─── calculateSustainabilityScore ────────────────────────────────────────────

describe('calculateSustainabilityScore', () => {
  it('should return a perfect score of 100 when there are no emissions', () => {
    const result = calculateSustainabilityScore(0, []);
    expect(result.overallScore).toBe(100);
    expect(result.rating).toBe('Excellent');
  });

  it('should score categories against their benchmarks', () => {
    const categoryData = [
      { category: 'TRAVEL', total: 100, count: 5 },    // benchmark 200 → score 50
      { category: 'ELECTRICITY', total: 75, count: 3 }, // benchmark 150 → score 50
    ];
    const result = calculateSustainabilityScore(175, categoryData);
    expect(result.overallScore).toBe(50);
    expect(result.rating).toBe('Fair');
  });

  it('should clamp scores to 0 when emissions exceed benchmark by a large margin', () => {
    const categoryData = [
      { category: 'FOOD', total: 500, count: 10 }, // benchmark 100 → raw score = -400 → clamped to 0
    ];
    const result = calculateSustainabilityScore(500, categoryData);
    expect(result.categoryScores[0].score).toBe(0);
    expect(result.overallScore).toBe(0);
    expect(result.rating).toBe('Needs Improvement');
  });

  it('should return score of 100 when emissions are zero for a known category', () => {
    const categoryData = [{ category: 'TRAVEL', total: 0, count: 0 }];
    const result = calculateSustainabilityScore(0, categoryData);
    expect(result.categoryScores[0].score).toBe(100);
    expect(result.rating).toBe('Excellent');
  });

  it('should use the default benchmark for unknown categories', () => {
    const categoryData = [{ category: 'UNKNOWN_CATEGORY', total: 50, count: 2 }];
    // default benchmark = 100 → score = 100 - (50/100)*100 = 50
    const result = calculateSustainabilityScore(50, categoryData);
    expect(result.categoryScores[0].score).toBe(50);
  });

  it('should correctly rate scores across all thresholds', () => {
    // Excellent: >= 80
    expect(calculateSustainabilityScore(0, [{ category: 'TRAVEL', total: 20, count: 1 }]).rating).toBe('Excellent');
    // Good: >= 60
    expect(calculateSustainabilityScore(0, [{ category: 'TRAVEL', total: 80, count: 1 }]).rating).toBe('Good');
    // Fair: >= 40
    expect(calculateSustainabilityScore(0, [{ category: 'TRAVEL', total: 120, count: 1 }]).rating).toBe('Fair');
    // Needs Improvement: < 40
    expect(calculateSustainabilityScore(0, [{ category: 'TRAVEL', total: 200, count: 1 }]).rating).toBe('Needs Improvement');
  });
});

// ─── generateAIRecommendations ───────────────────────────────────────────────

describe('generateAIRecommendations', () => {
  it('should return recommendations for the top 3 categories', () => {
    const categoryData = [
      { category: 'TRAVEL', total: 300, count: 10 },
      { category: 'ELECTRICITY', total: 200, count: 8 },
      { category: 'FOOD', total: 150, count: 7 },
      { category: 'SHOPPING', total: 50, count: 3 },
    ];
    const recommendations = generateAIRecommendations(categoryData);
    expect(recommendations).toHaveLength(3);
  });

  it('should produce a positive recommendation for within-benchmark emissions', () => {
    const categoryData = [{ category: 'WATER', total: 10, count: 2 }]; // benchmark 30
    const recommendations = generateAIRecommendations(categoryData);
    expect(recommendations[0]).toContain('Great job');
  });

  it('should produce a reduction recommendation for above-benchmark emissions', () => {
    const categoryData = [{ category: 'TRAVEL', total: 400, count: 10 }]; // benchmark 200
    const recommendations = generateAIRecommendations(categoryData);
    expect(recommendations[0]).toContain('above the sustainable benchmark');
    expect(recommendations[0]).toContain('Consider reducing');
  });

  it('should handle an empty array', () => {
    const recommendations = generateAIRecommendations([]);
    expect(recommendations).toHaveLength(0);
  });

  it('should sort categories by total emissions descending before recommending', () => {
    const categoryData = [
      { category: 'WATER', total: 10, count: 1 },
      { category: 'TRAVEL', total: 500, count: 5 },
    ];
    const recommendations = generateAIRecommendations(categoryData);
    // First recommendation should be about TRAVEL (highest emissions)
    expect(recommendations[0]).toContain('travel');
  });
});

// ─── predictFutureEmissions ──────────────────────────────────────────────────

describe('predictFutureEmissions', () => {
  it('should return zeroed predictions when fewer than 2 data points', () => {
    const result = predictFutureEmissions([100]);
    expect(result.next30Days).toBe(0);
    expect(result.next90Days).toBe(0);
    expect(result.nextYear).toBe(0);
    expect(result.trend).toBe('stable');
  });

  it('should return stable trend when values are flat', () => {
    const result = predictFutureEmissions([100, 100, 100, 100]);
    expect(result.trend).toBe('stable');
    expect(result.next30Days).toBe(100);
  });

  it('should detect increasing trend', () => {
    const result = predictFutureEmissions([50, 100, 150, 200]);
    expect(result.trend).toBe('increasing');
    expect(result.next30Days).toBeGreaterThan(0);
  });

  it('should detect decreasing trend', () => {
    const result = predictFutureEmissions([200, 150, 100, 50]);
    expect(result.trend).toBe('decreasing');
  });

  it('should never return negative predictions', () => {
    const result = predictFutureEmissions([100, 10]);
    expect(result.next30Days).toBeGreaterThanOrEqual(0);
    expect(result.next90Days).toBeGreaterThanOrEqual(0);
    expect(result.nextYear).toBeGreaterThanOrEqual(0);
  });

  it('should handle two data points (minimum)', () => {
    const result = predictFutureEmissions([100, 200]);
    expect(result.trend).toBe('increasing');
    expect(result.next30Days).toBeGreaterThan(0);
  });
});

// ─── generateSustainabilityReport ────────────────────────────────────────────

describe('generateSustainabilityReport', () => {
  it('should produce a complete report with all required fields', () => {
    const report = generateSustainabilityReport(
      150,
      [{ category: 'TRAVEL', total: 100, count: 5 }, { category: 'FOOD', total: 50, count: 3 }],
      [{ month: '2024-01', total: 70 }, { month: '2024-02', total: 80 }],
    );

    expect(report.summary).toContain('sustainability score');
    expect(report.score).toBeDefined();
    expect(report.score.overallScore).toBeGreaterThanOrEqual(0);
    expect(report.recommendations).toBeInstanceOf(Array);
    expect(report.predictions).toBeDefined();
    expect(report.monthlyTrend).toHaveLength(2);
  });

  it('should produce a valid report even with empty data', () => {
    const report = generateSustainabilityReport(0, [], []);
    expect(report.score.overallScore).toBe(100);
    expect(report.recommendations).toHaveLength(0);
    expect(report.predictions.trend).toBe('stable');
  });
});

// ─── createWeeklyGoalPlan ────────────────────────────────────────────────────

describe('createWeeklyGoalPlan', () => {
  it('should generate 4 weekly goals by default', () => {
    const plan = createWeeklyGoalPlan(200, 20);
    expect(plan).toHaveLength(4);
  });

  it('should generate the correct number of weeks', () => {
    const plan = createWeeklyGoalPlan(100, 50, 8);
    expect(plan).toHaveLength(8);
  });

  it('should increment cumulative targets correctly', () => {
    const plan = createWeeklyGoalPlan(400, 50, 4);
    // Total reduction = 400 * 0.5 = 200 → 50 per week
    expect(plan[0].cumulativeTarget).toBe(50);
    expect(plan[1].cumulativeTarget).toBe(100);
    expect(plan[2].cumulativeTarget).toBe(150);
    expect(plan[3].cumulativeTarget).toBe(200);
  });

  it('should produce a meaningful description for each week', () => {
    const plan = createWeeklyGoalPlan(100, 10);
    plan.forEach((item, index) => {
      expect(item.week).toBe(index + 1);
      expect(item.description).toContain(`week ${index + 1}`);
    });
  });

  it('should handle 0% target reduction', () => {
    const plan = createWeeklyGoalPlan(200, 0);
    plan.forEach((item) => {
      expect(item.targetReduction).toBe(0);
      expect(item.cumulativeTarget).toBe(0);
    });
  });

  it('should handle 100% target reduction', () => {
    const plan = createWeeklyGoalPlan(200, 100, 4);
    // 200 * 1.0 = 200 → 50 per week
    expect(plan[3].cumulativeTarget).toBe(200);
  });
});

// ─── generateLeaderboardStandings ────────────────────────────────────────────

describe('generateLeaderboardStandings', () => {
  it('should rank users by reduction percentage (highest first)', () => {
    const users = [
      { userId: 'u1', displayName: 'Alice', totalEmissions: 100, previousEmissions: 200 }, // 50% reduction
      { userId: 'u2', displayName: 'Bob', totalEmissions: 50, previousEmissions: 200 },    // 75% reduction
      { userId: 'u3', displayName: 'Carol', totalEmissions: 150, previousEmissions: 200 },  // 25% reduction
    ];

    const standings = generateLeaderboardStandings(users);
    expect(standings[0].displayName).toBe('Bob');
    expect(standings[0].rank).toBe(1);
    expect(standings[0].score).toBe(75);

    expect(standings[1].displayName).toBe('Alice');
    expect(standings[1].rank).toBe(2);

    expect(standings[2].displayName).toBe('Carol');
    expect(standings[2].rank).toBe(3);
  });

  it('should handle users with no previous emissions gracefully', () => {
    const users = [
      { userId: 'u1', displayName: 'NewUser', totalEmissions: 50, previousEmissions: 0 },
    ];
    const standings = generateLeaderboardStandings(users);
    expect(standings[0].score).toBe(0);
    expect(standings[0].totalReduction).toBe(0);
  });

  it('should return an empty array for no users', () => {
    expect(generateLeaderboardStandings([])).toHaveLength(0);
  });

  it('should never produce negative reduction values', () => {
    const users = [
      { userId: 'u1', displayName: 'Worse', totalEmissions: 300, previousEmissions: 100 }, // increased
    ];
    const standings = generateLeaderboardStandings(users);
    expect(standings[0].totalReduction).toBe(0);
    expect(standings[0].score).toBe(0);
  });
});
