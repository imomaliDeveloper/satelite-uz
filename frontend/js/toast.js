/**
 * SATELITE.UZ - Modern Toast Notification System
 */
const Toast = (() => {
  let container = null;

  function init() {
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
  }

  function show(message, type = 'info', duration = 4000) {
    init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      success: '✔',
      error: '✖',
      warning: '⚠',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <span style="font-weight: 800; font-size: 1.1rem;">${icons[type] || 'ℹ'}</span>
      <div style="flex: 1;">${message}</div>
      <button style="color: var(--text-muted); font-size: 1.1rem; padding: 0 4px; line-height: 1;" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 250);
      }, duration);
    }
  }

  return {
    success: (msg, dur) => show(msg, 'success', dur),
    error: (msg, dur) => show(msg, 'error', dur),
    info: (msg, dur) => show(msg, 'info', dur),
    warning: (msg, dur) => show(msg, 'warning', dur)
  };
})();

window.Toast = Toast;
