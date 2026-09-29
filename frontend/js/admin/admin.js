/**
 * SATELITE.UZ - Admin Portal Core Controller & Guards
 */
document.addEventListener('DOMContentLoaded', () => {
  // Enforce Admin Authorization
  if (!Auth.requireAdmin()) return;

  renderAdminHeader();
  setupSidebarToggle();
});

function renderAdminHeader() {
  const user = Auth.getUser();
  const userNameEl = document.getElementById('admin-user-name');
  if (userNameEl && user) {
    userNameEl.textContent = user.name;
  }
}

function setupSidebarToggle() {
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebar = document.querySelector('.admin-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

function getSidebarHtml(activePage) {
  return `
    <div class="admin-sidebar-header">
      <a href="/admin/dashboard.html" class="brand-logo" style="font-size: 1.25rem;">
        <div class="brand-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2">
            <circle cx="12" cy="12" r="3"></circle>
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)"></ellipse>
          </svg>
        </div>
        <span>SATELITE <span style="font-size: 0.75rem; color: #f59e0b; background: rgba(245,158,11,0.15); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(245,158,11,0.3);">ADMIN</span></span>
      </a>
    </div>

    <nav class="admin-nav">
      <a href="/admin/dashboard.html" class="admin-nav-item ${activePage === 'dashboard' ? 'active' : ''}">
        <span>📊</span> Dashboard
      </a>
      <a href="/admin/questions.html" class="admin-nav-item ${activePage === 'questions' ? 'active' : ''}">
        <span>📝</span> Question Bank
      </a>
      <a href="/admin/question-create.html" class="admin-nav-item ${activePage === 'question-create' ? 'active' : ''}">
        <span>➕</span> Add Question
      </a>
      <a href="/admin/subjects.html" class="admin-nav-item ${activePage === 'subjects' ? 'active' : ''}">
        <span>📚</span> Subjects
      </a>
      <a href="/admin/topics.html" class="admin-nav-item ${activePage === 'topics' ? 'active' : ''}">
        <span>🏷️</span> Topics
      </a>
      <a href="/admin/exams.html" class="admin-nav-item ${activePage === 'exams' ? 'active' : ''}">
        <span>⏱️</span> Exams & Sets
      </a>
      <a href="/admin/users.html" class="admin-nav-item ${activePage === 'users' ? 'active' : ''}">
        <span>👥</span> Users & Roles
      </a>
      <a href="/admin/analytics.html" class="admin-nav-item ${activePage === 'analytics' ? 'active' : ''}">
        <span>📈</span> Analytics
      </a>
      <a href="/admin/settings.html" class="admin-nav-item ${activePage === 'settings' ? 'active' : ''}">
        <span>⚙️</span> Import & Settings
      </a>
    </nav>

    <div class="admin-sidebar-footer">
      <button class="btn btn-sm btn-secondary theme-toggle-btn btn-with-label" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px;">
        <span>🌙</span> <span>Mode</span>
      </button>
      <a href="/dashboard.html" class="btn btn-sm btn-outline" style="width: 100%; margin-bottom: 8px;">
        Student Dashboard →
      </a>
      <button type="button" class="btn btn-sm btn-danger logout-btn" data-action="logout" data-redirect="/admin/index.html" onclick="Auth.logout('/admin/index.html')" style="width: 100%;">
        🚪 Logout Admin
      </button>
    </div>
  `;
}

window.getSidebarHtml = getSidebarHtml;
