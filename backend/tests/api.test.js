import test from 'node:test';
import assert from 'node:assert';
import app from '../src/server.js';
import prisma from '../src/config/db.js';

let server;
let baseUrl;
let studentToken = '';
let adminToken = '';
let studentUserId = '';
let testQuestionId = '';
let testPracticeSessionId = '';
let testSubjectId = '';
let testTopicId = '';
let testExamId = '';

test.before(async () => {
  // Start server on dynamic port
  server = app.listen(0);
  const port = server.address().port;
  baseUrl = `http://localhost:${port}/api`;
});

test.after(async () => {
  if (server) {
    server.close();
  }
  await prisma.$disconnect();
});

test('1. POST /api/auth/register - Register a new student', async () => {
  const uniqueEmail = `student_${Date.now()}@satelite.uz`;
  const res = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Student',
      email: uniqueEmail,
      password: 'StrongPassword123!',
      confirmPassword: 'StrongPassword123!'
    })
  });

  const json = await res.json();
  assert.strictEqual(res.status, 201);
  assert.strictEqual(json.success, true);
  assert.ok(json.data.token);
  assert.strictEqual(json.data.user.role, 'STUDENT');

  studentToken = json.data.token;
  studentUserId = json.data.user.id;
});

test('2. POST /api/auth/login - Admin Login', async () => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@satelite.uz',
      password: 'ChangeMe123!'
    })
  });

  const json = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(json.success, true);
  assert.ok(json.data.token);
  assert.strictEqual(json.data.user.role, 'ADMIN');

  adminToken = json.data.token;
});

test('3. GET /api/auth/me - Protected Route Verification', async () => {
  // Missing token
  const unauthRes = await fetch(`${baseUrl}/auth/me`);
  assert.strictEqual(unauthRes.status, 401);

  // Valid token
  const authRes = await fetch(`${baseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const json = await authRes.json();
  assert.strictEqual(authRes.status, 200);
  assert.strictEqual(json.data.user.id, studentUserId);
});

test('4. Admin Authorization Guard - Student cannot access admin stats', async () => {
  const res = await fetch(`${baseUrl}/admin/stats`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  assert.strictEqual(res.status, 403);
});

test('5. Admin Authorization Guard - Admin can access admin stats', async () => {
  const res = await fetch(`${baseUrl}/admin/stats`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const json = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(json.success, true);
  assert.ok(typeof json.data.totalQuestions === 'number');
});

test('6. POST /api/questions - Admin creates a new question', async () => {
  const subject = await prisma.subject.findFirst();
  const topic = await prisma.topic.findFirst();
  assert.ok(subject, 'Subject exists');
  assert.ok(topic, 'Topic exists');
  testSubjectId = subject.id;
  testTopicId = topic.id;

  const res = await fetch(`${baseUrl}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      subjectId: subject.id,
      topicId: topic.id,
      questionText: 'What is the speed of light in vacuum approximately (in m/s)?',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: 'The speed of light in vacuum is approximately 3.0 x 10^8 m/s.',
      isPublished: true,
      options: [
        { optionLabel: 'A', optionText: '3.0 x 10^6 m/s', isCorrect: false },
        { optionLabel: 'B', optionText: '3.0 x 10^8 m/s', isCorrect: true },
        { optionLabel: 'C', optionText: '1.5 x 10^8 m/s', isCorrect: false },
        { optionLabel: 'D', optionText: '3.0 x 10^10 m/s', isCorrect: false }
      ]
    })
  });

  const json = await res.json();
  assert.strictEqual(res.status, 201);
  assert.strictEqual(json.success, true);
  assert.ok(json.data.id);
  testQuestionId = json.data.id;
});

