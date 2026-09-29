import prisma from '../config/db.js';

export const getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const [total, bookmarks] = await Promise.all([
      prisma.bookmark.count({ where: { userId } }),
      prisma.bookmark.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          question: {
            include: {
              subject: { select: { id: true, name: true } },
              topic: { select: { id: true, name: true } },
              options: {
                select: {
                  id: true,
                  optionLabel: true,
                  optionText: true
                },
                orderBy: { optionLabel: 'asc' }
              }
            }
          }
        }
      })
    ]);

    const formatted = bookmarks.map(b => ({
      bookmarkId: b.id,
      bookmarkedAt: b.createdAt,
      question: {
        ...b.question,
        isBookmarked: true
      }
    }));

    res.json({
      success: true,
      data: formatted,
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

export const addBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { questionId } = req.body;

    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
        error: 'QUESTION_NOT_FOUND'
      });
    }

    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_questionId: { userId, questionId }
      },
      update: {},
      create: { userId, questionId }
    });

    res.status(201).json({
      success: true,
      message: 'Question bookmarked successfully.',
      data: bookmark
    });
  } catch (error) {
    next(error);
  }
};

export const removeBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // Can be bookmark ID or question ID

    await prisma.bookmark.deleteMany({
      where: {
        userId,
        OR: [{ id }, { questionId: id }]
      }
    });

    res.json({
      success: true,
      message: 'Bookmark removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};
