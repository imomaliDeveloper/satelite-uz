import express from 'express';
import {
  listExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam
} from '../controllers/examController.js';
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { validate, examSchema } from '../validators/index.js';

const router = express.Router();

router.get('/', optionalAuth, listExams);
router.get('/:id', optionalAuth, getExamById);

// Admin-only endpoints
router.post('/', requireAuth, requireAdmin, validate(examSchema), createExam);
router.patch('/:id', requireAuth, requireAdmin, updateExam);
router.delete('/:id', requireAuth, requireAdmin, deleteExam);

export default router;
