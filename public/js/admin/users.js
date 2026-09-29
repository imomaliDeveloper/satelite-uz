/**
 * SATELITE.UZ - Admin Users & Roles Controller
 */
let currentPage = 1;
let currentLimit = 15;
let searchTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('admin-sidebar-nav').innerHTML = getSidebarHtml('users');
  setupListeners();
  loadUsers();
});

function setupListeners() {
  const searchInput = document.getElementById('users-search');
  const roleFilter = document.getElementById('users-role-filter');
  const statusFilter = document.getElementById('users-status-filter');
  const prevBtn = document.getElementById('users-prev-btn');
  const nextBtn = document.getElementById('users-next-btn');

  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      currentPage = 1;
      loadUsers();
    }, 350);
  });

  roleFilter.addEventListener('change', () => { currentPage = 1; loadUsers(); });
  statusFilter.addEventListener('change', () => { currentPage = 1; loadUsers(); });

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadUsers();
    }
  });

  nextBtn.addEventListener('click', () => {
    currentPage++;
    loadUsers();
  });
}

async function loadUsers() {
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">Refreshing users...</td></tr>`;

  const search = document.getElementById('users-search').value.trim();
  const role = document.getElementById('users-role-filter').value;
  const status = document.getElementById('users-status-filter').value;

  const params = new URLSearchParams({
    page: currentPage,
    limit: currentLimit
  });

  if (search) params.append('search', search);
  if (role) params.append('role', role);
  if (status) params.append('status', status);

  try {
    const res = await API.get(`/users?${params.toString()}`);
    const users = res.data || [];
    renderUsersTable(users, res.pagination);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--danger); padding: 30px;">${err.message}</td></tr>`;
  }
}

function renderUsersTable(users, pagination) {
  const tbody = document.getElementById('users-tbody');

  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">No users found matching query.</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(u => {
    const isAdmin = u.role === 'ADMIN';
    const isActive = u.isActive;

    return `
      <tr>
        <td style="font-weight: 700;">${escapeHtml(u.name)}</td>
        <td><code>${escapeHtml(u.email)}</code></td>
        <td>
          <span class="badge ${isAdmin ? 'badge-hard' : 'badge-subject'}">
            ${u.role}
          </span>
        </td>
        <td>
          <span class="badge ${isActive ? 'badge-status-active' : 'badge-status-inactive'}">
            ${isActive ? 'Active' : 'Deactivated'}
          </span>
        </td>
        <td style="color: var(--text-muted); font-size: 0.85rem;">
          ${new Date(u.createdAt).toLocaleDateString()}
        </td>
        <td style="color: var(--text-muted); font-size: 0.85rem;">
          ${u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Never'}
        </td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-outline" title="Change Role" onclick="changeRole('${u.id}', '${u.role}')">
              ${isAdmin ? 'Demote to Student' : 'Promote to Admin'}
            </button>
            <button class="btn btn-sm ${isActive ? 'btn-danger' : 'btn-secondary'}" onclick="toggleUserStatus('${u.id}', ${isActive})">
              ${isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (pagination) {
    document.getElementById('users-pagination-text').textContent = 
      `Showing Page ${pagination.page} of ${pagination.totalPages || 1} (${pagination.total} accounts)`;
    document.getElementById('users-prev-btn').disabled = pagination.page <= 1;
    document.getElementById('users-next-btn').disabled = pagination.page >= pagination.totalPages;
  }
}

async function changeRole(userId, currentRole) {
  const nextRole = currentRole === 'ADMIN' ? 'STUDENT' : 'ADMIN';
  if (!confirm(`Are you sure you want to change this user's role to ${nextRole}?`)) return;

  try {
    await API.patch(`/users/${userId}`, { role: nextRole });
    Toast.success(`Role changed to ${nextRole}.`);
    loadUsers();
  } catch (err) {
    Toast.error(err.message || 'Failed to update role.');
  }
}

async function toggleUserStatus(userId, currentIsActive) {
  const nextStatus = !currentIsActive;
  const actionText = nextStatus ? 'activate' : 'deactivate';
  if (!confirm(`Are you sure you want to ${actionText} this user account?`)) return;

  try {
    await API.patch(`/users/${userId}`, { isActive: nextStatus });
    Toast.success(`User ${actionText}d.`);
    loadUsers();
  } catch (err) {
    Toast.error(err.message || `Failed to ${actionText} user.`);
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

window.changeRole = changeRole;
window.toggleUserStatus = toggleUserStatus;
