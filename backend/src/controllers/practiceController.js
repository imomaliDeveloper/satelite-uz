import prisma from '../config/db.js';

export const startPracticeSession = async (req, res, next) => {
  try {
    const { subjectId, topicId, count = 10, difficulty } = req.body;
    const userId = req.user.id;

    const where = { isPublished: true };
    if (subjectId) where.subjectId = subjectId;
    if (topicId) where.topicId = topicId;
    if (difficulty) where.difficulty = difficulty;

    const limit = Math.min(Math.max(parseInt(count) || 10, 1), 50);

    // Fetch random or sequential questions
    const allMatching = await prisma.question.findMany({
      where,
      select: { id: true }
    });

    if (allMatching.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No published questions available matching the selected criteria.',
        error: 'NO_QUESTIONS_FOUND'
      });
    }

    // Shuffle and pick
    const shuffled = allMatching.sort(() => 0.5 - Math.random());
    const selectedIds = shuffled.slice(0, limit).map(q => q.id);

    // Create session
    const session = await prisma.practiceSession.create({
      data: {
        userId,
        subjectId: subjectId || null,
        topicId: topicId || null,
        mode: 'PRACTICE',
        totalQuestions: selectedIds.length
      }
    });

    // Fetch question details without answers
    const questions = await prisma.question.findMany({
      where: { id: { in: selectedIds } },
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
    });

    // Preserve the shuffled order
    const orderedQuestions = selectedIds.map(id => questions.find(q => q.id === id)).filter(Boolean);

    res.status(201).json({
      success: true,
      data: {
        session: {
          id: session.id,
          totalQuestions: session.totalQuestions,
          startedAt: session.startedAt,
          mode: session.mode
        },
        questions: orderedQuestions
      }
    });
  } catch (error) {
    next(error);
  }
};

export const submitPracticeAnswer = async (req, res, next) => {
  try {
    const { id: sessionId } = req.params;
    const { questionId, selectedOptionId } = req.body;
    const userId = req.user.id;

    const session = await prisma.practiceSession.findFirst({
      where: { id: sessionId, userId }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Practice session not found.',
        error: 'SESSION_NOT_FOUND'
      });
    }

    // Find the correct option for this question
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        options: true,
        subject: { select: { name: true } },
        topic: { select: { name: true } }
      }
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
        error: 'QUESTION_NOT_FOUND'
      });
    }

    const correctOption = question.options.find(opt => opt.isCorrect);
    const isCorrect = selectedOptionId ? selectedOptionId === correctOption?.id : false;

    // Upsert user answer
    const existingAnswer = await prisma.userAnswer.findFirst({
      where: { sessionId, questionId, userId }
    });

    if (existingAnswer) {
      await prisma.userAnswer.update({
        where: { id: existingAnswer.id },
        data: {
          selectedOptionId: selectedOptionId || null,
          isCorrect
        }
      });
    } else {
      await prisma.userAnswer.create({
        data: {
          userId,
          sessionId,
          questionId,
          selectedOptionId: selectedOptionId || null,
          isCorrect
        }
      });
    }

    res.json({
      success: true,
      data: {
        isCorrect,
        correctOptionId: correctOption?.id,
        correctOptionLabel: correctOption?.optionLabel,
        explanation: question.explanation
      }
    });
  } catch (error) {
    next(error);
  }
};

