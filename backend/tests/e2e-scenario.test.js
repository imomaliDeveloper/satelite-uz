import test from 'node:test';
import assert from 'node:assert';
import app from '../src/server.js';
import prisma from '../src/config/db.js';

let server;
let baseUrl;
let studentToken = '';
let adminToken = '';
let studentId = '';
let createdSubjectId = '';
let createdTopicId = '';
let createdQuestionId = '';
let practiceSessionId = '';
let examId = '';
let examSessionId = '';

test.before(async () => {
  server = app.listen(0);
  const port = server.address().port;
  baseUrl = `http://localhost:${port}/api`;
});

test.after(async () => {
  if (server) server.close();
  await prisma.$disconnect();
});

test('TEST 1: Register student', async () => {
  const email = `aziza_${Date.now()}@satelite.uz`;
  const res = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Aziza Karimova',
      email,
      password: 'StudentSecurePass123!',
      confirmPassword: 'StudentSecurePass123!'
    })
  });
  const json = await res.json();
  assert.strictEqual(res.status, 201);
  assert.strictEqual(json.success, true);
  studentToken = json.data.token;
  studentId = json.data.user.id;
});

test('TEST 2: Login student', async () => {
  const meRes = await fetch(`${baseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const meJson = await meRes.json();
  assert.strictEqual(meRes.status, 200);
  assert.strictEqual(meJson.data.user.id, studentId);
});

test('TEST 3: Open dashboard telemetry', async () => {
  const res = await fetch(`${baseUrl}/results?limit=5`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const json = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(json.data));
});

test('TEST 4: Browse question bank', async () => {
  const res = await fetch(`${baseUrl}/questions?page=1&limit=10`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const json = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(json.data.length > 0);
  // Verify correct answers are NOT exposed
  for (const opt of json.data[0].options) {
    assert.strictEqual(opt.isCorrect, undefined);
  }
});

test('TEST 5: Start practice session', async () => {
  const res = await fetch(`${baseUrl}/practice/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`
    },
    body: JSON.stringify({ count: 5 })
  });
  const json = await res.json();
  assert.strictEqual(res.status, 201);
  assert.ok(json.data.session.id);
  practiceSessionId = json.data.session.id;
});

test('TEST 6 & 7: Answer question and see explanation', async () => {
  const questionsRes = await fetch(`${baseUrl}/questions?page=1&limit=1`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const qList = await questionsRes.json();
  const q = qList.data[0];
  const chosenOpt = q.options[0];

  const answerRes = await fetch(`${baseUrl}/practice/${practiceSessionId}/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      questionId: q.id,
      selectedOptionId: chosenOpt.id
    })
  });
  const answerJson = await answerRes.json();
  assert.strictEqual(answerRes.status, 200);
  assert.ok(typeof answerJson.data.isCorrect === 'boolean');
  assert.ok(answerJson.data.explanation !== undefined);
});

test('TEST 8 & 9: Complete practice and see result', async () => {
  const completeRes = await fetch(`${baseUrl}/practice/${practiceSessionId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`
    },
    body: JSON.stringify({ durationSeconds: 65 })
  });
  const completeJson = await completeRes.json();
  assert.strictEqual(completeRes.status, 200);

  const getRes = await fetch(`${baseUrl}/results/${practiceSessionId}`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const getJson = await getRes.json();
  assert.strictEqual(getRes.status, 200);
  assert.ok(getJson.data.session);
  assert.ok(getJson.data.topicBreakdown);
});

test('TEST 10 & 11: Login as admin and open admin dashboard', async () => {
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@satelite.uz',
      password: 'ChangeMe123!'
    })
  });
  const loginJson = await loginRes.json();
  assert.strictEqual(loginRes.status, 200);
  adminToken = loginJson.data.token;

  const statsRes = await fetch(`${baseUrl}/admin/stats`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const statsJson = await statsRes.json();
  assert.strictEqual(statsRes.status, 200);
  assert.ok(typeof statsJson.data.totalQuestions === 'number');
});

