import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as goalsService from '../services/goals/goals.service';

export const createGoal = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const goal = await goalsService.createGoal(req.userId!, req.body);
    res.status(201).json({ status: 'success', data: goal });
  } catch (error) {
    next(error);
  }
};

export const getGoals = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const goals = await goalsService.getGoals(req.userId!);
    res.status(200).json({ status: 'success', data: goals });
  } catch (error) {
    next(error);
  }
};

export const getGoalById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const goal = await goalsService.getGoalById(req.userId!, req.params.id);
    res.status(200).json({ status: 'success', data: goal });
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const goal = await goalsService.updateGoal(req.userId!, req.params.id, req.body);
    res.status(200).json({ status: 'success', data: goal });
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await goalsService.deleteGoal(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
