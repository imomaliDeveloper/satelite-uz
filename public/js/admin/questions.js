/**
 * SATELITE.UZ - Admin Question Management Controller
 */
let currentPage = 1;
let currentLimit = 15;
let searchTimer = null;
let questionToDeleteId = null;

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('admin-sidebar-nav').innerHTML = getSidebarHtml('questions');

  await loadSubjectFilter();
  setupListeners();
  loadAdminQuestions();
});

async function loadSubjectFilter() {
  try {
    const res = await API.get('/subjects');
    const subjects = res.data || [];
    const select = document.getElementById('admin-sub-filter');
    subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.name;
      select.appendChild(opt);
    });
  } catch (e) {}
}

function setupListeners() {
  const searchInput = document.getElementById('admin-q-search');
  const subFilter = document.getElementById('admin-sub-filter');
  const diffFilter = document.getElementById('admin-diff-filter');
  const pubFilter = document.getElementById('admin-pub-filter');
  const prevBtn = document.getElementById('admin-prev-btn');
  const nextBtn = document.getElementById('admin-next-btn');

  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      currentPage = 1;
      loadAdminQuestions();
    }, 350);
  });

  subFilter.addEventListener('change', () => { currentPage = 1; loadAdminQuestions(); });
  diffFilter.addEventListener('change', () => { currentPage = 1; loadAdminQuestions(); });
  pubFilter.addEventListener('change', () => { currentPage = 1; loadAdminQuestions(); });

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadAdminQuestions();
    }
  });

  nextBtn.addEventListener('click', () => {
    currentPage++;
    loadAdminQuestions();
  });

  document.getElementById('confirm-delete-btn').addEventListener('click', deleteQuestionConfirmed);
}

async function loadAdminQuestions() {
  const tbody = document.getElementById('admin-questions-tbody');
  tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 40px;">Refreshing items...</td></tr>`;

  const search = document.getElementById('admin-q-search').value.trim();
  const subjectId = document.getElementById('admin-sub-filter').value;
  const difficulty = document.getElementById('admin-diff-filter').value;
  const isPublished = document.getElementById('admin-pub-filter').value;

  const params = new URLSearchParams({
    page: currentPage,
    limit: currentLimit
  });

  if (search) params.append('search', search);
  if (subjectId) params.append('subjectId', subjectId);
  if (difficulty) params.append('difficulty', difficulty);
  if (isPublished) params.append('isPublished', isPublished);

  try {
    const res = await API.get(`/questions?${params.toString()}`);
    const questions = res.data || [];
    renderQuestionsTable(questions, res.pagination);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger); padding: 30px;">${err.message}</td></tr>`;
  }
}

function renderQuestionsTable(questions, pagination) {
  const tbody = document.getElementById('admin-questions-tbody');

  if (questions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 40px;">
          No questions matched your search criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = questions.map(q => {
    const sub = q.subject?.name || 'Subject';
    const topic = q.topic?.name || 'Topic';
    const isPub = q.isPublished;

    return `
      <tr>
        <td>
          <div style="font-weight: 600; line-height: 1.4; margin-bottom: 4px;">
            ${escapeHtml(q.questionText)}
          </div>
          ${q.imageUrl ? '<span style="font-size: 0.75rem; color: var(--accent-cyan);">📷 Has Image Asset</span>' : ''}
        </td>
        <td>
          <span class="badge badge-subject" style="margin-bottom: 2px;">${sub}</span><br>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${topic}</span>
        </td>
        <td>
          <span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
        </td>
        <td style="font-size: 0.85rem; color: var(--text-secondary);">
          ${q.questionType}
        </td>
        <td>
          <span class="badge ${isPub ? 'badge-status-active' : 'badge-status-inactive'}">
            ${isPub ? 'Published' : 'Draft'}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-outline" title="${isPub ? 'Unpublish' : 'Publish'}" onclick="togglePublish('${q.id}')">
              ${isPub ? '👁️' : '🔒'}
            </button>
            <a href="/admin/question-edit.html?id=${q.id}" class="btn btn-sm btn-secondary" title="Edit Question">
              ✏️
            </a>
            <button class="btn btn-sm btn-danger" title="Delete Question" onclick="openDeleteModal('${q.id}')">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (pagination) {
    document.getElementById('admin-pagination-text').textContent = 
      `Page ${pagination.page} of ${pagination.totalPages || 1} (${pagination.total} questions)`;
    document.getElementById('admin-prev-btn').disabled = pagination.page <= 1;
    document.getElementById('admin-next-btn').disabled = pagination.page >= pagination.totalPages;
  }
}

async function togglePublish(questionId) {
  try {
    const res = await API.patch(`/questions/${questionId}/publish`);
    Toast.success(res.message || 'Status updated.');
    loadAdminQuestions();
  } catch (err) {
    Toast.error(err.message || 'Failed to toggle status.');
  }
}

function openDeleteModal(questionId) {
  questionToDeleteId = questionId;
  document.getElementById('delete-q-modal').classList.add('active');
}

function closeDeleteModal() {
  questionToDeleteId = null;
  document.getElementById('delete-q-modal').classList.remove('active');
}

async function deleteQuestionConfirmed() {
  if (!questionToDeleteId) return;
  const btn = document.getElementById('confirm-delete-btn');
  btn.disabled = true;
  btn.textContent = 'Deleting...';

  try {
    await API.delete(`/questions/${questionToDeleteId}`);
    Toast.success('Question deleted successfully.');
    closeDeleteModal();
    loadAdminQuestions();
  } catch (err) {
    Toast.error(err.message || 'Failed to delete question.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Permanently Delete';
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

window.togglePublish = togglePublish;
window.openDeleteModal = openDeleteModal;
window.closeDeleteModal = closeDeleteModal;
