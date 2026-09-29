import prisma from '../config/db.js';

export const listUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search?.trim();
    const role = req.query.role;
    const status = req.query.status;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ];
    }
    if (role) {
      where.role = role;
    }
    if (status !== undefined && status !== '') {
      where.isActive = status === 'active' || status === 'true';
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          isActive: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              practiceSessions: true,
              bookmarks: true
            }
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            practiceSessions: true,
            bookmarks: true,
            userAnswers: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        error: 'USER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, isActive, name } = req.body;

    const userToUpdate = await prisma.user.findUnique({
      where: { id }
    });

    if (!userToUpdate) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        error: 'USER_NOT_FOUND'
      });
    }

    // Safety rule: Never allow demoting or deactivating the last active administrator
    if (userToUpdate.role === 'ADMIN' && (role === 'STUDENT' || isActive === false)) {
      const activeAdminCount = await prisma.user.count({
        where: { role: 'ADMIN', isActive: true }
      });

      if (activeAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Operation denied. Cannot demote or deactivate the last remaining administrator account.',
          error: 'CANNOT_REMOVE_LAST_ADMIN'
        });
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(role !== undefined ? { role } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
        ...(name !== undefined ? { name } : {})
      },
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

    res.json({
      success: true,
      message: 'User updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const targetUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        error: 'USER_NOT_FOUND'
      });
    }

    if (targetUser.role === 'ADMIN') {
      const activeAdminCount = await prisma.user.count({
        where: { role: 'ADMIN', isActive: true }
      });
      if (activeAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last remaining administrator account.',
          error: 'CANNOT_DELETE_LAST_ADMIN'
        });
      }
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'User deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