test('7. PATCH /api/questions/:id - Admin edits a question', async () => {
  const res = await fetch(`${baseUrl}/questions/${testQuestionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      difficulty: 'HARD',
      explanation: 'Updated explanation: The speed of light is 299,792,458 m/s.'
    })
  });

  const json = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(json.data.difficulty, 'HARD');
});

test('8. GET /api/questions - Student cannot see correct answers before answering', async () => {
  const res = await fetch(`${baseUrl}/questions`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const json = await res.json();
  assert.strictEqual(res.status, 200);

  const foundQ = json.data.find(q => q.id === testQuestionId);
  assert.ok(foundQ);
  // Options for student should NOT have isCorrect exposed or should be false
  for (const opt of foundQ.options) {
    assert.strictEqual(opt.isCorrect, undefined);
  }
});

test('9. POST /api/practice/start - Student starts a practice session', async () => {
  const res = await fetch(`${baseUrl}/practice/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      subjectId: testSubjectId,
      count: 5
    })
  });

  const json = await res.json();
  assert.strictEqual(res.status, 201);
  assert.ok(json.data.session.id);
  assert.ok(json.data.questions.length > 0);
  testPracticeSessionId = json.data.session.id;
});

test('10. POST /api/practice/:id/answer - Student submits an answer', async () => {
  // Get the question options directly to test correct response
  const q = await prisma.question.findUnique({
    where: { id: testQuestionId },
    include: { options: true }
  });
  const correctOpt = q.options.find(o => o.isCorrect);

  const res = await fetch(`${baseUrl}/practice/${testPracticeSessionId}/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      questionId: testQuestionId,
      selectedOptionId: correctOpt.id
    })
  });

  const json = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(json.data.isCorrect, true);
  assert.strictEqual(json.data.correctOptionId, correctOpt.id);
  assert.ok(json.data.explanation);
});

test('11. POST /api/practice/:id/complete - Student finishes practice session', async () => {
  const res = await fetch(`${baseUrl}/practice/${testPracticeSessionId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      durationSeconds: 120
    })
  });

  const json = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(json.success, true);
  assert.ok(json.data.topicBreakdown);
});

test('12. POST /api/bookmarks - Student bookmarks and unbookmarks a question', async () => {
  // Add bookmark
  const addRes = await fetch(`${baseUrl}/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`
    },
    body: JSON.stringify({ questionId: testQuestionId })
  });
  const addJson = await addRes.json();
  assert.strictEqual(addRes.status, 201);

  // List bookmarks
  const listRes = await fetch(`${baseUrl}/bookmarks`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const listJson = await listRes.json();
  assert.strictEqual(listRes.status, 200);
  assert.ok(listJson.data.some(b => b.question.id === testQuestionId));

  // Remove bookmark
  const delRes = await fetch(`${baseUrl}/bookmarks/${testQuestionId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  assert.strictEqual(delRes.status, 200);
});

test('13. POST /api/exams - Admin creates an exam & Student submits exam', async () => {
  const questions = await prisma.question.findMany({ take: 3 });
  const qIds = questions.map(q => q.id);

  // Admin creates exam
  const examRes = await fetch(`${baseUrl}/exams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      title: 'Automated Test Mini Exam',
      description: 'Exam created during automated test run',
      durationMinutes: 15,
      questionIds: qIds
    })
  });
  const examJson = await examRes.json();
  assert.strictEqual(examRes.status, 201);
  testExamId = examJson.data.id;

  // Student starts exam session
  const startRes = await fetch(`${baseUrl}/practice/exam/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`
    },
    body: JSON.stringify({ examId: testExamId })
  });
  const startJson = await startRes.json();
  assert.strictEqual(startRes.status, 201);
  const examSessionId = startJson.data.session.id;

  // Student submits exam
  const submitRes = await fetch(`${baseUrl}/practice/exam/${examSessionId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      durationSeconds: 300,
      answers: [
        { questionId: qIds[0], selectedOptionId: 'dummy-option' }
      ]
    })
  });
  const submitJson = await submitRes.json();
  assert.strictEqual(submitRes.status, 200);
  assert.strictEqual(submitJson.success, true);
  assert.ok(submitJson.data.score);
});

test('14. DELETE /api/questions/:id - Admin deletes a question', async () => {
  const res = await fetch(`${baseUrl}/questions/${testQuestionId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const json = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(json.success, true);
});
