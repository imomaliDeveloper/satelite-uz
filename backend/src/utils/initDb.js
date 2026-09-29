import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import { INIT_SQL } from './initSql.js';

export async function runInitDb() {
  // Remove all line comments (-- ...)
  const cleanSql = INIT_SQL.replace(/--.*$/gm, '');

  const statements = cleanSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`[InitDB] Executing ${statements.length} SQL statements...`);

  let executed = 0;
  for (const stmt of statements) {
    try {
      await prisma.$executeRawUnsafe(stmt);
      executed++;
    } catch (err) {
      // Ignore if already exists (e.g. relation already exists)
      if (!err.message.includes('already exists')) {
        console.warn('[InitDB] SQL Warning:', err.message);
      }
    }
  }

  // Now seed admin user and default subjects/topics/questions
  console.log('[InitDB] Seeding default admin and content...');
  const passwordHash = await bcrypt.hash('admin12345', 10);
  const studentHash = await bcrypt.hash('student12345', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@satelite.uz' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@satelite.uz',
      password: passwordHash,
      role: 'ADMIN'
    }
  });

  const asilbekHash = await bcrypt.hash('Asilbek1212', 10);

  await prisma.user.upsert({
    where: { email: 'asilbekumrkulov@gmail.com' },
    update: {
      password: asilbekHash,
      role: 'ADMIN',
      isActive: true
    },
    create: {
      name: 'Asilbek Umrkulov',
      email: 'asilbekumrkulov@gmail.com',
      password: asilbekHash,
      role: 'ADMIN',
      isActive: true
    }
  });

  await prisma.user.upsert({
    where: { email: 'asilbekumurkulov@gmail.com' },
    update: {
      password: asilbekHash,
      role: 'ADMIN',
      isActive: true
    },
    create: {
      name: 'Asilbek Umurkulov',
      email: 'asilbekumurkulov@gmail.com',
      password: asilbekHash,
      role: 'ADMIN',
      isActive: true
    }
  });

  await prisma.user.upsert({
    where: { email: 'student@satelite.uz' },
    update: {},
    create: {
      name: 'Demo Student',
      email: 'student@satelite.uz',
      password: studentHash,
      role: 'STUDENT'
    }
  });

  // Default Math & Reading subjects
  const math = await prisma.subject.upsert({
    where: { id: 'subj-math' },
    update: {},
    create: {
      id: 'subj-math',
      name: 'Mathematics',
      slug: 'mathematics',
      description: 'Algebra, Advanced Math, Problem Solving, and Geometry.',
      icon: '📐'
    }
  });

  const rw = await prisma.subject.upsert({
    where: { id: 'subj-rw' },
    update: {},
    create: {
      id: 'subj-rw',
      name: 'Reading & Writing',
      slug: 'reading-writing',
      description: 'Craft and Structure, Information and Ideas, Expression of Ideas.',
      icon: '📖'
    }
  });

  // Topics
  const topicAlg = await prisma.topic.upsert({
    where: { id: 'topic-algebra' },
    update: {},
    create: {
      id: 'topic-algebra',
      subjectId: math.id,
      name: 'Linear Equations & Systems',
      slug: 'linear-equations',
      description: 'Single-variable and system of equations.'
    }
  });

  const topicGeo = await prisma.topic.upsert({
    where: { id: 'topic-geometry' },
    update: {},
    create: {
      id: 'topic-geometry',
      subjectId: math.id,
      name: 'Geometry & Trigonometry',
      slug: 'geometry-trig',
      description: 'Area, volume, angles, and trigonometric ratios.'
    }
  });

  const topicInfo = await prisma.topic.upsert({
    where: { id: 'topic-info' },
    update: {},
    create: {
      id: 'topic-info',
      subjectId: rw.id,
      name: 'Information and Ideas',
      slug: 'information-ideas',
      description: 'Text evidence and central ideas.'
    }
  });

  // Seed initial questions
  const qCount = await prisma.question.count();
  if (qCount === 0) {
    const q1 = await prisma.question.create({
      data: {
        id: 'q-demo-1',
        subjectId: math.id,
        topicId: topicAlg.id,
        questionText: 'If 3x + 7 = 22, what is the value of 6x - 5?',
        difficulty: 'EASY',
        explanation: 'Subtract 7 from 22: 3x = 15 => x = 5. Then compute 6(5) - 5 = 30 - 5 = 25.',
        createdById: admin.id,
        options: {
          create: [
            { optionLabel: 'A', optionText: '25', isCorrect: true },
            { optionLabel: 'B', optionText: '15', isCorrect: false },
            { optionLabel: 'C', optionText: '30', isCorrect: false },
            { optionLabel: 'D', optionText: '35', isCorrect: false }
          ]
        }
      }
    });

    const q2 = await prisma.question.create({
      data: {
        id: 'q-demo-2',
        subjectId: math.id,
        topicId: topicGeo.id,
        questionText: 'A right triangle has legs of length 6 and 8. What is the length of its hypotenuse?',
        difficulty: 'EASY',
        explanation: 'By the Pythagorean theorem: c^2 = 6^2 + 8^2 = 36 + 64 = 100 => c = 10.',
        createdById: admin.id,
        options: {
          create: [
            { optionLabel: 'A', optionText: '10', isCorrect: true },
            { optionLabel: 'B', optionText: '14', isCorrect: false },
            { optionLabel: 'C', optionText: '12', isCorrect: false },
            { optionLabel: 'D', optionText: '48', isCorrect: false }
          ]
        }
      }
    });

    const q3 = await prisma.question.create({
      data: {
        id: 'q-demo-3',
        subjectId: rw.id,
        topicId: topicInfo.id,
        questionText: 'Which choice best describes the function of the underlined phrase in developing the main claim of the passage?',
        difficulty: 'MEDIUM',
        explanation: 'The phrase offers empirical evidence directly verifying the author hypothesis.',
        createdById: admin.id,
        options: {
          create: [
            { optionLabel: 'A', optionText: 'It introduces experimental evidence supporting the hypothesis.', isCorrect: true },
            { optionLabel: 'B', optionText: 'It contradicts the previous claim.', isCorrect: false },
            { optionLabel: 'C', optionText: 'It defines a technical term.', isCorrect: false },
            { optionLabel: 'D', optionText: 'It raises an unanswered question.', isCorrect: false }
          ]
        }
      }
    });
  }

  const finalQuestions = await prisma.question.count();
  return {
    success: true,
    statementsExecuted: executed,
    questionsCount: finalQuestions,
    adminEmail: admin.email
  };
}
