/**
 * SATELITE.UZ - Interactive Practice Mode Controller
 */
let session = null;
let questions = [];
let currentIndex = 0;
let selectedOptionId = null;
let answeredQuestions = new Map(); // questionId -> answerResult
let sessionStartTime = Date.now();

document.addEventListener('DOMContentLoaded', async () => {
  if (!Auth.requireAuth()) return;
  Auth.initNavbar();

  setupEventListeners();
  await initSession();
});

async function initSession() {
  const urlParams = new URLSearchParams(window.location.search);
  const singleQuestionId = urlParams.get('id');
  const subjectSlug = urlParams.get('subject');

  try {
    let subjectId = null;
    if (subjectSlug) {
      const subjectsRes = await API.get('/subjects');
      const found = (subjectsRes.data || []).find(s => s.slug === subjectSlug);
      if (found) subjectId = found.id;
    }

    if (singleQuestionId) {
      // Fetch specific question details
      const qRes = await API.get(`/questions/${singleQuestionId}`);
      const q = qRes.data;
      if (!q) throw new Error('Question not found');

      // Create a lightweight practice session for it
      const startRes = await API.post('/practice/start', {
        subjectId: q.subjectId,
        count: 1
      });
      session = startRes.data.session;
      questions = [q];
    } else {
      // Start regular practice session
      const startRes = await API.post('/practice/start', {
        subjectId,
        count: 10
      });
      session = startRes.data.session;
      questions = startRes.data.questions || [];
    }

    if (questions.length === 0) {
      throw new Error('No practice questions available for the selected topic.');
    }

    document.getElementById('practice-loading').style.display = 'none';
    document.getElementById('practice-workspace').style.display = 'block';
    renderCurrentQuestion();
  } catch (err) {
    document.getElementById('practice-loading').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠</div>
        <h3 class="empty-state-title">Unable to Start Practice</h3>
        <p class="empty-state-desc">${err.message || 'Please try again later.'}</p>
        <a href="/question-bank.html" class="btn btn-primary">Browse Question Bank</a>
      </div>
    `;
  }
}

function renderCurrentQuestion() {
  const q = questions[currentIndex];
  if (!q) return;

  selectedOptionId = null;
  const isAlreadyAnswered = answeredQuestions.has(q.id);
  const previousResult = answeredQuestions.get(q.id);

  // Meta bar
  document.getElementById('q-counter').textContent = `Question ${currentIndex + 1} / ${questions.length}`;
  document.getElementById('q-subject').textContent = q.subject?.name || 'Subject';
  document.getElementById('q-topic').textContent = q.topic?.name || 'Topic';

  const diffEl = document.getElementById('q-difficulty');
  diffEl.textContent = q.difficulty;
  diffEl.className = `badge badge-${q.difficulty.toLowerCase()}`;

  // Bookmark status
  updateBookmarkButton(!!q.isBookmarked);

  // Question text & image
  document.getElementById('q-text').textContent = q.questionText;

  const imgWrap = document.getElementById('q-image-wrap');
  const imgEl = document.getElementById('q-image');
  if (q.imageUrl) {
    imgEl.src = q.imageUrl;
    imgWrap.style.display = 'block';
  } else {
    imgWrap.style.display = 'none';
  }

  // Answer options
  const container = document.getElementById('options-container');
  container.innerHTML = q.options.map(opt => {
    let classes = 'option-choice';
    if (isAlreadyAnswered) {
      classes += ' disabled';
      if (opt.id === previousResult.correctOptionId) {
        classes += ' correct';
      } else if (opt.id === previousResult.selectedOptionId && !previousResult.isCorrect) {
        classes += ' incorrect';
      }
    }

    return `
      <div class="${classes}" data-id="${opt.id}" onclick="selectOption('${opt.id}')">
        <span class="option-badge">${opt.optionLabel}</span>
        <span class="option-text">${escapeHtml(opt.optionText)}</span>
      </div>
    `;
  }).join('');

  // Explanation container
  const explContainer = document.getElementById('explanation-container');
  if (isAlreadyAnswered) {
    showExplanation(previousResult.isCorrect, previousResult.explanation, previousResult.correctOptionLabel);
    explContainer.style.display = 'block';
    document.getElementById('submit-answer-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'inline-flex';
    document.getElementById('next-btn').textContent = currentIndex === questions.length - 1 ? 'Finish Session' : 'Continue →';
  } else {
    explContainer.style.display = 'none';
    document.getElementById('submit-answer-btn').style.display = 'inline-flex';
    document.getElementById('submit-answer-btn').disabled = true;
    document.getElementById('next-btn').style.display = 'none';
  }

  // Navigation button states
  document.getElementById('prev-btn').disabled = currentIndex === 0;
  document.getElementById('skip-btn').style.display = isAlreadyAnswered ? 'none' : 'inline-flex';
}

function selectOption(optionId) {
  const q = questions[currentIndex];
  if (answeredQuestions.has(q.id)) return; // Already locked

  selectedOptionId = optionId;

  document.querySelectorAll('.option-choice').forEach(el => {
    if (el.dataset.id === optionId) {
      el.classList.add('selected');
    } else {
      el.classList.remove('selected');
    }
  });

  document.getElementById('submit-answer-btn').disabled = false;
}

async function submitAnswer() {
  const q = questions[currentIndex];
  if (!selectedOptionId || answeredQuestions.has(q.id)) return;

  const submitBtn = document.getElementById('submit-answer-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Checking...';

  try {
    const res = await API.post(`/practice/${session.id}/answer`, {
      questionId: q.id,
      selectedOptionId
    });

    const result = {
      ...res.data,
      selectedOptionId
    };

    answeredQuestions.set(q.id, result);

    // Update choices styling
    document.querySelectorAll('.option-choice').forEach(el => {
      el.classList.add('disabled');
      if (el.dataset.id === result.correctOptionId) {
        el.classList.add('correct');
      } else if (el.dataset.id === selectedOptionId && !result.isCorrect) {
        el.classList.add('incorrect');
      }
    });

    // Show Explanation Card
    showExplanation(result.isCorrect, result.explanation, result.correctOptionLabel);
    document.getElementById('explanation-container').style.display = 'block';

    submitBtn.style.display = 'none';
    submitBtn.textContent = 'Submit Answer';

    const nextBtn = document.getElementById('next-btn');
    nextBtn.style.display = 'inline-flex';
    nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish Session' : 'Continue →';

    document.getElementById('skip-btn').style.display = 'none';
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Answer';
    Toast.error(err.message || 'Error submitting answer.');
  }
}

function showExplanation(isCorrect, explanationText, correctLabel) {
  const container = document.getElementById('explanation-container');
  const boxClass = isCorrect ? 'correct-box' : 'incorrect-box';
  const icon = isCorrect ? '✔' : '✖';
  const title = isCorrect ? 'Correct! Excellent deduction.' : `Incorrect. The correct answer was (${correctLabel || 'B'}).`;

  container.className = `explanation-card ${boxClass}`;
  container.innerHTML = `
    <div class="explanation-title" style="color: ${isCorrect ? 'var(--success)' : 'var(--danger)'};">
      <span>${icon}</span>
      <span>${title}</span>
    </div>
    <div class="explanation-body">
      <strong>Explanation:</strong> ${escapeHtml(explanationText || 'Refer to the core topic formulas and deductive rules.')}
    </div>
  `;
}

async function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderCurrentQuestion();
    window.scrollTo({ top: 100, behavior: 'smooth' });
  } else {
    // Complete session
    await completeSession();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderCurrentQuestion();
    window.scrollTo({ top: 100, behavior: 'smooth' });
  }
}

async function skipQuestion() {
  const q = questions[currentIndex];
  answeredQuestions.set(q.id, {
    isCorrect: false,
    selectedOptionId: null,
    explanation: 'Question was skipped.'
  });

  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderCurrentQuestion();
  } else {
    await completeSession();
  }
}

async function completeSession() {
  const durationSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
  try {
    const res = await API.post(`/practice/${session.id}/complete`, { durationSeconds });
    Toast.success('Session completed!');
    setTimeout(() => {
      window.location.href = `/results.html?id=${session.id}`;
    }, 600);
  } catch (err) {
    // Fallback redirect
    window.location.href = `/results.html?id=${session.id}`;
  }
}

function updateBookmarkButton(isBookmarked) {
  const icon = document.getElementById('bookmark-icon');
  const btn = document.getElementById('q-bookmark-btn');
  if (isBookmarked) {
    icon.textContent = '★';
    icon.style.color = '#f59e0b';
    btn.classList.add('btn-secondary');
  } else {
    icon.textContent = '☆';
    icon.style.color = 'inherit';
    btn.classList.remove('btn-secondary');
  }
}

async function toggleCurrentBookmark() {
  const q = questions[currentIndex];
  if (!q) return;

  const isBookmarked = !!q.isBookmarked;
  try {
    if (isBookmarked) {
      await API.delete(`/bookmarks/${q.id}`);
      q.isBookmarked = false;
      updateBookmarkButton(false);
      Toast.info('Bookmark removed.');
    } else {
      await API.post('/bookmarks', { questionId: q.id });
      q.isBookmarked = true;
      updateBookmarkButton(true);
      Toast.success('Question saved to bookmarks.');
    }
  } catch (err) {
    Toast.error(err.message || 'Bookmark action failed.');
  }
}

function setupEventListeners() {
  document.getElementById('submit-answer-btn').addEventListener('click', submitAnswer);
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('prev-btn').addEventListener('click', prevQuestion);
  document.getElementById('skip-btn').addEventListener('click', skipQuestion);
  document.getElementById('q-bookmark-btn').addEventListener('click', toggleCurrentBookmark);

  // Robust container-level click delegation for choice variants
  const optionsContainer = document.getElementById('options-container');
  if (optionsContainer) {
    optionsContainer.addEventListener('click', (e) => {
      const choice = e.target.closest('.option-choice');
      if (!choice || choice.classList.contains('disabled')) return;
      const optionId = choice.dataset.id;
      if (optionId) {
        selectOption(optionId);
      }
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}

window.selectOption = selectOption;