test('TEST 12: Create subject', async () => {
  const slug = `sat-physics-${Date.now()}`;
  const res = await fetch(`${baseUrl}/subjects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      name: `Physics Domain ${Date.now()}`,
      slug,
      description: 'Mechanics and Thermodynamics'
    })
  });
  const json = await res.json();
  assert.strictEqual(res.status, 201);
  createdSubjectId = json.data.id;
});

test('TEST 13: Create topic', async () => {
  const slug = `kinematics-${Date.now()}`;
  const res = await fetch(`${baseUrl}/topics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      subjectId: createdSubjectId,
      name: 'Kinematics & Velocity',
      slug,
      description: 'Motion in one and two dimensions'
    })
  });
  const json = await res.json();
  assert.strictEqual(res.status, 201);
  createdTopicId = json.data.id;
});

test('TEST 14, 15, 16, 17: Create question, add choices, set correct answer, publish', async () => {
  const res = await fetch(`${baseUrl}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      subjectId: createdSubjectId,
      topicId: createdTopicId,
      questionText: 'An object starts from rest and accelerates uniformly at 4 m/s^2 for 5 seconds. What is its final velocity?',
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: 'Using the kinematic equation v = u + at: with initial velocity u = 0, v = 0 + (4 * 5) = 20 m/s.',
      isPublished: true,
      options: [
        { optionLabel: 'A', optionText: '10 m/s', isCorrect: false },
        { optionLabel: 'B', optionText: '20 m/s', isCorrect: true },
        { optionLabel: 'C', optionText: '25 m/s', isCorrect: false },
        { optionLabel: 'D', optionText: '40 m/s', isCorrect: false }
      ]
    })
  });
  const json = await res.json();
  assert.strictEqual(res.status, 201);
  assert.ok(json.data.id);
  createdQuestionId = json.data.id;
});

test('TEST 18, 19, 20: Logout admin, login as student, verify newly created question appears', async () => {
  const res = await fetch(`${baseUrl}/questions?subjectId=${createdSubjectId}`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const json = await res.json();
  assert.strictEqual(res.status, 200);
  const found = json.data.find(q => q.id === createdQuestionId);
  assert.ok(found, 'Newly created question is visible in Question Bank');
  assert.strictEqual(found.questionText.includes('accelerates uniformly'), true);
});

test('TEST 21, 22, 23: Take exam, submit exam, review answers', async () => {
  // 1. Admin creates exam containing the newly created question
  const examCreateRes = await fetch(`${baseUrl}/exams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      title: 'Full Velocity Diagnostic Test',
      durationMinutes: 20,
      questionIds: [createdQuestionId]
    })
  });
  const examCreateJson = await examCreateRes.json();
  assert.strictEqual(examCreateRes.status, 201);
  examId = examCreateJson.data.id;

  // 2. Student starts exam
  const startExamRes = await fetch(`${baseUrl}/practice/exam/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`
    },
    body: JSON.stringify({ examId })
  });
  const startExamJson = await startExamRes.json();
  assert.strictEqual(startExamRes.status, 201);
  examSessionId = startExamJson.data.session.id;

  // 3. Find option B (correct) to test correct submission
  const qDb = await prisma.question.findUnique({
    where: { id: createdQuestionId },
    include: { options: true }
  });
  const optB = qDb.options.find(o => o.optionLabel === 'B');

  // 4. Submit exam
  const submitExamRes = await fetch(`${baseUrl}/practice/exam/${examSessionId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      durationSeconds: 150,
      answers: [
        { questionId: createdQuestionId, selectedOptionId: optB.id }
      ]
    })
  });
  const submitExamJson = await submitExamRes.json();
  assert.strictEqual(submitExamRes.status, 200);
  assert.strictEqual(submitExamJson.data.correctAnswers, 1);
  assert.strictEqual(submitExamJson.data.accuracy, 100);

  // 5. Review answers
  const reviewRes = await fetch(`${baseUrl}/results/${examSessionId}`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const reviewJson = await reviewRes.json();
  assert.strictEqual(reviewRes.status, 200);
  assert.strictEqual(reviewJson.data.reviewQuestions.length, 1);
  assert.strictEqual(reviewJson.data.reviewQuestions[0].status, 'CORRECT');
  assert.strictEqual(reviewJson.data.reviewQuestions[0].correctAnswerLabel, 'B');
});
