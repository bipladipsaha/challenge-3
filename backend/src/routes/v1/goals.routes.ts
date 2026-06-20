import { Router } from 'express';
import * as goalsController from '../../controllers/goals.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import { createGoalSchema, updateGoalSchema } from '../../validators/entries.validator';

const router = Router();

router.use(authenticate);

router.post('/', validate(createGoalSchema), goalsController.createGoal);
router.get('/', goalsController.getGoals);
router.get('/:id', goalsController.getGoalById);
router.patch('/:id', validate(updateGoalSchema), goalsController.updateGoal);
router.delete('/:id', goalsController.deleteGoal);

export default router;
