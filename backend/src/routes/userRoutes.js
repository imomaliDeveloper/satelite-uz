import express from 'express';
import {
  listUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get('/', listUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
