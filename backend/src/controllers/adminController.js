import prisma from '../config/db.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalQuestions,
      totalSubjects,
      totalTopics,
      totalExams,
      questionsAddedToday,
      activeStudents,
      allSessions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.question.count(),
      prisma.subject.count(),
      prisma.topic.count(),
      prisma.exam.count(),
      prisma.question.count({
        where: { createdAt: { gte: today } }
      }),
      prisma.user.count({
        where: {
          role: 'STUDENT',
          isActive: true,
          lastLoginAt: { not: null }
        }
      }),
      prisma.practiceSession.findMany({
        where: { completedAt: { not: null } },
        select: { score: true }
      })
    ]);

    const avgAccuracy = allSessions.length > 0
      ? Math.round(allSessions.reduce((acc, curr) => acc + curr.score, 0) / allSessions.length)
      : 0;

    // Fetch recent activity: recent questions, recent completed sessions, recent user registrations
    const [recentUsers, recentQuestions, recentSessions] = await Promise.all([
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, createdAt: true }
      }),
      prisma.question.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          questionText: true,
          difficulty: true,
          subject: { select: { name: true } },
          createdAt: true
        }
      }),
      prisma.practiceSession.findMany({
        take: 5,
        where: { completedAt: { not: null } },
        orderBy: { completedAt: 'desc' },
        select: {
          id: true,
          mode: true,
          score: true,
          user: { select: { name: true, email: true } },
          subject: { select: { name: true } },
          completedAt: true
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalQuestions,
        totalSubjects,
        totalTopics,
        totalExams,
        questionsAddedToday,
        activeStudents,
        avgPlatformAccuracy: avgAccuracy,
        recentActivity: {
          recentUsers,
          recentQuestions,
          recentSessions
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminAnalytics = async (req, res, next) => {
  try {
    // 1. Difficulty distribution
    const difficultyCounts = await prisma.question.groupBy({
      by: ['difficulty'],
      _count: { id: true }
    });

    // 2. Questions by subject
    const questionsBySubject = await prisma.subject.findMany({
      select: {
        name: true,
        _count: { select: { questions: true } }
      }
    });

    // 3. Most missed questions (highest incorrect answers)
    const questionsWithAnswers = await prisma.question.findMany({
      take: 10,
      include: {
        subject: { select: { name: true } },
        topic: { select: { name: true } },
        userAnswers: true
      }
    });

    const mostMissedQuestions = questionsWithAnswers
      .map(q => {
        const total = q.userAnswers.length;
        const wrong = q.userAnswers.filter(a => !a.isCorrect && a.selectedOptionId).length;
        return {
          id: q.id,
          questionText: q.questionText.slice(0, 80) + (q.questionText.length > 80 ? '...' : ''),
          subject: q.subject?.name,
          topic: q.topic?.name,
          difficulty: q.difficulty,
          totalAttempts: total,
          wrongCount: wrong,
          missRate: total > 0 ? Math.round((wrong / total) * 100) : 0
        };
      })
      .filter(q => q.totalAttempts > 0)
      .sort((a, b) => b.missRate - a.missRate)
      .slice(0, 5);

    // 4. Most difficult topics
    const topics = await prisma.topic.findMany({
      include: {
        subject: { select: { name: true } },
        questions: {
          include: {
            userAnswers: true
          }
        }
      }
    });

    const topicDifficulty = topics
      .map(t => {
        let totalAttempts = 0;
        let correctAttempts = 0;
        t.questions.forEach(q => {
          q.userAnswers.forEach(a => {
            if (a.selectedOptionId) {
              totalAttempts++;
              if (a.isCorrect) correctAttempts++;
            }
          });
        });

        return {
          id: t.id,
          name: t.name,
          subject: t.subject?.name,
          totalQuestions: t.questions.length,
          totalAttempts,
          avgAccuracy: totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0
        };
      })
      .filter(t => t.totalAttempts > 0)
      .sort((a, b) => a.avgAccuracy - b.avgAccuracy)
      .slice(0, 5);

    // 5. Sessions summary
    const completedSessions = await prisma.practiceSession.count({
      where: { completedAt: { not: null } }
    });

    res.json({
      success: true,
      data: {
        difficultyDistribution: difficultyCounts.map(d => ({
          difficulty: d.difficulty,
          count: d._count.id
        })),
        subjectDistribution: questionsBySubject.map(s => ({
          subject: s.name,
          count: s._count.questions
        })),
        mostMissedQuestions,
        mostDifficultTopics: topicDifficulty,
        completedSessions
      }
    });
  } catch (error) {
    next(error);
  }
};
