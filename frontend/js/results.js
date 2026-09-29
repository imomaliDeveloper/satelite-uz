/**
 * SATELITE.UZ - Results Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  if (!Auth.requireAuth()) return;
  Auth.initNavbar();

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('id');

  if (!sessionId) {
    window.location.href = '/dashboard.html';
    return;
  }

  try {
    const res = await API.get(`/results/${sessionId}`);
    const data = res.data;
    const session = data.session;
    const topicBreakdown = data.topicBreakdown || [];

    document.getElementById('results-loading').style.display = 'none';
    document.getElementById('results-content').style.display = 'block';

    // Top banner
    document.getElementById('res-mode-badge').textContent = `${session.mode} SUMMARY`;
    document.getElementById('res-title').textContent = session.title || 'Diagnostic Assessment';
    document.getElementById('res-score-big').textContent = `${session.correctAnswers} / ${session.totalQuestions}`;
    
    const accuracy = Math.round(session.score) || 0;
    document.getElementById('res-accuracy-text').textContent = `${accuracy}% Overall Accuracy`;

    // 4 KPI Cards
    document.getElementById('res-correct').textContent = session.correctAnswers;
    document.getElementById('res-wrong').textContent = session.wrongAnswers;
    document.getElementById('res-skipped').textContent = session.skippedAnswers;

    const seconds = session.durationSeconds || 0;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const timeFormatted = [
      h > 0 ? String(h).padStart(2, '0') : null,
      String(m).padStart(2, '0'),
      String(s).padStart(2, '0')
    ].filter(Boolean).join(':');
    document.getElementById('res-time').textContent = timeFormatted;

    // Performance by topic
    const topicContainer = document.getElementById('res-topics-list');
    if (topicBreakdown.length === 0) {
      topicContainer.innerHTML = '<p class="text-muted">No topic telemetry available for this session.</p>';
    } else {
      topicContainer.innerHTML = topicBreakdown.map(t => {
        let barColor = '#ef4444';
        if (t.accuracy >= 75) barColor = '#10b981';
        else if (t.accuracy >= 55) barColor = '#f59e0b';

        return `
          <div class="weak-topic-item" style="padding: 16px;">
            <div class="weak-topic-header" style="font-size: 1rem; margin-bottom: 8px;">
              <span>${escapeHtml(t.topic)}</span>
              <span style="color: ${barColor}; font-weight: 800;">${t.accuracy}% (${t.correct} / ${t.total})</span>
            </div>
            <div class="bar-track" style="height: 10px;">
              <div class="bar-fill" style="width: ${t.accuracy}%; background: ${barColor};"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Review link
    document.getElementById('review-answers-btn').href = `/review.html?id=${session.id}`;

  } catch (err) {
    document.getElementById('results-loading').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠</div>
        <h3 class="empty-state-title">Result Not Found</h3>
        <p class="empty-state-desc">${err.message}</p>
        <a href="/dashboard.html" class="btn btn-primary">Return to Dashboard</a>
      </div>
    `;
  }
});

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
