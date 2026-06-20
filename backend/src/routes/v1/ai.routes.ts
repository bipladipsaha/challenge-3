import { Router } from 'express';
import * as aiController from '../../controllers/ai.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/advice', aiController.getAdvice);
router.get('/habits', aiController.getHabitAnalysis);
router.post('/chat', aiController.chatWithCoach);
router.get('/challenges', aiController.generateChallenges);
router.get('/score', aiController.getSustainabilityScore);
router.get('/predict', aiController.predictEmissions);

export default router;
