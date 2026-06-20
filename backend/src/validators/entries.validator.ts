import { z } from 'zod';

export const createEntrySchema = z.object({
  category: z.enum(['TRAVEL', 'ELECTRICITY', 'FOOD', 'SHOPPING', 'WATER', 'WASTE', 'OTHER']),
  amount: z.number().positive('Amount must be a positive number'),
  description: z.string().max(500).optional(),
  date: z.string().datetime().optional(),
});

export const updateEntrySchema = createEntrySchema.partial();

export const queryEntriesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  category: z
    .enum(['TRAVEL', 'ELECTRICITY', 'FOOD', 'SHOPPING', 'WATER', 'WASTE', 'OTHER'])
    .optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sortBy: z.enum(['date', 'amount', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const createGoalSchema = z.object({
  title: z.string().min(1).max(200),
  targetAmount: z.number().positive(),
  deadline: z.string().datetime(),
});

export const updateGoalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  currentAmount: z.number().min(0).optional(),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'FAILED']).optional(),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;
export type QueryEntriesInput = z.infer<typeof queryEntriesSchema>;
export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
