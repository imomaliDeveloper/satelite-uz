/**
 * SATELITE.UZ - Admin Analytics Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('admin-sidebar-nav').innerHTML = getSidebarHtml('analytics');
  loadAnalytics();
});

async function loadAnalytics() {
  try {
    const res = await API.get('/admin/analytics');
    const data = res.data;

    // 1. Subject distribution
    const subContainer = document.getElementById('subject-distribution-list');
    const subjects = data.subjectDistribution || [];
    const maxSub = Math.max(...subjects.map(s => s.count), 1);
    subContainer.innerHTML = subjects.map(s => `
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 6px;">
          <span style="font-weight: 600;">${escapeHtml(s.subject)}</span>
          <span style="color: var(--accent-cyan); font-weight: 700;">${s.count} questions</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${(s.count / maxSub) * 100}%; background: var(--accent-primary);"></div>
        </div>
      </div>
    `).join('');

    // 2. Difficulty distribution
    const diffContainer = document.getElementById('difficulty-distribution-list');
    const difficulties = data.difficultyDistribution || [];
    const totalDiff = difficulties.reduce((acc, curr) => acc + curr.count, 0) || 1;

    diffContainer.innerHTML = difficulties.map(d => {
      let color = '#34d399';
      if (d.difficulty === 'MEDIUM') color = '#fbbf24';
      if (d.difficulty === 'HARD') color = '#f87171';
      const pct = Math.round((d.count / totalDiff) * 100);

      return `
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 6px;">
            <span style="font-weight: 600;">${d.difficulty}</span>
            <span style="font-weight: 700; color: ${color};">${d.count} (${pct}%)</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%; background: ${color};"></div>
          </div>
        </div>
      `;
    }).join('');

    // 3. Difficult topics table
    const topicsTbody = document.getElementById('difficult-topics-tbody');
    const topics = data.mostDifficultTopics || [];
    if (topics.length === 0) {
      topicsTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">Need more student practice attempts to compute topic rankings.</td></tr>`;
    } else {
      topicsTbody.innerHTML = topics.map(t => `
        <tr>
          <td style="font-weight: 700;">${escapeHtml(t.name)}</td>
          <td><span class="badge badge-subject">${escapeHtml(t.subject || 'Subject')}</span></td>
          <td>${t.totalQuestions}</td>
          <td>${t.totalAttempts}</td>
          <td>
            <span style="font-weight: 800; color: ${t.avgAccuracy <= 50 ? '#ef4444' : '#f59e0b'};">
              ${t.avgAccuracy}% Accuracy
            </span>
          </td>
        </tr>
      `).join('');
    }

    // 4. Most missed questions
    const missedTbody = document.getElementById('missed-questions-tbody');
    const missed = data.mostMissedQuestions || [];
    if (missed.length === 0) {
      missedTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">No questions with high error rates identified yet.</td></tr>`;
    } else {
      missedTbody.innerHTML = missed.map(q => `
        <tr>
          <td style="font-weight: 500;">${escapeHtml(q.questionText)}</td>
          <td><span class="badge badge-subject">${escapeHtml(q.subject || 'Subject')}</span></td>
          <td><span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span></td>
          <td>${q.totalAttempts}</td>
          <td>
            <span style="font-weight: 800; color: #ef4444;">
              ${q.missRate}% Miss Rate
            </span>
          </td>
        </tr>
      `).join('');
    }

  } catch (err) {
    Toast.error('Failed to load analytics.');
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
