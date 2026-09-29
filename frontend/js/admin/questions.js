/**
 * SATELITE.UZ - Admin Question Management Controller
 */
let currentPage = 1;
let currentLimit = 15;
let searchTimer = null;
let questionToDeleteId = null;
let selectedQuestions = new Set();
let currentQuestionsList = [];

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
  const selectAll = document.getElementById('select-all-q');

  if (selectAll) {
    selectAll.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      document.querySelectorAll('.row-q-select').forEach(cb => {
        cb.checked = isChecked;
        const id = cb.dataset.id;
        if (isChecked) selectedQuestions.add(id);
        else selectedQuestions.delete(id);
      });
      updateBulkBar();
    });
  }

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
    currentQuestionsList = res.data || [];
    renderQuestionsTable(currentQuestionsList, res.pagination);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--danger); padding: 30px;">${err.message}</td></tr>`;
  }
}

function renderQuestionsTable(questions, pagination) {
  const tbody = document.getElementById('admin-questions-tbody');

  if (questions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">
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
    const isCalc = q.calculatorAllowed !== false;
    const isRef = q.referenceSheetAllowed !== false;
    const isChecked = selectedQuestions.has(q.id);

    return `
      <tr>
        <td>
          <input type="checkbox" class="row-q-select" data-id="${q.id}" ${isChecked ? 'checked' : ''} onchange="toggleSelectQuestion('${q.id}', this.checked)" style="cursor: pointer;">
        </td>
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
        <td>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <button 
              class="btn btn-sm ${isCalc ? 'btn-outline' : 'btn-secondary'}" 
              style="font-size: 0.76rem; padding: 2px 8px; justify-content: flex-start; gap: 4px;"
              title="Click to toggle Calculator allowed"
              onclick="toggleTool('${q.id}', 'calculatorAllowed', ${!isCalc})"
            >
              <span>🧮</span>
              <span>${isCalc ? 'Calc ON' : 'Calc OFF'}</span>
            </button>
            <button 
              class="btn btn-sm ${isRef ? 'btn-outline' : 'btn-secondary'}" 
              style="font-size: 0.76rem; padding: 2px 8px; justify-content: flex-start; gap: 4px;"
              title="Click to toggle Reference Sheet allowed"
              onclick="toggleTool('${q.id}', 'referenceSheetAllowed', ${!isRef})"
            >
              <span>📐</span>
              <span>${isRef ? 'Ref ON' : 'Ref OFF'}</span>
            </button>
          </div>
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

  updateBulkBar();
}

function toggleSelectQuestion(id, checked) {
  if (checked) selectedQuestions.add(id);
  else selectedQuestions.delete(id);
  updateBulkBar();
}

function updateBulkBar() {
  const bar = document.getElementById('bulk-actions-bar');
  const countSpan = document.getElementById('bulk-selected-count');
  if (!bar) return;

  const count = selectedQuestions.size;
  if (count > 0) {
    bar.style.display = 'flex';
    if (countSpan) countSpan.textContent = `${count} question(s) selected`;
  } else {
    bar.style.display = 'none';
  }

  const selectAll = document.getElementById('select-all-q');
  if (selectAll && currentQuestionsList.length > 0) {
    selectAll.checked = currentQuestionsList.every(q => selectedQuestions.has(q.id));
  }
}

function clearBulkSelection() {
  selectedQuestions.clear();
  const selectAll = document.getElementById('select-all-q');
  if (selectAll) selectAll.checked = false;
  document.querySelectorAll('.row-q-select').forEach(cb => cb.checked = false);
  updateBulkBar();
}

async function toggleTool(questionId, toolKey, newValue) {
  try {
    const payload = {};
    payload[toolKey] = newValue;
    await API.patch(`/questions/${questionId}`, payload);
    Toast.success('Question tool settings updated.');
    loadAdminQuestions();
  } catch (err) {
    Toast.error(err.message || 'Failed to update tool setting.');
  }
}

async function bulkSetTools(toolSettings) {
  if (selectedQuestions.size === 0) {
    Toast.info('Please select questions first.');
    return;
  }

  const ids = Array.from(selectedQuestions);
  try {
    const res = await API.patch('/questions/bulk', {
      questionIds: ids,
      ...toolSettings
    });
    Toast.success(res.message || 'Bulk tool settings applied successfully.');
    clearBulkSelection();
    loadAdminQuestions();
  } catch (err) {
    Toast.error(err.message || 'Bulk update failed.');
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
window.toggleTool = toggleTool;
window.bulkSetTools = bulkSetTools;
window.clearBulkSelection = clearBulkSelection;
window.toggleSelectQuestion = toggleSelectQuestion;
