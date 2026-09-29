import express from 'express';
import {
  startPracticeSession,
  submitPracticeAnswer,
  completePracticeSession,
  startExamSession,
  submitExamSession,
  getPracticeHistory,
  getSessionResult
} from '../controllers/practiceController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.post('/start', startPracticeSession);
router.post('/:id/answer', submitPracticeAnswer);
router.post('/:id/complete', completePracticeSession);

router.post('/exam/start', startExamSession);
router.post('/exam/:id/submit', submitExamSession);

router.get('/history', getPracticeHistory);
router.get('/:id/result', getSessionResult);

export default router;
