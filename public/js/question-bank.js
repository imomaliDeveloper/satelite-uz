/**
 * SATELITE.UZ - Question Bank Controller
 */
let currentPage = 1;
let currentLimit = 12;
let searchDebounceTimer = null;
let currentQuestions = [];

document.addEventListener('DOMContentLoaded', async () => {
  Auth.initNavbar();
  await loadFilterOptions();
  setupFilterListeners();
  loadQuestions();
});

async function loadFilterOptions() {
  try {
    const res = await API.get('/subjects');
    const subjects = res.data || [];
    const subjectSelect = document.getElementById('subject-filter');

    subjects.forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub.id;
      opt.textContent = sub.name;
      subjectSelect.appendChild(opt);
    });
  } catch (err) {
    console.error('Failed to load subjects:', err);
  }
}

async function loadTopicsForSubject(subjectId) {
  const topicSelect = document.getElementById('topic-filter');
  topicSelect.innerHTML = '<option value="">All Topics</option>';
  if (!subjectId) return;

  try {
    const res = await API.get(`/topics?subjectId=${subjectId}`);
    const topics = res.data || [];
    topics.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.name;
      topicSelect.appendChild(opt);
    });
  } catch (err) {
    console.error('Failed to load topics:', err);
  }
}

function setupFilterListeners() {
  const searchInput = document.getElementById('search-input');
  const subjectFilter = document.getElementById('subject-filter');
  const topicFilter = document.getElementById('topic-filter');
  const difficultyFilter = document.getElementById('difficulty-filter');
  const typeFilter = document.getElementById('type-filter');
  const sortFilter = document.getElementById('sort-filter');
  const prevBtn = document.getElementById('prev-page-btn');
  const nextBtn = document.getElementById('next-page-btn');

  searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      currentPage = 1;
      loadQuestions();
    }, 350);
  });

  subjectFilter.addEventListener('change', () => {
    loadTopicsForSubject(subjectFilter.value);
    currentPage = 1;
    loadQuestions();
  });

  topicFilter.addEventListener('change', () => {
    currentPage = 1;
    loadQuestions();
  });

  difficultyFilter.addEventListener('change', () => {
    currentPage = 1;
    loadQuestions();
  });

  typeFilter.addEventListener('change', () => {
    currentPage = 1;
    loadQuestions();
  });

  sortFilter.addEventListener('change', () => {
    currentPage = 1;
    loadQuestions();
  });

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadQuestions();
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  });

  nextBtn.addEventListener('click', () => {
    currentPage++;
    loadQuestions();
    window.scrollTo({ top: 200, behavior: 'smooth' });
  });
}

