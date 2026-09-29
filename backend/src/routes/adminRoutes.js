import express from 'express';
import { getAdminStats, getAdminAnalytics, seedQuestionsHandler } from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/analytics', getAdminAnalytics);
router.get('/activity', getAdminStats); // also returns recent activity
router.post('/seed-questions', seedQuestionsHandler);

export default router;
