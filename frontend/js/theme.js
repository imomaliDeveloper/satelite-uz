/**
 * SATELITE.UZ - Theme Switcher (Dark / Light Mode)
 * Bulletproof implementation with document-level event delegation
 */
const ThemeManager = (() => {
  const STORAGE_KEY = 'satelite_theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    // Check system preference if no saved theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark'; // Default space aesthetic
  }

  function updateToggleButtons(theme) {
    const isDark = theme === 'dark';
    const icon = isDark ? '☀️' : '🌙';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      if (btn.classList.contains('btn-with-label')) {
        btn.innerHTML = `<span>${icon}</span> <span>${isDark ? 'Light' : 'Dark'} Mode</span>`;
      } else {
        btn.innerHTML = icon;
      }
      btn.setAttribute('aria-label', label);
      btn.title = label;
    });
  }

  function applyTheme(theme) {
    const targetTheme = (theme === 'light') ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', targetTheme);
    if (document.body) {
      document.body.setAttribute('data-theme', targetTheme);
    }
    localStorage.setItem(STORAGE_KEY, targetTheme);
    updateToggleButtons(targetTheme);

    // Notify listeners (e.g. 3D scenes or canvas)
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: targetTheme } }));
  }

  function toggle() {
    const current = getCurrent();
    const next = (current === 'dark') ? 'light' : 'dark';
    applyTheme(next);
  }

  function getCurrent() {
    return document.documentElement.getAttribute('data-theme') || 
           localStorage.getItem(STORAGE_KEY) || 
           'dark';
  }

  // 1. Instant execution to prevent white/dark flash
  const initialTheme = getPreferredTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);

  // 2. DOMContentLoaded setup
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getPreferredTheme());
  });

  // 3. Document-level Event Delegation:
  // Catches clicks on ANY element with .theme-toggle-btn even if injected dynamically by Auth.initNavbar()!
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-toggle-btn');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    }
  });

  return {
    toggle,
    applyTheme,
    getCurrent
  };
})();

window.ThemeManager = ThemeManager;
window.toggleTheme = () => ThemeManager.toggle();
