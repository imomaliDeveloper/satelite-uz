/**
 * SATELITE.UZ - Admin Topics Controller
 */
let editingTopicId = null;
let allTopics = [];
let allSubjects = [];

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('admin-sidebar-nav').innerHTML = getSidebarHtml('topics');
  await loadSubjects();
  loadTopics();
  setupTopicForm();
});

async function loadSubjects() {
  try {
    const res = await API.get('/subjects');
    allSubjects = res.data || [];
    const select = document.getElementById('topic-subject-select');
    select.innerHTML = '<option value="">Select Parent Subject</option>';
    allSubjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.name;
      select.appendChild(opt);
    });
  } catch (e) {}
}

async function loadTopics() {
  const tbody = document.getElementById('topics-tbody');
  try {
    const res = await API.get('/topics');
    allTopics = res.data || [];

    if (allTopics.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">No topics defined yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = allTopics.map(t => `
      <tr>
        <td style="font-weight: 700;">${escapeHtml(t.name)}</td>
        <td><span class="badge badge-subject">${escapeHtml(t.subject?.name || 'Subject')}</span></td>
        <td><code>${escapeHtml(t.slug)}</code></td>
        <td style="color: var(--text-secondary); font-size: 0.9rem;">${escapeHtml(t.description || '—')}</td>
        <td><span class="badge badge-topic">${t._count?.questions || 0} Questions</span></td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-secondary" onclick="openTopicModal('${t.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteTopic('${t.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger);">${err.message}</td></tr>`;
  }
}

function openTopicModal(topicId = null) {
  editingTopicId = topicId;
  const modal = document.getElementById('topic-modal');
  const title = document.getElementById('topic-modal-title');
  const form = document.getElementById('topic-form');

  if (topicId) {
    const t = allTopics.find(item => item.id === topicId);
    if (!t) return;
    title.textContent = 'Edit Topic';
    document.getElementById('topic-subject-select').value = t.subjectId;
    document.getElementById('topic-name').value = t.name;
    document.getElementById('topic-slug').value = t.slug;
    document.getElementById('topic-desc').value = t.description || '';
  } else {
    title.textContent = 'Add Topic';
    form.reset();
  }

  modal.classList.add('active');
}

function closeTopicModal() {
  document.getElementById('topic-modal').classList.remove('active');
  editingTopicId = null;
}

function setupTopicForm() {
  const form = document.getElementById('topic-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const subjectId = document.getElementById('topic-subject-select').value;
    const name = document.getElementById('topic-name').value.trim();
    const slug = document.getElementById('topic-slug').value.trim().toLowerCase();
    const description = document.getElementById('topic-desc').value.trim();

    const btn = document.getElementById('topic-submit-btn');
    btn.disabled = true;

    try {
      if (editingTopicId) {
        await API.patch(`/topics/${editingTopicId}`, { subjectId, name, slug, description });
        Toast.success('Topic updated.');
      } else {
        await API.post('/topics', { subjectId, name, slug, description });
        Toast.success('Topic created.');
      }

      closeTopicModal();
      loadTopics();
    } catch (err) {
      Toast.error(err.message || 'Operation failed.');
    } finally {
      btn.disabled = false;
    }
  });
}

async function deleteTopic(topicId) {
  if (!confirm('Are you sure you want to delete this topic? Questions assigned to it may be affected.')) return;
  try {
    await API.delete(`/topics/${topicId}`);
    Toast.success('Topic deleted.');
    loadTopics();
  } catch (err) {
    Toast.error(err.message || 'Failed to delete topic.');
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

window.openTopicModal = openTopicModal;
window.closeTopicModal = closeTopicModal;
window.deleteTopic = deleteTopic;
