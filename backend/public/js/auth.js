/**
 * SATELITE.UZ - Authentication & Route Guard Module
 */
const Auth = (() => {
  const TOKEN_KEY = 'satelite_token';
  const USER_KEY = 'satelite_user';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function getUser() {
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function clearSession() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn('Storage clear error:', e);
    }
  }

  function isAuthenticated() {
    return !!getToken() && !!getUser();
  }

  function isAdmin() {
    const user = getUser();
    return user && user.role === 'ADMIN';
  }

  async function login(email, password) {
    const res = await API.post('/auth/login', { email, password });
    if (res.success && res.data) {
      setSession(res.data.token, res.data.user);
    }
    return res;
  }

  async function register(name, email, password, confirmPassword) {
    const res = await API.post('/auth/register', { name, email, password, confirmPassword });
    if (res.success && res.data) {
      setSession(res.data.token, res.data.user);
    }
    return res;
  }

  async function logout(redirectUrl) {
    const wasAdmin = isAdmin();
    const destination = redirectUrl || (wasAdmin ? '/admin/index.html' : '/login.html');

    // 1. Wipe local tokens immediately
    clearSession();

    // 2. Notify server in background (fire-and-forget)
    try {
      if (window.API && typeof API.post === 'function') {
        API.post('/auth/logout', {}).catch(() => {});
      }
    } catch (e) {}

    // 3. Navigate cleanly without back-button loop
    window.location.replace(`${destination}?logout=1`);
  }

  async function checkAuth() {
    const token = getToken();
    if (!token) return null;

    try {
      const res = await API.get('/auth/me');
      if (res.success && res.data?.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch (e) {
      clearSession();
    }
    return null;
  }

  function requireAuth(redirectUrl = '/login.html') {
    if (!isAuthenticated()) {
      const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `${redirectUrl}?redirect=${currentUrl}`;
      return false;
    }
    return true;
  }

  function requireAdmin(redirectUrl = '/login.html') {
    if (!isAuthenticated()) {
      window.location.href = `${redirectUrl}?redirect=${encodeURIComponent(window.location.pathname)}`;
      return false;
    }
    if (!isAdmin()) {
      window.location.href = '/dashboard.html';
      return false;
    }
    return true;
  }

  // Update dynamic navbar state across pages
  function initNavbar() {
    const user = getUser();
    const navActions = document.getElementById('navbar-actions');
    const navLinks = document.getElementById('navbar-links');

    if (!navActions) return;

    if (user) {
      navActions.innerHTML = `
        <button class="btn btn-icon theme-toggle-btn" onclick="ThemeManager.toggle()" aria-label="Toggle theme">🌙</button>
        ${user.role === 'ADMIN' ? `<a href="/admin/dashboard.html" class="btn btn-sm btn-outline" style="border-color: #f59e0b; color: #f59e0b;">Admin Panel</a>` : ''}
        <a href="/profile.html" class="btn btn-sm btn-secondary" title="${user.name}">
          <span>👤</span>
          <span>${user.name.split(' ')[0]}</span>
        </a>
        <button type="button" class="btn btn-sm btn-outline logout-btn" data-action="logout" onclick="Auth.logout()">Logout</button>
      `;
    } else {
      navActions.innerHTML = `
        <button class="btn btn-icon theme-toggle-btn" onclick="ThemeManager.toggle()" aria-label="Toggle theme">🌙</button>
        <a href="/login.html" class="btn btn-sm btn-outline">Log In</a>
        <a href="/register.html" class="btn btn-sm btn-primary">Get Started</a>
      `;
    }

    if (window.ThemeManager) {
      window.ThemeManager.applyTheme(window.ThemeManager.getCurrent());
    }
  }

  // Document-level Event Delegation for Logout
  document.addEventListener('click', (e) => {
    const logoutBtn = e.target.closest('.logout-btn, [data-action="logout"]');
    if (logoutBtn) {
      e.preventDefault();
      e.stopPropagation();
      const redirect = logoutBtn.getAttribute('data-redirect');
      logout(redirect);
    }
  });

  return {
    getToken,
    getUser,
    setSession,
    clearSession,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    checkAuth,
    requireAuth,
    requireAdmin,
    initNavbar
  };
})();

window.Auth = Auth;
window.logout = (redirect) => Auth.logout(redirect);

