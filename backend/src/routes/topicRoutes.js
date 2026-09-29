import express from 'express';
import {
  listTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic
} from '../controllers/topicController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate, topicSchema } from '../validators/index.js';

const router = express.Router();

router.get('/', listTopics);
router.get('/:id', getTopicById);

// Admin-only endpoints
router.post('/', requireAuth, requireAdmin, validate(topicSchema), createTopic);
router.patch('/:id', requireAuth, requireAdmin, updateTopic);
router.delete('/:id', requireAuth, requireAdmin, deleteTopic);

export default router;
