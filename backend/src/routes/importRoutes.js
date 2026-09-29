import express from 'express';
import { getCsvTemplate, importQuestions } from '../controllers/importController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/csv-template', getCsvTemplate);
router.post('/questions', requireAuth, requireAdmin, importQuestions);

export default router;
