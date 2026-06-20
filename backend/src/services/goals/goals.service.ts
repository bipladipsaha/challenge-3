import prisma from '../../config/database';
import { AppError } from '../../middlewares/errorHandler';
import { CreateGoalInput, UpdateGoalInput } from '../../validators/entries.validator';

export const createGoal = async (userId: string, data: CreateGoalInput) => {
  const goal = await prisma.goal.create({
    data: {
      userId,
      title: data.title,
      targetAmount: data.targetAmount,
      deadline: new Date(data.deadline),
    },
  });
  return goal;
};

export const getGoals = async (userId: string) => {
  return prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getGoalById = async (userId: string, goalId: string) => {
  const goal = await prisma.goal.findUnique({ where: { id: goalId } });
  if (!goal || goal.userId !== userId) {
    throw new AppError('Goal not found.', 404);
  }
  return goal;
};

export const updateGoal = async (
  userId: string,
  goalId: string,
  data: UpdateGoalInput,
) => {
  const existing = await prisma.goal.findUnique({ where: { id: goalId } });
  if (!existing || existing.userId !== userId) {
    throw new AppError('Goal not found.', 404);
  }

  return prisma.goal.update({
    where: { id: goalId },
    data,
  });
};

export const deleteGoal = async (userId: string, goalId: string) => {
  const existing = await prisma.goal.findUnique({ where: { id: goalId } });
  if (!existing || existing.userId !== userId) {
    throw new AppError('Goal not found.', 404);
  }
  await prisma.goal.delete({ where: { id: goalId } });
};
