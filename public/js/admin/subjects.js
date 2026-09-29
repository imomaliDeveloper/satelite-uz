/**
 * SATELITE.UZ - Admin Subjects Controller
 */
let editingSubjectId = null;
let allSubjects = [];

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('admin-sidebar-nav').innerHTML = getSidebarHtml('subjects');
  loadSubjects();
  setupSubjectForm();
});

async function loadSubjects() {
  const tbody = document.getElementById('subjects-tbody');
  try {
    const res = await API.get('/subjects');
    allSubjects = res.data || [];

    if (allSubjects.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">No subjects defined yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = allSubjects.map(s => `
      <tr>
        <td style="font-weight: 700;">${escapeHtml(s.name)}</td>
        <td><code>${escapeHtml(s.slug)}</code></td>
        <td style="color: var(--text-secondary); font-size: 0.9rem;">${escapeHtml(s.description || '—')}</td>
        <td><span class="badge badge-topic">${s.topics?.length || s._count?.topics || 0} Topics</span></td>
        <td>
          <span class="badge ${s.isActive ? 'badge-status-active' : 'badge-status-inactive'}">
            ${s.isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-secondary" onclick="openSubjectModal('${s.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteSubject('${s.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--danger);">${err.message}</td></tr>`;
  }
}

function openSubjectModal(subjectId = null) {
  editingSubjectId = subjectId;
  const modal = document.getElementById('subject-modal');
  const title = document.getElementById('subject-modal-title');
  const form = document.getElementById('subject-form');

  if (subjectId) {
    const s = allSubjects.find(item => item.id === subjectId);
    if (!s) return;
    title.textContent = 'Edit Subject';
    document.getElementById('sub-name').value = s.name;
    document.getElementById('sub-slug').value = s.slug;
    document.getElementById('sub-desc').value = s.description || '';
    document.getElementById('sub-active').checked = s.isActive;
  } else {
    title.textContent = 'Add Subject';
    form.reset();
    document.getElementById('sub-active').checked = true;
  }

  modal.classList.add('active');
}

function closeSubjectModal() {
  document.getElementById('subject-modal').classList.remove('active');
  editingSubjectId = null;
}

function setupSubjectForm() {
  const form = document.getElementById('subject-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('sub-name').value.trim();
    const slug = document.getElementById('sub-slug').value.trim().toLowerCase();
    const description = document.getElementById('sub-desc').value.trim();
    const isActive = document.getElementById('sub-active').checked;

    const btn = document.getElementById('sub-submit-btn');
    btn.disabled = true;

    try {
      if (editingSubjectId) {
        await API.patch(`/subjects/${editingSubjectId}`, { name, slug, description, isActive });
        Toast.success('Subject updated.');
      } else {
        await API.post('/subjects', { name, slug, description, isActive });
        Toast.success('Subject created.');
      }

      closeSubjectModal();
      loadSubjects();
    } catch (err) {
      Toast.error(err.message || 'Operation failed.');
    } finally {
      btn.disabled = false;
    }
  });
}

async function deleteSubject(subjectId) {
  if (!confirm('Are you sure you want to delete this subject? Topics and questions under it may be affected.')) return;
  try {
    await API.delete(`/subjects/${subjectId}`);
    Toast.success('Subject deleted.');
    loadSubjects();
  } catch (err) {
    Toast.error(err.message || 'Failed to delete subject.');
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

window.openSubjectModal = openSubjectModal;
window.closeSubjectModal = closeSubjectModal;
window.deleteSubject = deleteSubject;
