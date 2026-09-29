/**
 * SATELITE.UZ - Profile & History Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  if (!Auth.requireAuth()) return;
  Auth.initNavbar();

  setupTabs();
  loadUserProfile();
  await Promise.all([
    loadBookmarks(),
    loadHistory()
  ]);

  setupPasswordForm();
});

function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(btn.dataset.tab);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

function loadUserProfile() {
  const user = Auth.getUser();
  if (!user) return;

  document.getElementById('profile-name').textContent = user.name;
  document.getElementById('profile-email').textContent = user.email;
  document.getElementById('profile-role').textContent = user.role;
  document.getElementById('profile-avatar').textContent = user.name.charAt(0).toUpperCase();
}

async function loadBookmarks() {
  const container = document.getElementById('bookmarks-list');
  const badge = document.getElementById('bookmark-count-badge');

  try {
    const res = await API.get('/bookmarks');
    const bookmarks = res.data || [];
    badge.textContent = bookmarks.length;

    if (bookmarks.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">⭐</div>
          <h3 class="empty-state-title">No Saved Bookmarks Yet</h3>
          <p class="empty-state-desc">While practicing, click the star icon to save challenging questions for review.</p>
          <a href="/question-bank.html" class="btn btn-primary">Browse Question Bank</a>
        </div>
      `;
      return;
    }

    container.innerHTML = bookmarks.map(b => {
      const q = b.question;
      const subName = q.subject?.name || 'Subject';
      const topicName = q.topic?.name || 'Topic';

      return `
        <div class="card card-hover q-card">
          <div>
            <div class="q-card-header">
              <span class="badge badge-subject">${escapeHtml(subName)}</span>
              <span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
            </div>
            <p class="q-text-preview">${escapeHtml(q.questionText)}</p>
          </div>

          <div class="q-card-footer">
            <button class="btn btn-sm btn-outline" onclick="removeBookmarkItem('${q.id}')">
              Remove
            </button>
            <a href="/practice.html?id=${q.id}" class="btn btn-sm btn-primary">
              Practice →
            </a>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p class="text-secondary">${err.message}</p></div>`;
  }
}

async function removeBookmarkItem(questionId) {
  try {
    await API.delete(`/bookmarks/${questionId}`);
    Toast.info('Bookmark removed.');
    loadBookmarks();
  } catch (err) {
    Toast.error(err.message || 'Failed to remove bookmark.');
  }
}

async function loadHistory() {
  const tbody = document.getElementById('history-table-body');
  try {
    const res = await API.get('/results?limit=50');
    const sessions = res.data || [];

    if (sessions.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">
            No assessment history recorded yet.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = sessions.map(s => {
      const title = s.exam?.title || `${s.subject?.name || 'General'} Practice Set`;
      const date = new Date(s.completedAt || s.startedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const scoreDisplay = `${s.correctAnswers} / ${s.totalQuestions || (s.correctAnswers + s.wrongAnswers + s.skippedAnswers)}`;
      const accuracy = Math.round(s.score) || 0;
      const mins = Math.round((s.durationSeconds || 0) / 60);

      return `
        <tr>
          <td><span class="badge ${s.mode === 'EXAM' ? 'badge-hard' : 'badge-subject'}">${s.mode}</span></td>
          <td style="font-weight: 600;">${escapeHtml(title)}</td>
          <td>${scoreDisplay}</td>
          <td style="color: ${accuracy >= 70 ? '#10b981' : '#f59e0b'}; font-weight: 700;">${accuracy}%</td>
          <td>${mins} min(s)</td>
          <td style="color: var(--text-muted); font-size: 0.88rem;">${date}</td>
          <td>
            <a href="/review.html?id=${s.id}" class="btn btn-sm btn-outline">Review</a>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--danger);">${err.message}</td></tr>`;
  }
}

function setupPasswordForm() {
  const form = document.getElementById('change-password-form');
  const currentPwd = document.getElementById('current-pwd');
  const newPwd = document.getElementById('new-pwd');
  const confirmPwd = document.getElementById('confirm-pwd');
  const submitBtn = document.getElementById('pwd-submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (newPwd.value.length < 8) {
      Toast.error('New password must be at least 8 characters long.');
      return;
    }

    if (newPwd.value !== confirmPwd.value) {
      Toast.error('New passwords do not match.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating...';

    try {
      await API.post('/auth/change-password', {
        currentPassword: currentPwd.value,
        newPassword: newPwd.value,
        confirmNewPassword: confirmPwd.value
      });

      Toast.success('Password changed successfully.');
      form.reset();
    } catch (err) {
      Toast.error(err.message || 'Failed to update password.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Update Password';
    }
  });
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

window.removeBookmarkItem = removeBookmarkItem;
