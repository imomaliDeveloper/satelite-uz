import prisma from '../config/db.js';
import { hashPassword, comparePassword, signToken } from '../utils/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
        error: 'EMAIL_ALREADY_EXISTS'
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'STUDENT',
        isActive: true,
        lastLoginAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true
      }
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        error: 'INVALID_CREDENTIALS'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact an administrator.',
        error: 'ACCOUNT_DEACTIVATED'
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLoginAt: new Date()
    };

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    // req.user is attached by requireAuth middleware
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name ? { name } : {}),
        ...(avatar !== undefined ? { avatar } : {})
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        lastLoginAt: true
      }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user: updated }
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.',
        error: 'INVALID_CURRENT_PASSWORD'
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    next(error);
  }
};
