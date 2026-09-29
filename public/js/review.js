/**
 * SATELITE.UZ - Assessment Review Controller
 */
let allReviewQuestions = [];
let currentFilter = 'ALL';

document.addEventListener('DOMContentLoaded', async () => {
  if (!Auth.requireAuth()) return;
  Auth.initNavbar();

  setupFilterButtons();

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('id');

  if (!sessionId) {
    window.location.href = '/dashboard.html';
    return;
  }

  try {
    const res = await API.get(`/results/${sessionId}`);
    const data = res.data;
    allReviewQuestions = data.reviewQuestions || [];

    document.getElementById('review-subtitle').textContent = 
      `${data.session?.title || 'Session'} • Score: ${data.session?.correctAnswers} / ${data.session?.totalQuestions} (${Math.round(data.session?.score)}%)`;

    renderFilteredReview();
  } catch (err) {
    document.getElementById('review-list-container').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠</div>
        <h3 class="empty-state-title">Error Loading Review</h3>
        <p class="empty-state-desc">${err.message}</p>
        <a href="/dashboard.html" class="btn btn-primary">Return to Dashboard</a>
      </div>
    `;
  }
});

function setupFilterButtons() {
  document.querySelectorAll('.review-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.review-filter-btn').forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');

      currentFilter = btn.dataset.filter;
      renderFilteredReview();
    });
  });
}

function renderFilteredReview() {
  const container = document.getElementById('review-list-container');
  let filtered = allReviewQuestions;

  if (currentFilter !== 'ALL') {
    filtered = allReviewQuestions.filter(q => q.status === currentFilter);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state card">
        <div class="empty-state-icon">✔</div>
        <h3 class="empty-state-title">No questions in this filter</h3>
        <p class="empty-state-desc">Select another filter tab above to view other questions.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((q, idx) => {
    let statusBadge = '<span class="badge badge-medium">SKIPPED</span>';
    if (q.status === 'CORRECT') {
      statusBadge = '<span class="badge badge-easy">✔ CORRECT</span>';
    } else if (q.status === 'INCORRECT') {
      statusBadge = '<span class="badge badge-hard">✖ INCORRECT</span>';
    }

    return `
      <div class="review-q-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; gap: 8px; align-items: center;">
            <span style="font-weight: 800; color: var(--accent-cyan);">#${idx + 1}</span>
            <span class="badge badge-subject">${escapeHtml(q.subject || 'Subject')}</span>
            <span class="badge badge-topic">${escapeHtml(q.topic || 'Topic')}</span>
          </div>

          <div style="display: flex; gap: 12px; align-items: center;">
            ${statusBadge}
            <button class="bookmark-btn ${q.isBookmarked ? 'active' : ''}" onclick="toggleReviewBookmark('${q.questionId}', this)">
              ${q.isBookmarked ? '★' : '☆'}
            </button>
          </div>
        </div>

        <div style="font-size: 1.15rem; font-weight: 500; line-height: 1.6; margin-bottom: 20px;">
          ${escapeHtml(q.questionText)}
        </div>

        ${q.imageUrl ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${q.imageUrl}" style="max-height: 260px; border-radius: 8px;"></div>` : ''}

        <!-- Choices -->
        <div style="margin-bottom: 24px;">
          ${q.options.map(opt => {
            const isUserSelected = opt.id === q.userAnswerId;
            const isCorrectAnswer = opt.isCorrect;

            let choiceClass = 'review-choice-item';
            let labelTag = '';

            if (isCorrectAnswer) {
              choiceClass += ' correct-choice';
              labelTag = '<span style="color: #10b981; font-weight: 700; margin-left: auto; font-size: 0.85rem;">✔ Correct Answer</span>';
            } else if (isUserSelected && !isCorrectAnswer) {
              choiceClass += ' user-wrong-choice';
              labelTag = '<span style="color: #ef4444; font-weight: 700; margin-left: auto; font-size: 0.85rem;">✖ Your Choice</span>';
            }

            return `
              <div class="${choiceClass}">
                <span style="font-weight: 800; width: 28px; height: 28px; border-radius: 50%; background: var(--bg-surface); display:flex; align-items:center; justify-content:center; border: 1px solid var(--border-medium);">
                  ${opt.optionLabel}
                </span>
                <span>${escapeHtml(opt.optionText)}</span>
                ${labelTag}
              </div>
            `;
          }).join('')}
        </div>

        <!-- Explanation Card -->
        <div class="explanation-card" style="background: var(--bg-surface-elevated);">
          <div class="explanation-title" style="color: var(--accent-primary);">
            <span>💡</span>
            <span>Explanation & Solution</span>
          </div>
          <div class="explanation-body">
            ${escapeHtml(q.explanation || 'Review the core subject concepts to solve similar questions correctly.')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function toggleReviewBookmark(questionId, btn) {
  const isBookmarked = btn.classList.contains('active');
  try {
    if (isBookmarked) {
      await API.delete(`/bookmarks/${questionId}`);
      btn.classList.remove('active');
      btn.innerHTML = '☆';
      Toast.info('Bookmark removed.');
    } else {
      await API.post('/bookmarks', { questionId });
      btn.classList.add('active');
      btn.innerHTML = '★';
      Toast.success('Question saved to bookmarks.');
    }
  } catch (err) {
    Toast.error(err.message || 'Bookmark action failed.');
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

window.toggleReviewBookmark = toggleReviewBookmark;
