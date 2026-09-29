import prisma from '../config/db.js';

export const listTopics = async (req, res, next) => {
  try {
    const { subjectId } = req.query;
    const where = {};
    if (subjectId) {
      where.subjectId = subjectId;
    }

    const topics = await prisma.topic.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        subject: {
          select: { id: true, name: true, slug: true }
        },
        _count: {
          select: { questions: { where: { isPublished: true } } }
        }
      }
    });

    res.json({
      success: true,
      data: topics
    });
  } catch (error) {
    next(error);
  }
};

export const getTopicById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        subject: true,
        _count: {
          select: { questions: true }
        }
      }
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found.',
        error: 'TOPIC_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: topic
    });
  } catch (error) {
    next(error);
  }
};

export const createTopic = async (req, res, next) => {
  try {
    const { subjectId, name, slug, description } = req.body;

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
    });
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found.',
        error: 'SUBJECT_NOT_FOUND'
      });
    }

    const existing = await prisma.topic.findFirst({
      where: { subjectId, slug: slug.toLowerCase() }
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A topic with this slug already exists under this subject.',
        error: 'DUPLICATE_TOPIC'
      });
    }

    const topic = await prisma.topic.create({
      data: {
        subjectId,
        name,
        slug: slug.toLowerCase(),
        description
      },
      include: {
        subject: { select: { id: true, name: true } }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Topic created successfully.',
      data: topic
    });
  } catch (error) {
    next(error);
  }
};

export const updateTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, description, subjectId } = req.body;

    const topic = await prisma.topic.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(slug ? { slug: slug.toLowerCase() } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(subjectId ? { subjectId } : {})
      },
      include: {
        subject: { select: { id: true, name: true } }
      }
    });

    res.json({
      success: true,
      message: 'Topic updated successfully.',
      data: topic
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTopic = async (req, res, next) => {
  try {
    const { id } = req.params;

    const questionCount = await prisma.question.count({
      where: { topicId: id }
    });

    if (questionCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete topic because it contains ${questionCount} questions. Please reassign or delete them first.`,
        error: 'TOPIC_HAS_QUESTIONS'
      });
    }

    await prisma.topic.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Topic deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
