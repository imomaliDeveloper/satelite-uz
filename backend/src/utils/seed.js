import prisma from '../config/db.js';
import { hashPassword } from './jwt.js';

async function main() {
  console.log('🚀 [SATELITE.UZ] Seeding database...');

  // 1. Seed Admin User
  const adminPassword = await hashPassword('ChangeMe123!');
  const studentPassword = await hashPassword('StudentPass123!');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@satelite.uz' },
    update: {
      password: adminPassword,
      role: 'ADMIN',
      isActive: true
    },
    create: {
      name: 'System Administrator',
      email: 'admin@satelite.uz',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: new Date()
    }
  });

  const asilbekPassword = await hashPassword('Asilbek1212');
  await prisma.user.upsert({
    where: { email: 'asilbekumurkulov@gmail.com' },
    update: {
      name: 'Asilbek Umurkulov',
      password: asilbekPassword,
      role: 'ADMIN',
      isActive: true
    },
    create: {
      name: 'Asilbek Umurkulov',
      email: 'asilbekumurkulov@gmail.com',
      password: asilbekPassword,
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: new Date()
    }
  });

  const demoStudent = await prisma.user.upsert({
    where: { email: 'student@satelite.uz' },
    update: {
      password: studentPassword,
      role: 'STUDENT',
      isActive: true
    },
    create: {
      name: 'Azizbek Rakhimov',
      email: 'student@satelite.uz',
      password: studentPassword,
      role: 'STUDENT',
      isActive: true,
      lastLoginAt: new Date()
    }
  });

  console.log('✔ Users seeded:');
  console.log('  Admin: admin@satelite.uz / ChangeMe123! (Change immediately in production!)');
  console.log('  Student: student@satelite.uz / StudentPass123!');

  // 2. Seed Subjects
  const mathSubject = await prisma.subject.upsert({
    where: { slug: 'math' },
    update: {},
    create: {
      name: 'Mathematics',
      slug: 'math',
      description: 'Algebra, Advanced Math, Problem Solving, and Geometry for digital SAT preparation.',
      icon: 'calculator',
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
      icon: 'book-open',
      isActive: true
    }
  });

  // 3. Seed Topics
  // Math Topics
  const algebra = await prisma.topic.upsert({
    where: { subjectId_slug: { subjectId: mathSubject.id, slug: 'algebra' } },
    update: {},
    create: {
      subjectId: mathSubject.id,
      name: 'Algebra',
      slug: 'algebra',
      description: 'Linear equations, inequalities, systems, and functions.'
    }
  });

  const advMath = await prisma.topic.upsert({
    where: { subjectId_slug: { subjectId: mathSubject.id, slug: 'advanced-math' } },
    update: {},
    create: {
      subjectId: mathSubject.id,
      name: 'Advanced Math',
      slug: 'advanced-math',
      description: 'Quadratic equations, polynomials, non-linear functions.'
    }
  });

  const problemSolving = await prisma.topic.upsert({
    where: { subjectId_slug: { subjectId: mathSubject.id, slug: 'problem-solving' } },
    update: {},
    create: {
      subjectId: mathSubject.id,
      name: 'Problem Solving & Data Analysis',
      slug: 'problem-solving',
      description: 'Ratios, rates, percentages, probability, and statistics.'
    }
  });

  const geometry = await prisma.topic.upsert({
    where: { subjectId_slug: { subjectId: mathSubject.id, slug: 'geometry' } },
    update: {},
    create: {
      subjectId: mathSubject.id,
      name: 'Geometry & Trigonometry',
      slug: 'geometry',
      description: 'Area, volume, angles, circles, and right-triangle trigonometry.'
    }
  });

  // Reading & Writing Topics
  const infoIdeas = await prisma.topic.upsert({
    where: { subjectId_slug: { subjectId: rwSubject.id, slug: 'information-ideas' } },
    update: {},
    create: {
      subjectId: rwSubject.id,
      name: 'Information and Ideas',
      slug: 'information-ideas',
      description: 'Central themes, factual inference, and textual evidence.'
    }
  });

  const craftStructure = await prisma.topic.upsert({
    where: { subjectId_slug: { subjectId: rwSubject.id, slug: 'craft-structure' } },
    update: {},
    create: {
      subjectId: rwSubject.id,
      name: 'Craft and Structure',
      slug: 'craft-structure',
      description: 'Words in context, rhetorical purpose, and cross-text analysis.'
    }
  });

  const expressionIdeas = await prisma.topic.upsert({
    where: { subjectId_slug: { subjectId: rwSubject.id, slug: 'expression-ideas' } },
    update: {},
    create: {
      subjectId: rwSubject.id,
      name: 'Expression of Ideas',
      slug: 'expression-ideas',
      description: 'Rhetorical transitions, revision for concision, and logical flow.'
    }
  });

  const conventions = await prisma.topic.upsert({
    where: { subjectId_slug: { subjectId: rwSubject.id, slug: 'conventions' } },
    update: {},
    create: {
      subjectId: rwSubject.id,
      name: 'Standard English Conventions',
      slug: 'conventions',
      description: 'Punctuation, clause linking, subject-verb agreement, and modifier placement.'
    }
  });

  console.log('✔ Subjects and Topics created.');

  // 4. Sample Questions Bank (Original Educational Questions)
  const sampleQuestions = [
    // Math - Algebra
    {
      subjectId: mathSubject.id,
      topicId: algebra.id,
      questionText: 'If 4x - 7 = 2x + 9, what is the value of 3x + 2?',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      explanation: 'First, solve for x: 4x - 2x = 9 + 7 => 2x = 16 => x = 8. Then evaluate 3x + 2: 3(8) + 2 = 24 + 2 = 26.',
      options: [
        { optionLabel: 'A', optionText: '24', isCorrect: false },
        { optionLabel: 'B', optionText: '26', isCorrect: true },
        { optionLabel: 'C', optionText: '30', isCorrect: false },
        { optionLabel: 'D', optionText: '34', isCorrect: false }
      ]
    },
    {
      subjectId: mathSubject.id,
      topicId: algebra.id,
      questionText: 'A line in the xy-plane passes through the points (2, 5) and (6, 17). What is the y-intercept of the line?',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: 'Calculate the slope m = (17 - 5) / (6 - 2) = 12 / 4 = 3. Using point-slope form with (2, 5): y - 5 = 3(x - 2) => y = 3x - 6 + 5 => y = 3x - 1. Therefore, the y-intercept is (0, -1), so the value is -1.',
      options: [
        { optionLabel: 'A', optionText: '-2', isCorrect: false },
        { optionLabel: 'B', optionText: '-1', isCorrect: true },
        { optionLabel: 'C', optionText: '1', isCorrect: false },
        { optionLabel: 'D', optionText: '3', isCorrect: false }
      ]
    },
    {
      subjectId: mathSubject.id,
      topicId: algebra.id,
      questionText: 'For what value of c will the system of equations 2x + 5y = 12 and 6x + 15y = c have infinitely many solutions?',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: 'Multiplying the first equation 2x + 5y = 12 by 3 yields 6x + 15y = 36. For the system to have infinitely many solutions, the two equations must be identical, so c = 36.',
      options: [
        { optionLabel: 'A', optionText: '24', isCorrect: false },
        { optionLabel: 'B', optionText: '36', isCorrect: true },
        { optionLabel: 'C', optionText: '48', isCorrect: false },
        { optionLabel: 'D', optionText: '60', isCorrect: false }
      ]
    },

    // Math - Advanced Math
    {
      subjectId: mathSubject.id,
      topicId: advMath.id,
      questionText: 'The function f is defined by f(x) = x^2 - 8x + 11. What is the minimum value of f(x)?',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: 'The vertex of a parabola y = ax^2 + bx + c occurs at x = -b / (2a) = -(-8) / (2*1) = 4. Evaluating f(4) gives (4)^2 - 8(4) + 11 = 16 - 32 + 11 = -5.',
      options: [
        { optionLabel: 'A', optionText: '-5', isCorrect: true },
        { optionLabel: 'B', optionText: '-8', isCorrect: false },
        { optionLabel: 'C', optionText: '3', isCorrect: false },
        { optionLabel: 'D', optionText: '11', isCorrect: false }
      ]
    },
    {
      subjectId: mathSubject.id,
      topicId: advMath.id,
      questionText: 'Which expression is equivalent to (3x^2 - 12) / (x - 2) for all x ≠ 2?',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      explanation: 'Factor the numerator: 3x^2 - 12 = 3(x^2 - 4) = 3(x - 2)(x + 2). Canceling the common factor (x - 2) gives 3(x + 2) = 3x + 6.',
      options: [
        { optionLabel: 'A', optionText: '3x - 6', isCorrect: false },
        { optionLabel: 'B', optionText: '3x + 6', isCorrect: true },
        { optionLabel: 'C', optionText: 'x + 6', isCorrect: false },
        { optionLabel: 'D', optionText: '3x^2 + 6', isCorrect: false }
      ]
    },
    {
      subjectId: mathSubject.id,
      topicId: advMath.id,
      questionText: 'If 2^(3x + 1) = 64, what is the value of x?',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      explanation: 'Write 64 as a power of 2: 64 = 2^6. Thus 3x + 1 = 6 => 3x = 5 => x = 5/3.',
      options: [
        { optionLabel: 'A', optionText: '1', isCorrect: false },
        { optionLabel: 'B', optionText: '5/3', isCorrect: true },
        { optionLabel: 'C', optionText: '2', isCorrect: false },
        { optionLabel: 'D', optionText: '7/3', isCorrect: false }
      ]
    },

    // Math - Problem Solving
    {
      subjectId: mathSubject.id,
      topicId: problemSolving.id,
      questionText: 'A bookstore owner reduced the price of an exam preparation guide by 20%. The following week, the discounted price was reduced by an additional 15%. What was the total percentage reduction from the original price?',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: 'Let original price be 100. After a 20% reduction, the price is 80. An additional 15% reduction on 80 equals 0.15 * 80 = 12. Final price = 80 - 12 = 68. The total discount is 100 - 68 = 32%.',
      options: [
        { optionLabel: 'A', optionText: '30%', isCorrect: false },
        { optionLabel: 'B', optionText: '32%', isCorrect: true },
        { optionLabel: 'C', optionText: '35%', isCorrect: false },
        { optionLabel: 'D', optionText: '36%', isCorrect: false }
      ]
    },
    {
      subjectId: mathSubject.id,
      topicId: problemSolving.id,
      questionText: 'A sample of 5 diagnostic test scores has a mean of 82. If a sixth score of 94 is added to the data set, what is the new mean score?',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      explanation: 'The sum of the initial 5 scores is 5 * 82 = 410. Adding 94 gives a new total of 410 + 94 = 504. Dividing by 6 gives 504 / 6 = 84.',
      options: [
        { optionLabel: 'A', optionText: '83', isCorrect: false },
        { optionLabel: 'B', optionText: '84', isCorrect: true },
        { optionLabel: 'C', optionText: '85', isCorrect: false },
        { optionLabel: 'D', optionText: '86', isCorrect: false }
      ]
    },

    // Math - Geometry
    {
      subjectId: mathSubject.id,
      topicId: geometry.id,
      questionText: 'In a right triangle ABC, angle C is 90 degrees and sin(A) = 3/5. What is the value of cos(B)?',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: 'In any right triangle where C is 90 degrees, angles A and B are complementary (A + B = 90). By the complementary angle identity, cos(B) = sin(A). Since sin(A) = 3/5, cos(B) is also 3/5.',
      options: [
        { optionLabel: 'A', optionText: '3/5', isCorrect: true },
        { optionLabel: 'B', optionText: '4/5', isCorrect: false },
        { optionLabel: 'C', optionText: '5/3', isCorrect: false },
        { optionLabel: 'D', optionText: '4/3', isCorrect: false }
      ]
    },
    {
      subjectId: mathSubject.id,
      topicId: geometry.id,
      questionText: 'A circle in the xy-plane is given by (x - 3)^2 + (y + 4)^2 = 49. What is the diameter of the circle?',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      explanation: 'The equation of a circle is (x - h)^2 + (y - k)^2 = r^2. Here r^2 = 49, so the radius r = 7. The diameter is 2 * r = 14.',
      options: [
        { optionLabel: 'A', optionText: '7', isCorrect: false },
        { optionLabel: 'B', optionText: '14', isCorrect: true },
        { optionLabel: 'C', optionText: '21', isCorrect: false },
        { optionLabel: 'D', optionText: '49', isCorrect: false }
      ]
    },

    // Reading & Writing - Information & Ideas
    {
      subjectId: rwSubject.id,
      topicId: infoIdeas.id,
      questionText: 'Researchers studying satellite telemetry noted that solar radiation pressure exerts a slight but measurable torque on long-duration orbital arrays. Over multi-year cycles, this torque compounds, altering the solar panels orientation unless periodically counteracted by momentum reaction wheels. Which choice best states the main idea of the text?',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: 'The text highlights that continuous solar radiation pressure exerts torque that alters satellite panel orientation over time, requiring active stabilization via reaction wheels.',
      options: [
        { optionLabel: 'A', optionText: 'Solar panels are poorly suited for long-duration orbital satellites.', isCorrect: false },
        { optionLabel: 'B', optionText: 'Solar radiation pressure creates rotational forces that necessitate satellite stabilization.', isCorrect: true },
        { optionLabel: 'C', optionText: 'Momentum reaction wheels consume the majority of a satellites electrical power.', isCorrect: false },
        { optionLabel: 'D', optionText: 'Telemetry signals are disrupted whenever arrays face away from direct sunlight.', isCorrect: false }
      ]
    },

    // Reading & Writing - Craft and Structure
    {
      subjectId: rwSubject.id,
      topicId: craftStructure.id,
      questionText: 'Although the initial orbital models predicted negligible atmospheric drag at 500 kilometers, atmospheric density during periods of peak solar activity proved far more volatile, prompting mission controllers to ______ their re-entry timetable.',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: 'The context indicates that unforeseen atmospheric drag occurred, compelling controllers to adjust or revise their timetable. "Recalibrate" accurately fits this scientific/procedural adjustment.',
      options: [
        { optionLabel: 'A', optionText: 'recalibrate', isCorrect: true },
        { optionLabel: 'B', optionText: 'fabricate', isCorrect: false },
        { optionLabel: 'C', optionText: 'diminish', isCorrect: false },
        { optionLabel: 'D', optionText: 'disregard', isCorrect: false }
      ]
    },

    // Reading & Writing - Expression of Ideas
    {
      subjectId: rwSubject.id,
      topicId: expressionIdeas.id,
      questionText: 'Satellites in low Earth orbit experience atmospheric friction that gradually degrades their trajectory. ______, spacecraft in geostationary orbit operate in a near-vacuum and encounter virtually no drag, enabling decades of orbital stability.',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      explanation: 'The sentence introduces a stark contrast between satellites in low Earth orbit (which face drag) and those in geostationary orbit (which face virtually no drag). "In contrast" is the correct transitional phrase.',
      options: [
        { optionLabel: 'A', optionText: 'In contrast', isCorrect: true },
        { optionLabel: 'B', optionText: 'Furthermore', isCorrect: false },
        { optionLabel: 'C', optionText: 'For instance', isCorrect: false },
        { optionLabel: 'D', optionText: 'Consequently', isCorrect: false }
      ]
    },

    // Reading & Writing - Standard English Conventions
    {
      subjectId: rwSubject.id,
      topicId: conventions.id,
      questionText: 'Equipped with ultra-sensitive optical sensors, ______ captured breathtaking high-resolution images of distant celestial bodies.',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: 'The opening participial phrase "Equipped with ultra-sensitive optical sensors" modifies the subject that immediately follows the comma. The subject must be the space observatory itself, not the astronomers or team.',
      options: [
        { optionLabel: 'A', optionText: 'the astronomers at the control center', isCorrect: false },
        { optionLabel: 'B', optionText: 'the deep-space observatory', isCorrect: true },
        { optionLabel: 'C', optionText: 'the observations made by the research crew', isCorrect: false },
        { optionLabel: 'D', optionText: 'photographs taken by the flight engineers', isCorrect: false }
      ]
    },
    {
      subjectId: rwSubject.id,
      topicId: conventions.id,
      questionText: 'The aerospace engineer inspected the telemetry data carefully; ______, she was confident the spacecraft could initiate its propulsion burn.',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      explanation: 'The semicolon connects two independent clauses. The second clause describes the resulting confidence from the inspection. "therefore" shows the proper cause-and-effect relationship.',
      options: [
        { optionLabel: 'A', optionText: 'nevertheless', isCorrect: false },
        { optionLabel: 'B', optionText: 'therefore', isCorrect: true },
        { optionLabel: 'C', optionText: 'similarly', isCorrect: false },
        { optionLabel: 'D', optionText: 'previously', isCorrect: false }
      ]
    }
  ];

  const createdQuestions = [];
  for (const qData of sampleQuestions) {
    const { options, ...qFields } = qData;
    const existingQ = await prisma.question.findFirst({
      where: { questionText: qFields.questionText }
    });

    if (!existingQ) {
      const q = await prisma.question.create({
        data: {
          ...qFields,
          createdById: admin.id,
          options: {
            create: options
          }
        },
        include: { options: true }
      });
      createdQuestions.push(q);
    } else {
      createdQuestions.push(existingQ);
    }
  }

  console.log(`✔ ${createdQuestions.length} Sample questions seeded in question bank.`);

  // 5. Seed Official Sample Exams
  const sampleExam1 = await prisma.exam.upsert({
    where: { id: 'satelite-diagnostic-exam-1' },
    update: {},
    create: {
      id: 'satelite-diagnostic-exam-1',
      title: 'SATELITE Digital SAT Full Diagnostic Exam 1',
      description: 'Comprehensive timed diagnostic assessment covering both Mathematics and Reading & Writing modules with realistic SAT timing.',
      durationMinutes: 45,
      totalQuestions: createdQuestions.length,
      isPublished: true,
      examQuestions: {
        create: createdQuestions.map((q, idx) => ({
          questionId: q.id,
          order: idx + 1
        }))
      }
    }
  });

  const mathQuestions = createdQuestions.filter(q => q.subjectId === mathSubject.id);
  if (mathQuestions.length > 0) {
    await prisma.exam.upsert({
      where: { id: 'satelite-math-intensive-1' },
      update: {},
      create: {
        id: 'satelite-math-intensive-1',
        title: 'Digital SAT Mathematics Speed Challenge',
        description: 'Targeted test focusing on Algebra, Advanced Mathematics, and Problem Solving questions.',
        durationMinutes: 30,
        totalQuestions: mathQuestions.length,
        isPublished: true,
        examQuestions: {
          create: mathQuestions.map((q, idx) => ({
            questionId: q.id,
            order: idx + 1
          }))
        }
      }
    });
  }

  console.log('✔ Sample full diagnostic exams seeded successfully.');
  console.log('🎉 [SATELITE.UZ] Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
