/**
 * SATELITE.UZ - Digital Exam Simulator Controller
 */
let currentExam = null;
let examSession = null;
let examQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = new Map(); // questionId -> selectedOptionId
let markedQuestions = new Set(); // questionId

let timerInterval = null;
let remainingSeconds = 0;
let examStartTime = 0;

// Centralized SAT Exam State Management (Spec 92)
window.examState = {
  get currentQuestion() { return currentQuestionIndex; },
  get answers() { return Object.fromEntries(userAnswers); },
  get markedQuestions() { return Array.from(markedQuestions); },
  get timeRemaining() { return remainingSeconds; },
  get calculatorOpen() { return window.SatMathTools ? !!window.SatMathTools.dom?.calcContainer?.classList.contains('open') : false; },
  get referenceSheetOpen() { return window.SatMathTools ? !!window.SatMathTools.dom?.refContainer?.classList.contains('open') : false; }
};

document.addEventListener('DOMContentLoaded', async () => {
  if (!Auth.requireAuth()) return;
  Auth.initNavbar();

  setupEventListeners();

  const urlParams = new URLSearchParams(window.location.search);
  const examId = urlParams.get('id');

  if (examId) {
    await startExam(examId);
  } else {
    await loadExamsCatalog();
  }
});

async function loadExamsCatalog() {
  const container = document.getElementById('exams-container');
  try {
    const res = await API.get('/exams');
    const exams = res.data || [];

    if (exams.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">📋</div>
          <h3 class="empty-state-title">No Timed Exams Scheduled</h3>
          <p class="empty-state-desc">Practice individual question sets in the meantime.</p>
          <a href="/practice.html" class="btn btn-primary">Start Practice</a>
        </div>
      `;
      return;
    }

    container.innerHTML = exams.map(exam => {
      const subjectTags = Object.keys(exam.subjectBreakdown || {}).map(s => 
        `<span class="badge badge-subject">${s} (${exam.subjectBreakdown[s]})</span>`
      ).join(' ');

      return `
        <div class="card card-hover" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
              ${subjectTags || '<span class="badge badge-subject">Comprehensive</span>'}
              <span class="badge badge-hard">Timed</span>
            </div>

            <h3 style="font-size: 1.3rem; margin-bottom: 10px;">${escapeHtml(exam.title)}</h3>
            <p class="text-secondary" style="font-size: 0.92rem; line-height: 1.5; margin-bottom: 20px;">
              ${escapeHtml(exam.description || 'Full digital assessment with timed modules.')}
            </p>
          </div>

          <div style="padding-top: 18px; border-top: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
            <div style="font-size: 0.88rem; color: var(--text-secondary);">
              <div>⏱️ <strong>${exam.durationMinutes}</strong> mins</div>
              <div>📝 <strong>${exam.totalQuestions}</strong> questions</div>
            </div>

            <button class="btn btn-primary" onclick="startExam('${exam.id}')">
              Start Exam →
            </button>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">⚠</div>
        <h3 class="empty-state-title">Error Loading Exams</h3>
        <p class="empty-state-desc">${err.message}</p>
      </div>
    `;
  }
}

async function startExam(examId) {
  try {
    const res = await API.post('/practice/exam/start', { examId });
    examSession = res.data.session;
    examQuestions = res.data.questions || [];

    if (examQuestions.length === 0) {
      throw new Error('This exam currently has no questions assigned.');
    }

    // Switch views
    document.getElementById('exam-catalog-view').style.display = 'none';
    document.getElementById('exam-simulator-view').style.display = 'flex';

    document.getElementById('sim-exam-title').textContent = examSession.title || 'Digital SAT Assessment';
    remainingSeconds = (examSession.durationMinutes || 45) * 60;
    examStartTime = Date.now();

    startTimer();
    renderQuestionGrid();
    renderSimulatorQuestion();
  } catch (err) {
    Toast.error(err.message || 'Failed to start exam.');
  }
}

function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();

    if (remainingSeconds <= 300) {
      document.getElementById('timer-box').classList.add('timer-warning');
    }

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      Toast.warning('Time has expired! Submitting your examination answers.');
      submitExam(true);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const formatted = [
    hours > 0 ? String(hours).padStart(2, '0') : null,
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0')
  ].filter(Boolean).join(':');

  document.getElementById('countdown-display').textContent = formatted;
}

function renderQuestionGrid() {
  const grid = document.getElementById('sim-question-grid');
  grid.innerHTML = examQuestions.map((q, idx) => {
    const isAnswered = userAnswers.has(q.id);
    const isMarked = markedQuestions.has(q.id);
    const isActive = idx === currentQuestionIndex;

    let classes = 'nav-grid-item';
    if (isActive) classes += ' active';
    if (isAnswered) classes += ' answered';
    if (isMarked) classes += ' marked';

    return `
      <div class="${classes}" onclick="jumpToQuestion(${idx})" id="grid-item-${idx}">
        ${idx + 1}
      </div>
    `;
  }).join('');

  document.getElementById('sim-answered-count').textContent = 
    `${userAnswers.size} / ${examQuestions.length} Answered`;
}

function renderSimulatorQuestion() {
  const q = examQuestions[currentQuestionIndex];
  if (!q) return;

  document.getElementById('sim-counter').textContent = 
    `Question ${currentQuestionIndex + 1} of ${examQuestions.length}`;
  document.getElementById('sim-subject-badge').textContent = 
    `${q.subject?.name || 'General'} • ${q.topic?.name || 'Topic'}`;

  document.getElementById('sim-question-text').textContent = q.questionText;

  const imgWrap = document.getElementById('sim-image-wrap');
  const imgEl = document.getElementById('sim-image');
  if (q.imageUrl) {
    imgEl.src = q.imageUrl;
    imgWrap.style.display = 'block';
  } else {
    imgWrap.style.display = 'none';
  }
  // Update Math Tools Permissions for this question (Specs 84, 94, 96)
  const isCalcAllowed = (examSession?.calculatorAllowed !== false) && (q.calculatorAllowed !== false);
  const isRefAllowed = (examSession?.referenceSheetAllowed !== false) && (q.referenceSheetAllowed !== false);

  if (window.SatMathTools) {
    SatMathTools.setPermissions({
      calculatorAllowed: isCalcAllowed,
      referenceSheetAllowed: isRefAllowed
    });
  }

  const examCalcBtn = document.getElementById('exam-calc-btn');
  const examRefBtn = document.getElementById('exam-ref-btn');
  if (examCalcBtn) {
    examCalcBtn.style.display = isCalcAllowed ? 'inline-flex' : 'none';
  }
  if (examRefBtn) {
    examRefBtn.style.display = isRefAllowed ? 'inline-flex' : 'none';
  }

  // Render options
  const selectedOptId = userAnswers.get(q.id);
  const container = document.getElementById('sim-options-container');
  container.innerHTML = q.options.map(opt => {
    const isSelected = opt.id === selectedOptId;
    return `
      <div class="option-choice ${isSelected ? 'selected' : ''}" data-id="${opt.id}" onclick="selectExamOption('${opt.id}')">
        <span class="option-badge">${opt.optionLabel}</span>
        <span class="option-text">${escapeHtml(opt.optionText)}</span>
      </div>
    `;
  }).join('');

  // Update mark for review button
  const isMarked = markedQuestions.has(q.id);
  const markBtn = document.getElementById('mark-review-btn');
  const markText = document.getElementById('mark-review-text');
  if (isMarked) {
    markBtn.classList.add('btn-secondary');
    markText.textContent = '★ Marked for Review';
  } else {
    markBtn.classList.remove('btn-secondary');
    markText.textContent = '☆ Mark for Review';
  }

  // Update prev / next buttons
  document.getElementById('sim-prev-btn').disabled = currentQuestionIndex === 0;
  const nextBtn = document.getElementById('sim-next-btn');
  if (currentQuestionIndex === examQuestions.length - 1) {
    nextBtn.textContent = 'Review & Submit';
    nextBtn.classList.add('btn-danger');
  } else {
    nextBtn.textContent = 'Next →';
    nextBtn.classList.remove('btn-danger');
  }

  renderQuestionGrid();
}

function selectExamOption(optionId) {
  const q = examQuestions[currentQuestionIndex];
  userAnswers.set(q.id, optionId);
  renderSimulatorQuestion();
}

function clearCurrentChoice() {
  const q = examQuestions[currentQuestionIndex];
  userAnswers.delete(q.id);
  renderSimulatorQuestion();
}

function toggleMarkForReview() {
  const q = examQuestions[currentQuestionIndex];
  if (markedQuestions.has(q.id)) {
    markedQuestions.delete(q.id);
  } else {
    markedQuestions.add(q.id);
  }
  renderSimulatorQuestion();
}

function jumpToQuestion(idx) {
  if (idx >= 0 && idx < examQuestions.length) {
    currentQuestionIndex = idx;
    renderSimulatorQuestion();
  }
}

function nextQuestion() {
  if (currentQuestionIndex < examQuestions.length - 1) {
    currentQuestionIndex++;
    renderSimulatorQuestion();
  } else {
    openSubmitModal();
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderSimulatorQuestion();
  }
}

function openSubmitModal() {
  const answered = userAnswers.size;
  const total = examQuestions.length;
  const unanswered = total - answered;

  const modal = document.getElementById('submit-confirm-modal');
  const summary = document.getElementById('submit-summary-text');

  summary.innerHTML = `
    You have answered <strong>${answered}</strong> of <strong>${total}</strong> questions.<br>
    ${unanswered > 0 ? `<span style="color: var(--danger);">⚠️ ${unanswered} question(s) are unanswered and will be marked as skipped.</span>` : '<span style="color: var(--success);">✔ All questions have been answered.</span>'}
    <br><br>
    Once submitted, your final score and detailed performance telemetry will be generated.
  `;

  modal.classList.add('active');
}

function closeSubmitModal() {
  document.getElementById('submit-confirm-modal').classList.remove('active');
}

async function submitExam(isAutoSubmit = false) {
  if (timerInterval) clearInterval(timerInterval);

  const confirmBtn = document.getElementById('confirm-submit-btn');
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Scoring Exam...';
  }

  const durationSeconds = Math.round((Date.now() - examStartTime) / 1000);

  const formattedAnswers = [];
  userAnswers.forEach((selectedOptionId, questionId) => {
    formattedAnswers.push({ questionId, selectedOptionId });
  });

  try {
    const res = await API.post(`/practice/exam/${examSession.id}/submit`, {
      answers: formattedAnswers,
      durationSeconds
    });

    Toast.success('Exam submitted successfully!');
    setTimeout(() => {
      window.location.href = `/results.html?id=${examSession.id}`;
    }, 600);
  } catch (err) {
    Toast.error(err.message || 'Error submitting exam.');
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Retry Submission';
    }
  }
}

function setupEventListeners() {
  document.getElementById('sim-prev-btn').addEventListener('click', prevQuestion);
  document.getElementById('sim-next-btn').addEventListener('click', nextQuestion);
  document.getElementById('sim-clear-btn').addEventListener('click', clearCurrentChoice);
  document.getElementById('mark-review-btn').addEventListener('click', toggleMarkForReview);
  document.getElementById('submit-exam-trigger-btn').addEventListener('click', openSubmitModal);
  document.getElementById('confirm-submit-btn').addEventListener('click', () => submitExam(false));

  const examCalcBtn = document.getElementById('exam-calc-btn');
  if (examCalcBtn) {
    examCalcBtn.addEventListener('click', () => {
      if (window.SatMathTools) SatMathTools.toggleCalculator();
    });
  }

  const examRefBtn = document.getElementById('exam-ref-btn');
  if (examRefBtn) {
    examRefBtn.addEventListener('click', () => {
      if (window.SatMathTools) SatMathTools.toggleReferenceSheet();
    });
  }

  window.addEventListener('satelite:tools_state_change', (e) => {
    const detail = e.detail || {};
    if (examCalcBtn) examCalcBtn.classList.toggle('active', !!detail.calculatorOpen);
    if (examRefBtn) examRefBtn.classList.toggle('active', !!detail.referenceSheetOpen);
  });

  const simContainer = document.getElementById('sim-options-container');
  if (simContainer) {
    simContainer.addEventListener('click', (e) => {
      const choice = e.target.closest('.option-choice');
      if (!choice || choice.classList.contains('disabled')) return;
      const optionId = choice.dataset.id;
      if (optionId) {
        selectExamOption(optionId);
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

window.startExam = startExam;
window.jumpToQuestion = jumpToQuestion;
window.selectExamOption = selectExamOption;
window.closeSubmitModal = closeSubmitModal;