export const completePracticeSession = async (req, res, next) => {
  try {
    const { id: sessionId } = req.params;
    const { durationSeconds = 0 } = req.body;
    const userId = req.user.id;

    const session = await prisma.practiceSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        answers: {
          include: {
            question: {
              include: {
                subject: true,
                topic: true,
                options: true
              }
            }
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Practice session not found.',
        error: 'SESSION_NOT_FOUND'
      });
    }

    const totalQuestions = session.totalQuestions || session.answers.length;
    const correctCount = session.answers.filter(a => a.isCorrect).length;
    const answeredCount = session.answers.filter(a => a.selectedOptionId).length;
    const wrongCount = answeredCount - correctCount;
    const skippedCount = Math.max(0, totalQuestions - answeredCount);
    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    const updated = await prisma.practiceSession.update({
      where: { id: sessionId },
      data: {
        completedAt: new Date(),
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        skippedAnswers: skippedCount,
        score: Math.round(score * 10) / 10,
        durationSeconds: parseInt(durationSeconds) || 0
      }
    });

    // Calculate topic accuracy breakdown
    const topicStats = {};
    session.answers.forEach(a => {
      const topicName = a.question.topic?.name || 'General';
      if (!topicStats[topicName]) {
        topicStats[topicName] = { total: 0, correct: 0 };
      }
      topicStats[topicName].total += 1;
      if (a.isCorrect) topicStats[topicName].correct += 1;
    });

    const topicBreakdown = Object.entries(topicStats).map(([name, data]) => ({
      topic: name,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      total: data.total,
      correct: data.correct
    }));

    res.json({
      success: true,
      message: 'Session completed successfully.',
      data: {
        session: updated,
        accuracy: Math.round(score),
        topicBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

export const startExamSession = async (req, res, next) => {
  try {
    const { examId } = req.body;
    const userId = req.user.id;

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        examQuestions: {
          orderBy: { order: 'asc' },
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
        }
      }
    });

    if (!exam || !exam.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Exam is not available or does not exist.',
        error: 'EXAM_NOT_FOUND'
      });
    }

    const session = await prisma.practiceSession.create({
      data: {
        userId,
        examId,
        mode: 'EXAM',
        totalQuestions: exam.examQuestions.length
      }
    });

    const sanitizedQuestions = exam.examQuestions.map(eq => ({
      order: eq.order,
      ...eq.question
    }));

    res.status(201).json({
      success: true,
      data: {
        session: {
          id: session.id,
          examId: exam.id,
          title: exam.title,
          durationMinutes: exam.durationMinutes,
          totalQuestions: exam.examQuestions.length,
          startedAt: session.startedAt,
          mode: 'EXAM'
        },
        questions: sanitizedQuestions
      }
    });
  } catch (error) {
    next(error);
  }
};

