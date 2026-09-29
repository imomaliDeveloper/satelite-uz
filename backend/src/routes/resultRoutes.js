import express from 'express';
import { getPracticeHistory, getSessionResult, getUserTelemetry } from '../controllers/practiceController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/telemetry', getUserTelemetry);
router.get('/', getPracticeHistory);
router.get('/:id', getSessionResult);

export default router;
