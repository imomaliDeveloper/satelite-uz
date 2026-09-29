/**
 * SATELITE.UZ - Student Dashboard Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  if (!Auth.requireAuth()) return;
  Auth.initNavbar();

  const user = Auth.getUser();
  if (user) {
    document.getElementById('user-display-name').textContent = user.name.split(' ')[0];
  }

  await Promise.all([
    loadUserTelemetry(),
    loadQuestionOfTheDay()
  ]);
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function loadUserTelemetry() {
  try {
    const res = await API.get('/results/telemetry');
    const data = res.data || {};

    const totalPracticed = data.totalPracticed || 0;
    const totalExams = data.totalExams || 0;
    const avgAccuracy = data.averageAccuracy || 0;
    const totalBookmarks = data.totalBookmarks || 0;
    const streakDays = data.streakDays || 0;
    const sessions = data.recentSessions || [];
    const weakTopics = data.weakTopics || [];

    // KPI Counters (Individual, 100% accurate per logged in student)
    document.getElementById('stat-practiced').textContent = totalPracticed;
    document.getElementById('stat-exams').textContent = totalExams;
    document.getElementById('stat-accuracy').textContent = `${avgAccuracy}%`;
    document.getElementById('stat-bookmarks').textContent = totalBookmarks;

    const streakEl = document.getElementById('streak-counter');
    if (streakEl) {
      streakEl.textContent = `${streakDays} Day${streakDays === 1 ? '' : 's'} Practice Streak`;
    }

    // Animate Progress Ring
    const circle = document.getElementById('progress-circle');
    const percentEl = document.getElementById('progress-percent');
    if (circle && percentEl) {
      const circumference = 2 * Math.PI * 48; // ~301.6
      const offset = circumference - (avgAccuracy / 100) * circumference;
      circle.style.strokeDashoffset = offset;
      percentEl.textContent = `${avgAccuracy}%`;
    }

    // Render Recent Results Table
    const tbody = document.getElementById('recent-results-body');
    if (tbody) {
      if (sessions.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 36px 20px;">
              <div style="font-size: 1.8rem; margin-bottom: 8px;">🚀</div>
              <div style="font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">No assessment sessions yet</div>
              <div style="font-size: 0.88rem;">Start an adaptive practice set or diagnostic exam to track your real scores.</div>
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = sessions.map(s => {
          const title = s.exam?.title || `${s.subject?.name || 'General'} Practice`;
          const date = new Date(s.completedAt || s.startedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          });
          const scoreDisplay = `${s.correctAnswers} / ${s.totalQuestions || (s.correctAnswers + s.wrongAnswers + s.skippedAnswers)}`;
          const accuracy = Math.round(s.score) || 0;
          const badgeClass = s.mode === 'EXAM' ? 'badge-hard' : 'badge-subject';

          return `
            <tr>
              <td><span class="badge ${badgeClass}">${s.mode}</span></td>
              <td style="font-weight: 600;">${title}</td>
              <td>${scoreDisplay}</td>
              <td style="color: ${accuracy >= 70 ? '#10b981' : (accuracy >= 50 ? '#f59e0b' : '#ef4444')}; font-weight: 700;">${accuracy}%</td>
              <td style="color: var(--text-muted); font-size: 0.88rem;">${date}</td>
              <td>
                <a href="/review.html?id=${s.id}" class="btn btn-sm btn-outline">Review</a>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // Render Weak Topics Dynamically
    const weakContainer = document.getElementById('weak-topics-container');
    if (weakContainer) {
      if (weakTopics.length === 0) {
        weakContainer.innerHTML = `
          <div style="padding: 24px; text-align: center; background: var(--bg-surface-elevated); border-radius: var(--radius-md); border: 1px dashed var(--border-medium);">
            <div style="font-size: 1.5rem; margin-bottom: 6px;">🎯</div>
            <div style="font-weight: 600; font-size: 0.92rem; color: var(--text-primary); margin-bottom: 4px;">No growth topics identified yet</div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 12px;">Practice questions to calculate your topic-by-topic mastery telemetry.</div>
            <a href="/practice.html" class="btn btn-sm btn-primary" style="font-size: 0.82rem; padding: 6px 14px;">Start Practice →</a>
          </div>
        `;
      } else {
        weakContainer.innerHTML = weakTopics.map(t => {
          const color = t.accuracy >= 70 ? '#10b981' : (t.accuracy >= 50 ? '#f59e0b' : '#ef4444');
          return `
            <div class="weak-topic-item">
              <div class="weak-topic-header">
                <span>${escapeHtml(t.topic)} <span style="font-size: 0.75rem; color: var(--text-muted);">(${t.total} q's)</span></span>
                <span style="color: ${color}; font-weight: 700;">${t.accuracy}%</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" style="width: ${Math.max(t.accuracy, 5)}%; background: ${color};"></div>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  } catch (err) {
    console.error('Error loading telemetry:', err);
  }
}

async function loadQuestionOfTheDay() {
  try {
    const res = await API.get('/questions?limit=1&sortBy=newest');
    const questions = res.data || [];
    if (questions.length > 0) {
      const q = questions[0];
      const textEl = document.getElementById('qotd-text');
      const diffEl = document.getElementById('qotd-difficulty');
      const btnEl = document.getElementById('qotd-btn');

      if (textEl) textEl.textContent = q.questionText;
      if (diffEl) {
        diffEl.textContent = q.difficulty;
        diffEl.className = `badge badge-${q.difficulty.toLowerCase()}`;
      }
      if (btnEl) btnEl.href = `/practice.html?id=${q.id}`;
    }
  } catch (err) {
    console.error('Error loading QOTD:', err);
  }
}
