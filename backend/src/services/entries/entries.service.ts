/**
 * @module entriesService
 * @description Service layer for carbon emission entries.
 * Handles CRUD operations, paginated queries, aggregation summaries,
 * and Redis cache invalidation. Follows the Repository Pattern via Prisma.
 */

import prisma from '../../config/database';
import { NotFoundError } from '../../errors/AppError';
import {
  CreateEntryInput,
  UpdateEntryInput,
  QueryEntriesInput,
} from '../../validators/entries.validator';
import { EmissionCategory, Prisma } from '@prisma/client';
import { redisClient } from '../../config/redis';
import { CACHE_CONFIG, TREND_MONTHS } from '../../constants';

/**
 * Creates a new carbon entry.
 */
export const createEntry = async (userId: string, data: CreateEntryInput) => {
  const entry = await prisma.carbonEntry.create({
    data: {
      userId,
      category: data.category as EmissionCategory,
      amount: data.amount,
      description: data.description,
      date: data.date ? new Date(data.date) : new Date(),
    },
  });

  if (redisClient.isOpen) {
    await redisClient.del(`${CACHE_CONFIG.SUMMARY_KEY_PREFIX}${userId}`);
  }

  return entry;
};

/**
 * Gets paginated, filtered, and sorted carbon entries for a user.
 */
export const getEntries = async (userId: string, query: QueryEntriesInput) => {
  const { page, limit, category, startDate, endDate, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.CarbonEntryWhereInput = {
    userId,
    ...(category && { category: category as EmissionCategory }),
    ...(startDate && { date: { gte: new Date(startDate) } }),
    ...(endDate && { date: { ...((startDate && { gte: new Date(startDate) }) || {}), lte: new Date(endDate) } }),
  };

  const [entries, total] = await Promise.all([
    prisma.carbonEntry.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.carbonEntry.count({ where }),
  ]);

  return {
    entries,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Gets a single carbon entry by ID, ensuring user ownership.
 */
export const getEntryById = async (userId: string, entryId: string) => {
  const entry = await prisma.carbonEntry.findUnique({
    where: { id: entryId },
  });

  if (!entry || entry.userId !== userId) {
    throw new NotFoundError('Carbon entry not found.');
  }

  return entry;
};

/**
 * Updates a carbon entry.
 */
export const updateEntry = async (
  userId: string,
  entryId: string,
  data: UpdateEntryInput,
) => {
  const existing = await prisma.carbonEntry.findUnique({
    where: { id: entryId },
  });

  if (!existing || existing.userId !== userId) {
    throw new NotFoundError('Carbon entry not found.');
  }

  const updated = await prisma.carbonEntry.update({
    where: { id: entryId },
    data: {
      ...(data.category && { category: data.category as EmissionCategory }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.date && { date: new Date(data.date) }),
    },
  });

  if (redisClient.isOpen) {
    await redisClient.del(`${CACHE_CONFIG.SUMMARY_KEY_PREFIX}${userId}`);
  }

  return updated;
};

/**
 * Deletes a carbon entry.
 */
export const deleteEntry = async (userId: string, entryId: string) => {
  const existing = await prisma.carbonEntry.findUnique({
    where: { id: entryId },
  });

  if (!existing || existing.userId !== userId) {
    throw new NotFoundError('Carbon entry not found.');
  }

  await prisma.carbonEntry.delete({ where: { id: entryId } });

  if (redisClient.isOpen) {
    await redisClient.del(`${CACHE_CONFIG.SUMMARY_KEY_PREFIX}${userId}`);
  }
};

/**
 * Gets summary statistics for a user's carbon entries.
 */
export const getSummary = async (userId: string) => {
  if (redisClient.isOpen) {
    const cached = await redisClient.get(`${CACHE_CONFIG.SUMMARY_KEY_PREFIX}${userId}`);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const totalEmissions = await prisma.carbonEntry.aggregate({
    where: { userId },
    _sum: { amount: true },
    _avg: { amount: true },
    _count: true,
  });

  const byCategory = await prisma.carbonEntry.groupBy({
    by: ['category'],
    where: { userId },
    _sum: { amount: true },
    _count: true,
  });

  // Monthly trend for the last 12 months
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - TREND_MONTHS);

  const monthlyEntries = await prisma.carbonEntry.findMany({
    where: {
      userId,
      date: { gte: twelveMonthsAgo },
    },
    select: { amount: true, date: true },
    orderBy: { date: 'asc' },
  });

  // Group by month
  const monthlyTrend = monthlyEntries.reduce(
    (acc, entry) => {
      const key = `${entry.date.getFullYear()}-${String(entry.date.getMonth() + 1).padStart(2, '0')}`;
      acc[key] = (acc[key] || 0) + entry.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const result = {
    total: totalEmissions._sum.amount || 0,
    average: totalEmissions._avg.amount || 0,
    count: totalEmissions._count,
    byCategory: byCategory.map((c) => ({
      category: c.category,
      total: c._sum.amount || 0,
      count: c._count,
    })),
    monthlyTrend: Object.entries(monthlyTrend).map(([month, total]) => ({
      month,
      total,
    })),
  };

  if (redisClient.isOpen) {
    await redisClient.set(
      `${CACHE_CONFIG.SUMMARY_KEY_PREFIX}${userId}`,
      JSON.stringify(result),
      { EX: CACHE_CONFIG.SUMMARY_TTL },
    );
  }

  return result;
};
