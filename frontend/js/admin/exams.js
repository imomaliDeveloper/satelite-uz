/**
 * SATELITE.UZ - Admin Exams Controller
 */
let allExams = [];
let availableQuestions = [];
let selectedQuestionIds = new Set();
let editingExamId = null;

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('admin-sidebar-nav').innerHTML = getSidebarHtml('exams');
  await Promise.all([
    loadExams(),
    loadAvailableQuestions()
  ]);
  setupExamForm();
  setupPickerSearch();
});

async function loadExams() {
  const tbody = document.getElementById('exams-tbody');
  try {
    const res = await API.get('/exams');
    allExams = res.data || [];

    if (allExams.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">No exams configured yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = allExams.map(e => `
      <tr>
        <td style="font-weight: 700;">${escapeHtml(e.title)}</td>
        <td>⏱️ ${e.durationMinutes} mins</td>
        <td><span class="badge badge-topic">${e.totalQuestions} Questions</span></td>
        <td>
          <div style="display: flex; gap: 4px; font-size: 0.76rem; flex-wrap: wrap;">
            <span class="badge ${e.calculatorAllowed !== false ? 'badge-subject' : 'badge-status-inactive'}" title="${e.calculatorAllowed !== false ? 'Calculator Allowed' : 'Calculator Disabled'}">
              🧮 ${e.calculatorAllowed !== false ? 'Calc ON' : 'Calc OFF'}
            </span>
            <span class="badge ${e.referenceSheetAllowed !== false ? 'badge-topic' : 'badge-status-inactive'}" title="${e.referenceSheetAllowed !== false ? 'Reference Sheet Allowed' : 'Reference Disabled'}">
              📐 ${e.referenceSheetAllowed !== false ? 'Ref ON' : 'Ref OFF'}
            </span>
          </div>
        </td>
        <td>${e.attemptsCount || 0}</td>
        <td>
          <span class="badge ${e.isPublished ? 'badge-status-active' : 'badge-status-inactive'}">
            ${e.isPublished ? 'Published' : 'Draft'}
          </span>
        </td>
        <td style="color: var(--text-muted); font-size: 0.85rem;">
          ${new Date(e.createdAt).toLocaleDateString()}
        </td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-secondary" onclick="openExamModal('${e.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteExam('${e.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--danger);">${err.message}</td></tr>`;
  }
}

async function loadAvailableQuestions() {
  try {
    const res = await API.get('/questions?limit=100');
    availableQuestions = res.data || [];
  } catch (e) {}
}

function renderPickerList(filterText = '') {
  const container = document.getElementById('q-picker-list');
  const lowerFilter = filterText.toLowerCase();

  const filtered = availableQuestions.filter(q => 
    q.questionText.toLowerCase().includes(lowerFilter) ||
    q.subject?.name?.toLowerCase().includes(lowerFilter) ||
    q.topic?.name?.toLowerCase().includes(lowerFilter)
  );

  if (filtered.length === 0) {
    container.innerHTML = '<p class="text-muted" style="padding: 12px; font-size: 0.9rem;">No matching questions found.</p>';
    return;
  }

  container.innerHTML = filtered.map(q => {
    const isChecked = selectedQuestionIds.has(q.id);
    return `
      <label style="display: flex; align-items: flex-start; gap: 10px; padding: 8px 10px; background: var(--bg-surface); border-radius: var(--radius-sm); cursor: pointer; border: 1px solid var(--border-subtle);">
        <input type="checkbox" value="${q.id}" ${isChecked ? 'checked' : ''} onchange="toggleQuestionPick('${q.id}', this.checked)" style="margin-top: 4px; width: 16px; height: 16px;">
        <div style="flex: 1; font-size: 0.88rem;">
          <div style="font-weight: 500; margin-bottom: 2px;">${escapeHtml(q.questionText.slice(0, 90))}...</div>
          <div style="display: flex; gap: 6px;">
            <span class="badge badge-subject" style="font-size: 0.7rem; padding: 2px 6px;">${escapeHtml(q.subject?.name || 'Subject')}</span>
            <span class="badge badge-${q.difficulty.toLowerCase()}" style="font-size: 0.7rem; padding: 2px 6px;">${q.difficulty}</span>
          </div>
        </div>
      </label>
    `;
  }).join('');
}

function toggleQuestionPick(questionId, isChecked) {
  if (isChecked) {
    selectedQuestionIds.add(questionId);
  } else {
    selectedQuestionIds.delete(questionId);
  }
  document.getElementById('selected-q-count').textContent = selectedQuestionIds.size;
}

function setupPickerSearch() {
  const searchInput = document.getElementById('q-picker-search');
  searchInput.addEventListener('input', (e) => {
    renderPickerList(e.target.value.trim());
  });
}

async function openExamModal(examId = null) {
  editingExamId = examId;
  const modal = document.getElementById('exam-modal');
  const title = document.getElementById('exam-modal-title');
  const form = document.getElementById('exam-form');
  selectedQuestionIds.clear();

  if (examId) {
    title.textContent = 'Edit Assessment Blueprint';
    try {
      const res = await API.get(`/exams/${examId}`);
      const exam = res.data;
      document.getElementById('exam-title-input').value = exam.title;
      document.getElementById('exam-duration-input').value = exam.durationMinutes;
      document.getElementById('exam-desc-input').value = exam.description || '';
      document.getElementById('exam-pub-input').checked = exam.isPublished;
      document.getElementById('exam-calc-allowed').checked = exam.calculatorAllowed !== false;
      document.getElementById('exam-ref-allowed').checked = exam.referenceSheetAllowed !== false;

      (exam.questions || []).forEach(q => selectedQuestionIds.add(q.id));
    } catch (e) {
      Toast.error('Failed to load exam details.');
    }
  } else {
    title.textContent = 'Create Timed Assessment';
    form.reset();
    document.getElementById('exam-duration-input').value = 45;
    document.getElementById('exam-pub-input').checked = true;
    document.getElementById('exam-calc-allowed').checked = true;
    document.getElementById('exam-ref-allowed').checked = true;
  }

  document.getElementById('selected-q-count').textContent = selectedQuestionIds.size;
  renderPickerList();
  modal.classList.add('active');
}

function closeExamModal() {
  document.getElementById('exam-modal').classList.remove('active');
  editingExamId = null;
  selectedQuestionIds.clear();
}

function setupExamForm() {
  const form = document.getElementById('exam-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (selectedQuestionIds.size === 0) {
      Toast.error('Please select at least 1 question for the exam.');
      return;
    }

    const title = document.getElementById('exam-title-input').value.trim();
    const durationMinutes = parseInt(document.getElementById('exam-duration-input').value) || 45;
    const description = document.getElementById('exam-desc-input').value.trim();
    const isPublished = document.getElementById('exam-pub-input').checked;
    const calculatorAllowed = document.getElementById('exam-calc-allowed').checked;
    const referenceSheetAllowed = document.getElementById('exam-ref-allowed').checked;
    const questionIds = Array.from(selectedQuestionIds);

    const btn = document.getElementById('exam-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    const payload = {
      title,
      durationMinutes,
      description,
      isPublished,
      calculatorAllowed,
      referenceSheetAllowed,
      questionIds
    };

    try {
      if (editingExamId) {
        await API.patch(`/exams/${editingExamId}`, payload);
        Toast.success('Exam updated successfully.');
      } else {
        await API.post('/exams', payload);
        Toast.success('Exam created and ready for testing.');
      }

      closeExamModal();
      loadExams();
    } catch (err) {
      Toast.error(err.message || 'Operation failed.');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Save Exam';
    }
  });
}

async function deleteExam(examId) {
  if (!confirm('Are you sure you want to delete this exam blueprint?')) return;
  try {
    await API.delete(`/exams/${examId}`);
    Toast.success('Exam deleted.');
    loadExams();
  } catch (err) {
    Toast.error(err.message || 'Failed to delete exam.');
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

window.openExamModal = openExamModal;
window.closeExamModal = closeExamModal;
window.deleteExam = deleteExam;
window.toggleQuestionPick = toggleQuestionPick;
