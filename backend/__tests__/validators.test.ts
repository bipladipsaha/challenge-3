/**
 * @module validators.test
 * @description Tests for Zod schema validators for auth and carbon entry inputs.
 * Validates business rules for password strength, email format, emission categories,
 * pagination boundaries, and date handling.
 */

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../src/validators/auth.validator';

import {
  createEntrySchema,
  updateEntrySchema,
  queryEntriesSchema,
  createGoalSchema,
  updateGoalSchema,
} from '../src/validators/entries.validator';

// ─── Auth Validators ─────────────────────────────────────────────────────────

describe('registerSchema', () => {
  const validInput = {
    email: 'user@example.com',
    password: 'StrongP@ss1',
    firstName: 'John',
    lastName: 'Doe',
  };

  it('should accept valid registration data', () => {
    const result = registerSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('should reject an invalid email address', () => {
    const result = registerSchema.safeParse({ ...validInput, email: 'not-email' });
    expect(result.success).toBe(false);
  });

  it('should reject a password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({ ...validInput, password: 'Sh@1' });
    expect(result.success).toBe(false);
  });

  it('should reject a password without uppercase letter', () => {
    const result = registerSchema.safeParse({ ...validInput, password: 'nouppercase@1' });
    expect(result.success).toBe(false);
  });

  it('should reject a password without special character', () => {
    const result = registerSchema.safeParse({ ...validInput, password: 'NoSpecial1' });
    expect(result.success).toBe(false);
  });

  it('should reject a password without a number', () => {
    const result = registerSchema.safeParse({ ...validInput, password: 'NoNumber@abc' });
    expect(result.success).toBe(false);
  });

  it('should reject an empty firstName', () => {
    const result = registerSchema.safeParse({ ...validInput, firstName: '' });
    expect(result.success).toBe(false);
  });

  it('should reject a lastName exceeding 50 characters', () => {
    const result = registerSchema.safeParse({ ...validInput, lastName: 'A'.repeat(51) });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('should accept valid login credentials', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: 'anything' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({ email: 'bad', password: 'anything' });
    expect(result.success).toBe(false);
  });

  it('should reject empty password', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('refreshTokenSchema', () => {
  it('should accept with refreshToken', () => {
    const result = refreshTokenSchema.safeParse({ refreshToken: 'some-token' });
    expect(result.success).toBe(true);
  });

  it('should accept without refreshToken (optional)', () => {
    const result = refreshTokenSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

// ─── Entry Validators ────────────────────────────────────────────────────────

describe('createEntrySchema', () => {
  const validEntry = {
    category: 'TRAVEL',
    amount: 25.5,
  };

  it('should accept a valid entry with category and amount', () => {
    const result = createEntrySchema.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  it('should accept a valid entry with optional description and date', () => {
    const result = createEntrySchema.safeParse({
      ...validEntry,
      description: 'Commute to work',
      date: '2024-01-15T10:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('should reject an invalid category', () => {
    const result = createEntrySchema.safeParse({ ...validEntry, category: 'INVALID' });
    expect(result.success).toBe(false);
  });

  it('should reject a negative amount', () => {
    const result = createEntrySchema.safeParse({ ...validEntry, amount: -10 });
    expect(result.success).toBe(false);
  });

  it('should reject amount of zero', () => {
    const result = createEntrySchema.safeParse({ ...validEntry, amount: 0 });
    expect(result.success).toBe(false);
  });

  it('should accept all valid emission categories', () => {
    const categories = ['TRAVEL', 'ELECTRICITY', 'FOOD', 'SHOPPING', 'WATER', 'WASTE', 'OTHER'];
    categories.forEach((category) => {
      const result = createEntrySchema.safeParse({ category, amount: 10 });
      expect(result.success).toBe(true);
    });
  });

  it('should reject a description longer than 500 characters', () => {
    const result = createEntrySchema.safeParse({
      ...validEntry,
      description: 'A'.repeat(501),
    });
    expect(result.success).toBe(false);
  });
});

describe('updateEntrySchema', () => {
  it('should accept partial updates', () => {
    expect(updateEntrySchema.safeParse({ amount: 50 }).success).toBe(true);
    expect(updateEntrySchema.safeParse({ category: 'FOOD' }).success).toBe(true);
    expect(updateEntrySchema.safeParse({}).success).toBe(true);
  });

  it('should still validate provided fields', () => {
    expect(updateEntrySchema.safeParse({ amount: -5 }).success).toBe(false);
  });
});

describe('queryEntriesSchema', () => {
  it('should apply default values for page and limit', () => {
    const result = queryEntriesSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.sortBy).toBe('date');
    expect(result.sortOrder).toBe('desc');
  });

  it('should reject a limit exceeding 100', () => {
    const result = queryEntriesSchema.safeParse({ limit: 200 });
    expect(result.success).toBe(false);
  });

  it('should coerce string page numbers to integers', () => {
    const result = queryEntriesSchema.parse({ page: '3' });
    expect(result.page).toBe(3);
  });
});

// ─── Goal Validators ─────────────────────────────────────────────────────────

describe('createGoalSchema', () => {
  it('should accept valid goal data', () => {
    const result = createGoalSchema.safeParse({
      title: 'Reduce commute emissions',
      targetAmount: 50,
      deadline: '2024-12-31T23:59:59.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty title', () => {
    const result = createGoalSchema.safeParse({
      title: '',
      targetAmount: 50,
      deadline: '2024-12-31T23:59:59.000Z',
    });
    expect(result.success).toBe(false);
  });

  it('should reject negative targetAmount', () => {
    const result = createGoalSchema.safeParse({
      title: 'Goal',
      targetAmount: -10,
      deadline: '2024-12-31T23:59:59.000Z',
    });
    expect(result.success).toBe(false);
  });
});

describe('updateGoalSchema', () => {
  it('should accept valid status transitions', () => {
    expect(updateGoalSchema.safeParse({ status: 'COMPLETED' }).success).toBe(true);
    expect(updateGoalSchema.safeParse({ status: 'IN_PROGRESS' }).success).toBe(true);
    expect(updateGoalSchema.safeParse({ status: 'FAILED' }).success).toBe(true);
  });

  it('should reject invalid status values', () => {
    expect(updateGoalSchema.safeParse({ status: 'PENDING' }).success).toBe(false);
  });

  it('should reject negative currentAmount', () => {
    expect(updateGoalSchema.safeParse({ currentAmount: -5 }).success).toBe(false);
  });
});
