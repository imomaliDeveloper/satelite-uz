import prisma from '../config/db.js';

export const getCsvTemplate = (req, res) => {
  const csvHeaders = 'subject,topic,question,optionA,optionB,optionC,optionD,correctAnswer,difficulty,explanation\n';
  const sampleRow1 = '"Math","Algebra","If 3x + 7 = 22, what is the value of x?","3","5","7","15","B","EASY","Subtract 7 from both sides to get 3x = 15, then divide by 3 to get x = 5."\n';
  const sampleRow2 = '"Reading","Information and Ideas","Which choice best describes the central theme of the passage?","Technological advancement","Scientific curiosity","The importance of biodiversity","Economic reform","C","MEDIUM","The passage predominantly explores ecosystem resilience and species variation."\n';

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="satelite_questions_template.csv"');
  res.status(200).send(csvHeaders + sampleRow1 + sampleRow2);
};

export const importQuestions = async (req, res, next) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No questions provided for import.',
        error: 'NO_QUESTIONS_PROVIDED'
      });
    }

    const imported = [];
    const errors = [];

    for (let i = 0; i < questions.length; i++) {
      const item = questions[i];
      try {
        if (!item.subjectName || !item.topicName || !item.questionText || !item.correctAnswer) {
          throw new Error('Missing required fields (subjectName, topicName, questionText, correctAnswer)');
        }

        // Find or create subject
        const subjectSlug = item.subjectName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const subject = await prisma.subject.upsert({
          where: { slug: subjectSlug },
          update: {},
          create: {
            name: item.subjectName,
            slug: subjectSlug
          }
        });

        // Find or create topic
        const topicSlug = item.topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const topic = await prisma.topic.upsert({
          where: {
            subjectId_slug: { subjectId: subject.id, slug: topicSlug }
          },
          update: {},
          create: {
            subjectId: subject.id,
            name: item.topicName,
            slug: topicSlug
          }
        });

        // Answer options
        const rawOptions = item.options || [
          { optionLabel: 'A', optionText: item.optionA },
          { optionLabel: 'B', optionText: item.optionB },
          { optionLabel: 'C', optionText: item.optionC },
          { optionLabel: 'D', optionText: item.optionD }
        ].filter(opt => opt.optionText);

        const correctLabel = String(item.correctAnswer).trim().toUpperCase();

        const createdQ = await prisma.question.create({
          data: {
            subjectId: subject.id,
            topicId: topic.id,
            questionText: item.questionText,
            questionType: item.questionType || 'MULTIPLE_CHOICE',
            difficulty: ['EASY', 'MEDIUM', 'HARD'].includes(item.difficulty?.toUpperCase()) ? item.difficulty.toUpperCase() : 'MEDIUM',
            explanation: item.explanation || null,
            isPublished: true,
            createdById: req.user.id,
            options: {
              create: rawOptions.map(opt => ({
                optionLabel: opt.optionLabel.toUpperCase(),
                optionText: opt.optionText,
                isCorrect: opt.optionLabel.toUpperCase() === correctLabel
              }))
            }
          }
        });

        imported.push(createdQ.id);
      } catch (err) {
        errors.push({ row: i + 1, error: err.message });
      }
    }

    res.json({
      success: true,
      message: `Successfully imported ${imported.length} questions. ${errors.length} failed.`,
      data: {
        importedCount: imported.length,
        errorsCount: errors.length,
        errors
      }
    });
  } catch (error) {
    next(error);
  }
};
