import express from 'express';
import {
  getBookmarks,
  addBookmark,
  removeBookmark
} from '../controllers/bookmarkController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getBookmarks);
router.post('/', addBookmark);
router.delete('/:id', removeBookmark);

export default router;
