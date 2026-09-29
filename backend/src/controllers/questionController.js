import prisma from '../config/db.js';

export const listQuestions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search?.trim();
    const subjectId = req.query.subjectId;
    const topicId = req.query.topicId;
    const difficulty = req.query.difficulty;
    const questionType = req.query.questionType;
    const sortBy = req.query.sortBy || 'newest';
    const isPublishedFilter = req.query.isPublished;

    const isAdmin = req.user?.role === 'ADMIN';

    const where = {};
    if (!isAdmin) {
      where.isPublished = true;
    } else if (isPublishedFilter !== undefined && isPublishedFilter !== '') {
      where.isPublished = isPublishedFilter === 'true' || isPublishedFilter === true;
    }

    if (search) {
      where.questionText = { contains: search };
    }
    if (subjectId) {
      where.subjectId = subjectId;
    }
    if (topicId) {
      where.topicId = topicId;
    }
    if (difficulty) {
      where.difficulty = difficulty;
    }
    if (questionType) {
      where.questionType = questionType;
    }

    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sortBy === 'difficulty') {
      orderBy = { difficulty: 'asc' };
    }

    const [total, questions] = await Promise.all([
      prisma.question.count({ where }),
      prisma.question.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          subject: { select: { id: true, name: true, slug: true } },
          topic: { select: { id: true, name: true, slug: true } },
          options: {
            select: {
              id: true,
              optionLabel: true,
              optionText: true,
              // Only expose isCorrect to ADMIN
              isCorrect: isAdmin
            },
            orderBy: { optionLabel: 'asc' }
          },
          _count: {
            select: {
              userAnswers: true,
              bookmarks: true
            }
          }
        }
      })
    ]);

    // If student is logged in, attach isBookmarked flag
    let bookmarkedQuestionIds = new Set();
    if (req.user) {
      const userBookmarks = await prisma.bookmark.findMany({
        where: {
          userId: req.user.id,
          questionId: { in: questions.map(q => q.id) }
        },
        select: { questionId: true }
      });
      bookmarkedQuestionIds = new Set(userBookmarks.map(b => b.questionId));
    }

    const sanitizedQuestions = questions.map(q => ({
      ...q,
      isBookmarked: bookmarkedQuestionIds.has(q.id),
      // Hide explanation from students before answering in practice
      explanation: isAdmin ? q.explanation : undefined
    }));

    res.json({
      success: true,
      data: sanitizedQuestions,
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

export const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user?.role === 'ADMIN';

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        subject: { select: { id: true, name: true, slug: true } },
        topic: { select: { id: true, name: true, slug: true } },
        options: {
          select: {
            id: true,
            optionLabel: true,
            optionText: true,
            isCorrect: isAdmin
          },
          orderBy: { optionLabel: 'asc' }
        },
        _count: {
          select: { userAnswers: true, bookmarks: true }
        }
      }
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
        error: 'QUESTION_NOT_FOUND'
      });
    }

    if (!question.isPublished && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'This question is not yet published.',
        error: 'QUESTION_NOT_PUBLISHED'
      });
    }

    let isBookmarked = false;
    if (req.user) {
      const bm = await prisma.bookmark.findUnique({
        where: {
          userId_questionId: {
            userId: req.user.id,
            questionId: id
          }
        }
      });
      isBookmarked = !!bm;
    }

    res.json({
      success: true,
      data: {
        ...question,
        isBookmarked,
        explanation: isAdmin ? question.explanation : undefined
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req, res, next) => {
  try {
    let {
      subjectId,
      topicId,
      questionText,
      questionType,
      difficulty,
      explanation,
      isPublished,
      calculatorAllowed,
      referenceSheetAllowed,
      options
    } = req.body;

    // Handle parsed options if sent as JSON string in multipart/form-data
    if (typeof options === 'string') {
      try {
        options = JSON.parse(options);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid options JSON format.',
          error: 'INVALID_OPTIONS_FORMAT'
        });
      }
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const question = await prisma.question.create({
      data: {
        subjectId,
        topicId,
        questionText,
        questionType: questionType || 'MULTIPLE_CHOICE',
        difficulty: difficulty || 'MEDIUM',
        explanation: explanation || null,
        imageUrl,
        isPublished: isPublished === undefined ? true : (isPublished === true || isPublished === 'true'),
        calculatorAllowed: calculatorAllowed === undefined ? true : (calculatorAllowed === true || calculatorAllowed === 'true'),
        referenceSheetAllowed: referenceSheetAllowed === undefined ? true : (referenceSheetAllowed === true || referenceSheetAllowed === 'true'),
        createdById: req.user.id,
        options: {
          create: options.map(opt => ({
            optionLabel: opt.optionLabel,
            optionText: opt.optionText,
            isCorrect: opt.isCorrect === true || opt.isCorrect === 'true'
          }))
        }
      },
      include: {
        subject: true,
        topic: true,
        options: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully.',
      data: question
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    let {
      subjectId,
      topicId,
      questionText,
      questionType,
      difficulty,
      explanation,
      isPublished,
      calculatorAllowed,
      referenceSheetAllowed,
      options
    } = req.body;

    if (typeof options === 'string') {
      try {
        options = JSON.parse(options);
      } catch (e) {}
    }

    let imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const existing = await prisma.question.findUnique({
      where: { id },
      include: { options: true }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
        error: 'QUESTION_NOT_FOUND'
      });
    }

    // Use transaction to update question and recreate/update options if provided
    const updated = await prisma.$transaction(async (tx) => {
      if (options && Array.isArray(options)) {
        await tx.answerOption.deleteMany({
          where: { questionId: id }
        });
        await tx.answerOption.createMany({
          data: options.map(opt => ({
            questionId: id,
            optionLabel: opt.optionLabel,
            optionText: opt.optionText,
            isCorrect: opt.isCorrect === true || opt.isCorrect === 'true'
          }))
        });
      }

      return tx.question.update({
        where: { id },
        data: {
          ...(subjectId ? { subjectId } : {}),
          ...(topicId ? { topicId } : {}),
          ...(questionText ? { questionText } : {}),
          ...(questionType ? { questionType } : {}),
          ...(difficulty ? { difficulty } : {}),
          ...(explanation !== undefined ? { explanation } : {}),
          ...(imageUrl !== undefined ? { imageUrl } : {}),
          ...(isPublished !== undefined ? { isPublished: isPublished === true || isPublished === 'true' } : {}),
          ...(calculatorAllowed !== undefined ? { calculatorAllowed: calculatorAllowed === true || calculatorAllowed === 'true' } : {}),
          ...(referenceSheetAllowed !== undefined ? { referenceSheetAllowed: referenceSheetAllowed === true || referenceSheetAllowed === 'true' } : {})
        },
        include: {
          subject: true,
          topic: true,
          options: true
        }
      });
    });

    res.json({
      success: true,
      message: 'Question updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const bulkUpdateQuestions = async (req, res, next) => {
  try {
    const { questionIds, calculatorAllowed, referenceSheetAllowed, isPublished } = req.body;
    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No questions selected for bulk update.'
      });
    }

    const data = {};
    if (calculatorAllowed !== undefined) {
      data.calculatorAllowed = calculatorAllowed === true || calculatorAllowed === 'true';
    }
    if (referenceSheetAllowed !== undefined) {
      data.referenceSheetAllowed = referenceSheetAllowed === true || referenceSheetAllowed === 'true';
    }
    if (isPublished !== undefined) {
      data.isPublished = isPublished === true || isPublished === 'true';
    }

    const result = await prisma.question.updateMany({
      where: { id: { in: questionIds } },
      data
    });

    res.json({
      success: true,
      message: `Successfully updated ${result.count} questions.`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.question.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Question deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const togglePublishQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const q = await prisma.question.findUnique({ where: { id } });

    if (!q) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
        error: 'QUESTION_NOT_FOUND'
      });
    }

    const updated = await prisma.question.update({
      where: { id },
      data: { isPublished: !q.isPublished },
      select: { id: true, isPublished: true }
    });

    res.json({
      success: true,
      message: `Question ${updated.isPublished ? 'published' : 'unpublished'} successfully.`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};
