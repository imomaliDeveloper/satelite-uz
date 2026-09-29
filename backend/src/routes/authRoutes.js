import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  changePassword
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  validate,
  registerSchema,
  loginSchema,
  changePasswordSchema
} from '../validators/index.js';

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', requireAuth, getMe);
router.post('/logout', logout);
router.patch('/profile', requireAuth, updateProfile);
router.post('/change-password', requireAuth, validate(changePasswordSchema), changePassword);

export default router;
