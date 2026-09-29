import prisma, { ensureDbColumns } from '../config/db.js';
import { SAT_EXPANDED_QUESTIONS } from './satQuestionsData.js';

export async function seedExpandedQuestions() {
  await ensureDbColumns();

  console.log(`[SeedQuestions] Processing ${SAT_EXPANDED_QUESTIONS.length} authentic SAT questions...`);

  // Ensure Admin user exists to assign questions
  let admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: 'admin@satelite.uz',
        password: '$2a$10$YourHashedPasswordHereOrFallback12345',
        role: 'ADMIN',
        isActive: true
      }
    });
  }

  // Ensure Subjects exist
  const mathSubject = await prisma.subject.upsert({
    where: { slug: 'math' },
    update: {},
    create: {
      name: 'Mathematics',
      slug: 'math',
      description: 'Algebra, Advanced Math, Problem Solving, and Geometry for digital SAT preparation.',
      icon: '📐',
      isActive: true
    }
  });

  const rwSubject = await prisma.subject.upsert({
    where: { slug: 'reading-writing' },
    update: {},
    create: {
      name: 'Reading and Writing',
      slug: 'reading-writing',
      description: 'Information & Ideas, Craft & Structure, Expression of Ideas, and Standard English Conventions.',
      icon: '📖',
      isActive: true
    }
  });

  // Ensure Topics exist
  const topicsMap = {};

  const mathTopics = [
    { slug: 'algebra', name: 'Algebra', desc: 'Linear equations, inequalities, systems, and functions.' },
    { slug: 'advanced-math', name: 'Advanced Math', desc: 'Quadratic equations, polynomials, non-linear functions.' },
    { slug: 'problem-solving', name: 'Problem Solving & Data Analysis', desc: 'Ratios, rates, percentages, probability, and statistics.' },
    { slug: 'geometry', name: 'Geometry & Trigonometry', desc: 'Area, volume, angles, circles, and right-triangle trigonometry.' }
  ];

  for (const t of mathTopics) {
    const topic = await prisma.topic.upsert({
      where: { subjectId_slug: { subjectId: mathSubject.id, slug: t.slug } },
      update: {},
      create: {
        subjectId: mathSubject.id,
        name: t.name,
        slug: t.slug,
        description: t.desc
      }
    });
    topicsMap[`math:${t.slug}`] = topic.id;
  }

  const rwTopics = [
    { slug: 'information-ideas', name: 'Information and Ideas', desc: 'Central themes, factual inference, and textual evidence.' },
    { slug: 'craft-structure', name: 'Craft and Structure', desc: 'Words in context, rhetorical purpose, and cross-text analysis.' },
    { slug: 'expression-ideas', name: 'Expression of Ideas', desc: 'Rhetorical transitions, revision for concision, and logical flow.' },
    { slug: 'conventions', name: 'Standard English Conventions', desc: 'Punctuation, clause linking, subject-verb agreement, and modifier placement.' }
  ];

  for (const t of rwTopics) {
    const topic = await prisma.topic.upsert({
      where: { subjectId_slug: { subjectId: rwSubject.id, slug: t.slug } },
      update: {},
      create: {
        subjectId: rwSubject.id,
        name: t.name,
        slug: t.slug,
        description: t.desc
      }
    });
    topicsMap[`reading-writing:${t.slug}`] = topic.id;
  }

  let createdCount = 0;
  let skippedCount = 0;

  for (const q of SAT_EXPANDED_QUESTIONS) {
    const subjectId = q.subjectSlug === 'math' ? mathSubject.id : rwSubject.id;
    const topicId = topicsMap[`${q.subjectSlug}:${q.topicSlug}`] || null;

    const existing = await prisma.question.findFirst({
      where: { questionText: q.questionText }
    });

    if (!existing) {
      await prisma.question.create({
        data: {
          subjectId,
          topicId,
          questionText: q.questionText,
          questionType: 'MULTIPLE_CHOICE',
          difficulty: q.difficulty,
          explanation: q.explanation,
          calculatorAllowed: q.calculatorAllowed !== undefined ? q.calculatorAllowed : true,
          referenceSheetAllowed: q.referenceSheetAllowed !== undefined ? q.referenceSheetAllowed : true,
          isPublished: true,
          createdById: admin.id,
          options: {
            create: q.options.map(opt => ({
              optionLabel: opt.optionLabel,
              optionText: opt.optionText,
              isCorrect: opt.isCorrect
            }))
          }
        }
      });
      createdCount++;
    } else {
      skippedCount++;
    }
  }

  const totalQuestions = await prisma.question.count();
  console.log(`[SeedQuestions] Done! Added: ${createdCount}, Already existed: ${skippedCount}. Total in database: ${totalQuestions}.`);

  return {
    success: true,
    added: createdCount,
    skipped: skippedCount,
    total: totalQuestions
  };
}

// Allow direct CLI execution: node backend/src/utils/seedQuestions.js
if (process.argv[1] && process.argv[1].endsWith('seedQuestions.js')) {
  seedExpandedQuestions()
    .then((res) => {
      console.log('Result:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error seeding questions:', err);
      process.exit(1);
    });
}
