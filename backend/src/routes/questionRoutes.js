import express from 'express';
import {
  listQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  togglePublishQuestion,
  bulkUpdateQuestions
} from '../controllers/questionController.js';
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { uploadQuestionImage } from '../middleware/upload.js';

const router = express.Router();

router.get('/', optionalAuth, listQuestions);
router.patch('/bulk', requireAuth, requireAdmin, bulkUpdateQuestions);
router.post('/bulk', requireAuth, requireAdmin, bulkUpdateQuestions);
router.get('/:id', optionalAuth, getQuestionById);

// Admin-only endpoints
router.post(
  '/',
  requireAuth,
  requireAdmin,
  uploadQuestionImage.single('image'),
  createQuestion
);

router.patch(
  '/:id',
  requireAuth,
  requireAdmin,
  uploadQuestionImage.single('image'),
  updateQuestion
);

router.delete('/:id', requireAuth, requireAdmin, deleteQuestion);
router.patch('/:id/publish', requireAuth, requireAdmin, togglePublishQuestion);

export default router;
