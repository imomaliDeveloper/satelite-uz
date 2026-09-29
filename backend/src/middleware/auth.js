import prisma from '../config/db.js';
import { verifyToken } from '../utils/jwt.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
        error: 'AUTH_REQUIRED'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please log in again.',
        error: 'TOKEN_INVALID'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists.',
        error: 'USER_NOT_FOUND'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact support.',
        error: 'ACCOUNT_DEACTIVATED'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges required.',
      error: 'FORBIDDEN_ADMIN_ONLY'
    });
  }
  next();
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = verifyToken(token);
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true
          }
        });
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (e) {
        // Ignore invalid optional token
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
