import { Router } from 'express';
import * as entriesController from '../../controllers/entries.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import { createEntrySchema, updateEntrySchema } from '../../validators/entries.validator';

const router = Router();

router.use(authenticate);

router.post('/', validate(createEntrySchema), entriesController.createEntry);
router.get('/', entriesController.getEntries);
router.get('/summary', entriesController.getSummary);
router.get('/:id', entriesController.getEntryById);
router.patch('/:id', validate(updateEntrySchema), entriesController.updateEntry);
router.delete('/:id', entriesController.deleteEntry);

export default router;
