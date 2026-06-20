import { Router } from 'express';
import authRouter from './auth.routes';
import entriesRouter from './entries.routes';
import goalsRouter from './goals.routes';
import aiRouter from './ai.routes';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: V1 API health check
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: 'v1' });
});

router.use('/auth', authRouter);
router.use('/entries', entriesRouter);
router.use('/goals', goalsRouter);
router.use('/ai', aiRouter);

export default router;
