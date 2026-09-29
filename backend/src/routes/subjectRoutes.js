import express from 'express';
import {
  listSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} from '../controllers/subjectController.js';
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { validate, subjectSchema } from '../validators/index.js';

const router = express.Router();

router.get('/', optionalAuth, listSubjects);
router.get('/:id', optionalAuth, getSubjectById);

// Admin-only endpoints
router.post('/', requireAuth, requireAdmin, validate(subjectSchema), createSubject);
router.patch('/:id', requireAuth, requireAdmin, updateSubject);
router.delete('/:id', requireAuth, requireAdmin, deleteSubject);

export default router;
