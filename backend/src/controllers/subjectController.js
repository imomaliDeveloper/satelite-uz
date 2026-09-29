import prisma from '../config/db.js';

export const listSubjects = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'ADMIN';
    const where = isAdmin ? {} : { isActive: true };

    const subjects = await prisma.subject.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        topics: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            _count: {
              select: { questions: { where: { isPublished: true } } }
            }
          }
        },
        _count: {
          select: {
            questions: { where: { isPublished: true } },
            topics: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: subjects
    });
  } catch (error) {
    next(error);
  }
};

export const getSubjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await prisma.subject.findFirst({
      where: {
        OR: [{ id }, { slug: id }]
      },
      include: {
        topics: {
          include: {
            _count: {
              select: { questions: true }
            }
          }
        },
        _count: {
          select: { questions: true }
        }
      }
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found.',
        error: 'SUBJECT_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: subject
    });
  } catch (error) {
    next(error);
  }
};

export const createSubject = async (req, res, next) => {
  try {
    const { name, slug, description, icon, isActive } = req.body;

    const existing = await prisma.subject.findFirst({
      where: { OR: [{ name }, { slug }] }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A subject with this name or slug already exists.',
        error: 'DUPLICATE_SUBJECT'
      });
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        slug: slug.toLowerCase(),
        description,
        icon,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Subject created successfully.',
      data: subject
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon, isActive } = req.body;

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(slug ? { slug: slug.toLowerCase() } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(icon !== undefined ? { icon } : {}),
        ...(isActive !== undefined ? { isActive } : {})
      }
    });

    res.json({
      success: true,
      message: 'Subject updated successfully.',
      data: subject
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if questions are linked
    const questionCount = await prisma.question.count({
      where: { subjectId: id }
    });

    if (questionCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete subject because it contains ${questionCount} questions. Please reassign or delete them first.`,
        error: 'SUBJECT_HAS_QUESTIONS'
      });
    }

    await prisma.subject.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Subject deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