export const submitExamSession = async (req, res, next) => {
  try {
    const { id: sessionId } = req.params;
    const { answers = [], durationSeconds = 0 } = req.body;
    const userId = req.user.id;

    const session = await prisma.practiceSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        exam: {
          include: {
            examQuestions: {
              include: {
                question: {
                  include: {
                    options: true,
                    subject: true,
                    topic: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Exam session not found.',
        error: 'SESSION_NOT_FOUND'
      });
    }

    const examQuestions = session.exam?.examQuestions || [];
    const questionMap = new Map();
    examQuestions.forEach(eq => questionMap.set(eq.question.id, eq.question));

    const answerMap = new Map();
    answers.forEach(a => answerMap.set(a.questionId, a.selectedOptionId));

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    const topicStats = {};

    const userAnswersToCreate = [];

    examQuestions.forEach(eq => {
      const q = eq.question;
      const selectedOptionId = answerMap.get(q.id) || null;
      const correctOption = q.options.find(opt => opt.isCorrect);
      const isCorrect = selectedOptionId ? selectedOptionId === correctOption?.id : false;

      if (!selectedOptionId) {
        skippedCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }

      const topicName = q.topic?.name || 'General';
      if (!topicStats[topicName]) {
        topicStats[topicName] = { total: 0, correct: 0 };
      }
      topicStats[topicName].total += 1;
      if (isCorrect) topicStats[topicName].correct += 1;

      userAnswersToCreate.push({
        userId,
        sessionId,
        questionId: q.id,
        selectedOptionId,
        isCorrect
      });
    });

    const totalQuestions = examQuestions.length;
    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    await prisma.$transaction(async (tx) => {
      await tx.userAnswer.deleteMany({ where: { sessionId } });
      await tx.userAnswer.createMany({ data: userAnswersToCreate });
      await tx.practiceSession.update({
        where: { id: sessionId },
        data: {
          completedAt: new Date(),
          score: Math.round(score * 10) / 10,
          totalQuestions,
          correctAnswers: correctCount,
          wrongAnswers: wrongCount,
          skippedAnswers: skippedCount,
          durationSeconds: parseInt(durationSeconds) || 0
        }
      });
    });

    const topicBreakdown = Object.entries(topicStats).map(([name, data]) => ({
      topic: name,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      total: data.total,
      correct: data.correct
    }));

    res.json({
      success: true,
      message: 'Exam submitted successfully.',
      data: {
        sessionId,
        score: `${correctCount} / ${totalQuestions}`,
        accuracy: Math.round(score),
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        skippedAnswers: skippedCount,
        durationSeconds,
        topicBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserTelemetry = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Fetch all completed sessions for this specific user
    const [sessions, bookmarksCount, userAnswers] = await Promise.all([
      prisma.practiceSession.findMany({
        where: { userId, completedAt: { not: null } },
        orderBy: { completedAt: 'desc' },
        include: {
          subject: { select: { id: true, name: true } },
          topic: { select: { id: true, name: true } },
          exam: { select: { id: true, title: true } }
        }
      }),
      prisma.bookmark.count({ where: { userId } }),
      prisma.userAnswer.findMany({
        where: { userId },
        include: {
          question: {
            include: {
              topic: { select: { id: true, name: true } },
              subject: { select: { id: true, name: true } }
            }
          }
        }
      })
    ]);

    // 2. Compute KPI Metrics
    let totalPracticed = 0;
    let totalExams = 0;
    let totalPracticeSets = 0;
    let totalScoreSum = 0;
    let completedCount = 0;

    sessions.forEach(s => {
      const qCount = s.totalQuestions || (s.correctAnswers + s.wrongAnswers + s.skippedAnswers);
      totalPracticed += (s.correctAnswers + s.wrongAnswers + s.skippedAnswers) || qCount;
      if (s.mode === 'EXAM') totalExams++;
      if (s.mode === 'PRACTICE') totalPracticeSets++;
      if (typeof s.score === 'number') {
        totalScoreSum += s.score;
        completedCount++;
      }
    });

    const averageAccuracy = completedCount > 0 ? Math.round(totalScoreSum / completedCount) : 0;

    // 3. Compute Streak Days
    let streakDays = 0;
    if (sessions.length > 0) {
      const uniqueDays = new Set(
        sessions.map(s => {
          const d = new Date(s.completedAt);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })
      );
      const sortedDays = Array.from(uniqueDays).sort().reverse();
      
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      const yesterday = new Date(Date.now() - 86400000);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

      if (sortedDays[0] === todayStr || sortedDays[0] === yesterdayStr) {
        let checkDate = new Date(sortedDays[0]);
        for (let i = 0; i < sortedDays.length; i++) {
          const expectedStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
          if (sortedDays[i] === expectedStr) {
            streakDays++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    // 4. Topic performance breakdown
    const topicMap = {};
    userAnswers.forEach(ans => {
      const topicName = ans.question?.topic?.name || 'General';
      if (!topicMap[topicName]) {
        topicMap[topicName] = {
          topic: topicName,
          subject: ans.question?.subject?.name || 'General',
          total: 0,
          correct: 0
        };
      }
      topicMap[topicName].total += 1;
      if (ans.isCorrect) topicMap[topicName].correct += 1;
    });

    const allTopics = Object.values(topicMap).map(t => ({
      topic: t.topic,
      subject: t.subject,
      total: t.total,
      correct: t.correct,
      accuracy: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0
    }));

    const weakTopics = allTopics
      .filter(t => t.total >= 1)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 4);

    const strongTopics = allTopics
      .filter(t => t.accuracy >= 70 && t.total >= 1)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 4);

    res.json({
      success: true,
      data: {
        totalPracticed,
        totalExams,
        totalPracticeSets,
        averageAccuracy,
        totalBookmarks: bookmarksCount,
        streakDays,
        recentSessions: sessions.slice(0, 5),
        weakTopics,
        strongTopics
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPracticeHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const mode = req.query.mode;

    const where = {
      userId,
      completedAt: { not: null }
    };
    if (mode) where.mode = mode;

    const [total, sessions] = await Promise.all([
      prisma.practiceSession.count({ where }),
      prisma.practiceSession.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { completedAt: 'desc' },
        include: {
          subject: { select: { id: true, name: true } },
          topic: { select: { id: true, name: true } },
          exam: { select: { id: true, title: true } }
        }
      })
    ]);

    res.json({
      success: true,
      data: sessions,
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

export const getSessionResult = async (req, res, next) => {
  try {
    const { id: sessionId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    const session = await prisma.practiceSession.findUnique({
      where: { id: sessionId },
      include: {
        subject: true,
        topic: true,
        exam: true,
        answers: {
          include: {
            question: {
              include: {
                subject: { select: { id: true, name: true } },
                topic: { select: { id: true, name: true } },
                options: {
                  select: {
                    id: true,
                    optionLabel: true,
                    optionText: true,
                    isCorrect: true
                  },
                  orderBy: { optionLabel: 'asc' }
                },
                bookmarks: {
                  where: { userId }
                }
              }
            }
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.',
        error: 'SESSION_NOT_FOUND'
      });
    }

    if (session.userId !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
        error: 'FORBIDDEN'
      });
    }

    // Format topic breakdown
    const topicStats = {};
    session.answers.forEach(a => {
      const topicName = a.question.topic?.name || 'General';
      if (!topicStats[topicName]) {
        topicStats[topicName] = { total: 0, correct: 0 };
      }
      topicStats[topicName].total += 1;
      if (a.isCorrect) topicStats[topicName].correct += 1;
    });

    const topicBreakdown = Object.entries(topicStats).map(([name, data]) => ({
      topic: name,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      total: data.total,
      correct: data.correct
    }));

    const reviewQuestions = session.answers.map(a => {
      const q = a.question;
      const correctOpt = q.options.find(o => o.isCorrect);
      const selectedOpt = q.options.find(o => o.id === a.selectedOptionId);

      let status = 'SKIPPED';
      if (a.selectedOptionId) {
        status = a.isCorrect ? 'CORRECT' : 'INCORRECT';
      }

      return {
        questionId: q.id,
        questionText: q.questionText,
        imageUrl: q.imageUrl,
        difficulty: q.difficulty,
        subject: q.subject?.name,
        topic: q.topic?.name,
        options: q.options.map(o => ({
          id: o.id,
          optionLabel: o.optionLabel,
          optionText: o.optionText,
          isCorrect: o.isCorrect
        })),
        userAnswerId: a.selectedOptionId,
        userAnswerLabel: selectedOpt ? selectedOpt.optionLabel : null,
        userAnswerText: selectedOpt ? selectedOpt.optionText : null,
        correctAnswerId: correctOpt?.id,
        correctAnswerLabel: correctOpt?.optionLabel,
        correctAnswerText: correctOpt?.optionText,
        explanation: q.explanation,
        status,
        isBookmarked: q.bookmarks.length > 0
      };
    });

    res.json({
      success: true,
      data: {
        session: {
          id: session.id,
          title: session.exam?.title || `${session.subject?.name || 'General'} Practice`,
          mode: session.mode,
          score: session.score,
          totalQuestions: session.totalQuestions,
          correctAnswers: session.correctAnswers,
          wrongAnswers: session.wrongAnswers,
          skippedAnswers: session.skippedAnswers,
          durationSeconds: session.durationSeconds,
          startedAt: session.startedAt,
          completedAt: session.completedAt
        },
        topicBreakdown,
        reviewQuestions
      }
    });
  } catch (error) {
    next(error);
  }
};