async function loadQuestions() {
  const container = document.getElementById('questions-container');
  container.innerHTML = `
    <div class="skeleton" style="height: 220px;"></div>
    <div class="skeleton" style="height: 220px;"></div>
    <div class="skeleton" style="height: 220px;"></div>
  `;

  const search = document.getElementById('search-input').value.trim();
  const subjectId = document.getElementById('subject-filter').value;
  const topicId = document.getElementById('topic-filter').value;
  const difficulty = document.getElementById('difficulty-filter').value;
  const questionType = document.getElementById('type-filter').value;
  const sortBy = document.getElementById('sort-filter').value;

  const params = new URLSearchParams({
    page: currentPage,
    limit: currentLimit,
    sortBy
  });

  if (search) params.append('search', search);
  if (subjectId) params.append('subjectId', subjectId);
  if (topicId) params.append('topicId', topicId);
  if (difficulty) params.append('difficulty', difficulty);
  if (questionType) params.append('questionType', questionType);

  try {
    const res = await API.get(`/questions?${params.toString()}`);
    currentQuestions = res.data || [];
    renderQuestions(currentQuestions, res.pagination);
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">⚠</div>
        <h3 class="empty-state-title">Failed to load questions</h3>
        <p class="empty-state-desc">${err.message || 'Please check your connection and try again.'}</p>
        <button class="btn btn-secondary" onclick="loadQuestions()">Retry</button>
      </div>
    `;
  }
}

function renderQuestions(questions, pagination) {
  const container = document.getElementById('questions-container');
  const paginationBar = document.getElementById('pagination-bar');

  if (questions.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">🔍</div>
        <h3 class="empty-state-title">No questions found</h3>
        <p class="empty-state-desc">Try clearing your filters or searching for different keywords.</p>
        <button class="btn btn-outline" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    if (paginationBar) paginationBar.style.display = 'none';
    return;
  }

  container.innerHTML = questions.map(q => {
    const subName = q.subject?.name || 'General';
    const topicName = q.topic?.name || 'General Topic';
    const diff = q.difficulty || 'MEDIUM';
    const diffBadge = `<span class="badge badge-${diff.toLowerCase()}">${diff}</span>`;
    const isBookmarked = !!q.isBookmarked;

    return `
      <div class="card card-hover q-card">
        <div>
          <div class="q-card-header">
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <span class="badge badge-subject">${subName}</span>
              <span class="badge badge-topic">${topicName}</span>
            </div>
            ${diffBadge}
          </div>

          <p class="q-text-preview">${escapeHtml(q.questionText)}</p>
        </div>

        <div class="q-card-footer">
          <div style="display: flex; gap: 10px; align-items: center;">
            <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" 
                    title="${isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}" 
                    onclick="toggleBookmark('${q.id}', this)">
              ${isBookmarked ? '★' : '☆'}
            </button>
            <button class="btn btn-sm btn-outline" onclick="openDetailModal('${q.id}')">
              Preview
            </button>
          </div>

          <a href="/practice.html?id=${q.id}" class="btn btn-sm btn-primary">
            Practice →
          </a>
        </div>
      </div>
    `;
  }).join('');

  // Update pagination
  if (pagination && paginationBar) {
    paginationBar.style.display = 'flex';
    document.getElementById('pagination-info').textContent = 
      `Showing Page ${pagination.page} of ${pagination.totalPages || 1} (${pagination.total} total questions)`;

    document.getElementById('prev-page-btn').disabled = pagination.page <= 1;
    document.getElementById('next-page-btn').disabled = pagination.page >= pagination.totalPages;
  }
}

function resetFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('subject-filter').value = '';
  document.getElementById('topic-filter').value = '';
  document.getElementById('difficulty-filter').value = '';
  document.getElementById('type-filter').value = '';
  currentPage = 1;
  loadQuestions();
}

async function toggleBookmark(questionId, btn) {
  if (!Auth.isAuthenticated()) {
    Toast.info('Please log in to save bookmarks.');
    setTimeout(() => { window.location.href = '/login.html'; }, 1000);
    return;
  }

  const isCurrentlyBookmarked = btn.classList.contains('active');

  try {
    if (isCurrentlyBookmarked) {
      await API.delete(`/bookmarks/${questionId}`);
      btn.classList.remove('active');
      btn.innerHTML = '☆';
      btn.title = 'Bookmark this question';
      Toast.info('Bookmark removed.');
    } else {
      await API.post('/bookmarks', { questionId });
      btn.classList.add('active');
      btn.innerHTML = '★';
      btn.title = 'Remove bookmark';
      Toast.success('Question saved to bookmarks.');
    }
  } catch (err) {
    Toast.error(err.message || 'Bookmark action failed.');
  }
}

function openDetailModal(questionId) {
  const q = currentQuestions.find(item => item.id === questionId);
  if (!q) return;

  const modal = document.getElementById('detail-modal');
  const badgesWrap = document.getElementById('modal-badges');
  const body = document.getElementById('modal-body');
  const practiceBtn = document.getElementById('modal-practice-btn');

  badgesWrap.innerHTML = `
    <span class="badge badge-subject">${q.subject?.name || 'Subject'}</span>
    <span class="badge badge-topic">${q.topic?.name || 'Topic'}</span>
    <span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
  `;

  let optionsHtml = '';
  if (q.options && q.options.length > 0) {
    optionsHtml = `
      <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px;">
        ${q.options.map(opt => `
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--bg-surface-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <span style="font-weight: 800; width: 28px; height: 28px; border-radius: 50%; background: var(--bg-surface); display:flex; align-items:center; justify-content:center; border: 1px solid var(--border-medium);">
              ${opt.optionLabel}
            </span>
            <span style="font-size: 0.98rem;">${escapeHtml(opt.optionText)}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  body.innerHTML = `
    <div style="font-size: 1.15rem; font-weight: 500; line-height: 1.6; margin-bottom: 16px;">
      ${escapeHtml(q.questionText)}
    </div>
    ${q.imageUrl ? `<div style="text-align: center; margin-bottom: 16px;"><img src="${q.imageUrl}" style="max-height: 240px; border-radius: 8px;"></div>` : ''}
    ${optionsHtml}
    <div style="margin-top: 18px; font-size: 0.82rem; color: var(--text-muted); font-style: italic;">
      🔒 Correct answer and comprehensive explanation are revealed during practice.
    </div>
  `;

  practiceBtn.href = `/practice.html?id=${q.id}`;
  modal.classList.add('active');
}

function closeDetailModal() {
  document.getElementById('detail-modal').classList.remove('active');
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

window.toggleBookmark = toggleBookmark;
window.openDetailModal = openDetailModal;
window.closeDetailModal = closeDetailModal;
window.resetFilters = resetFilters;
