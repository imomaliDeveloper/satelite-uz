import prisma from '../config/db.js';

export const listExams = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'ADMIN';
    const where = isAdmin ? {} : { isPublished: true };

    const exams = await prisma.exam.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            examQuestions: true,
            practiceSessions: true
          }
        },
        examQuestions: {
          select: {
            question: {
              select: {
                subject: { select: { id: true, name: true } },
                topic: { select: { id: true, name: true } },
                difficulty: true
              }
            }
          }
        }
      }
    });

    // Compute subject distribution for each exam
    const enrichedExams = exams.map(exam => {
      const subjectsMap = {};
      exam.examQuestions.forEach(eq => {
        const subName = eq.question.subject?.name || 'General';
        subjectsMap[subName] = (subjectsMap[subName] || 0) + 1;
      });

      return {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        durationMinutes: exam.durationMinutes,
        totalQuestions: exam._count.examQuestions,
        isPublished: exam.isPublished,
        calculatorAllowed: exam.calculatorAllowed,
        referenceSheetAllowed: exam.referenceSheetAllowed,
        createdAt: exam.createdAt,
        updatedAt: exam.updatedAt,
        attemptsCount: exam._count.practiceSessions,
        subjectBreakdown: subjectsMap
      };
    });

    res.json({
      success: true,
      data: enrichedExams
    });
  } catch (error) {
    next(error);
  }
};

export const getExamById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user?.role === 'ADMIN';

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        examQuestions: {
          orderBy: { order: 'asc' },
          include: {
            question: {
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
                }
              }
            }
          }
        }
      }
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found.',
        error: 'EXAM_NOT_FOUND'
      });
    }

    if (!exam.isPublished && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'This exam is not currently available.',
        error: 'EXAM_UNAVAILABLE'
      });
    }

    // Sanitize questions for student view
    const formattedQuestions = exam.examQuestions.map(eq => ({
      order: eq.order,
      ...eq.question,
      explanation: isAdmin ? eq.question.explanation : undefined
    }));

    res.json({
      success: true,
      data: {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        durationMinutes: exam.durationMinutes,
        totalQuestions: formattedQuestions.length,
        isPublished: exam.isPublished,
        calculatorAllowed: exam.calculatorAllowed,
        referenceSheetAllowed: exam.referenceSheetAllowed,
        createdAt: exam.createdAt,
        questions: formattedQuestions
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createExam = async (req, res, next) => {
  try {
    const { title, description, durationMinutes, isPublished, calculatorAllowed, referenceSheetAllowed, questionIds } = req.body;

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'An exam must contain at least one question.',
        error: 'NO_QUESTIONS'
      });
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        description,
        durationMinutes: durationMinutes || 60,
        totalQuestions: questionIds.length,
        isPublished: isPublished !== undefined ? isPublished : true,
        calculatorAllowed: calculatorAllowed === undefined ? true : (calculatorAllowed === true || calculatorAllowed === 'true'),
        referenceSheetAllowed: referenceSheetAllowed === undefined ? true : (referenceSheetAllowed === true || referenceSheetAllowed === 'true'),
        examQuestions: {
          create: questionIds.map((qId, index) => ({
            questionId: qId,
            order: index + 1
          }))
        }
      },
      include: {
        examQuestions: {
          include: {
            question: { select: { id: true, questionText: true } }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Exam created successfully.',
      data: exam
    });
  } catch (error) {
    next(error);
  }
};

export const updateExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, durationMinutes, isPublished, calculatorAllowed, referenceSheetAllowed, questionIds } = req.body;

    const existing = await prisma.exam.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found.',
        error: 'EXAM_NOT_FOUND'
      });
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (questionIds && Array.isArray(questionIds)) {
        await tx.examQuestion.deleteMany({ where: { examId: id } });
        await tx.examQuestion.createMany({
          data: questionIds.map((qId, index) => ({
            examId: id,
            questionId: qId,
            order: index + 1
          }))
        });
      }

      return tx.exam.update({
        where: { id },
        data: {
          ...(title ? { title } : {}),
          ...(description !== undefined ? { description } : {}),
          ...(durationMinutes ? { durationMinutes } : {}),
          ...(isPublished !== undefined ? { isPublished } : {}),
          ...(calculatorAllowed !== undefined ? { calculatorAllowed: calculatorAllowed === true || calculatorAllowed === 'true' } : {}),
          ...(referenceSheetAllowed !== undefined ? { referenceSheetAllowed: referenceSheetAllowed === true || referenceSheetAllowed === 'true' } : {}),
          ...(questionIds ? { totalQuestions: questionIds.length } : {})
        },
        include: {
          examQuestions: true
        }
      });
    });

    res.json({
      success: true,
      message: 'Exam updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExam = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.exam.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Exam deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
