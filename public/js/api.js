/**
 * SATELITE.UZ - Centralized API Client
 */
const API = (() => {
  const BASE_URL = '/api';

  async function request(endpoint, options = {}) {
    const token = localStorage.getItem('satelite_token');
    const headers = {
      ...(options.headers || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // If body is NOT FormData, set application/json
    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Handle Session Expiry or Unauthorized
        if (response.status === 401) {
          // If already on login or register, don't loop redirect
          const currentPath = window.location.pathname;
          if (!currentPath.includes('login') && !currentPath.includes('register') && currentPath !== '/' && currentPath !== '/index.html') {
            localStorage.removeItem('satelite_token');
            localStorage.removeItem('satelite_user');
            window.location.href = '/login.html?expired=1';
          }
        }

        const errorMessage = data.message || `Request failed with status ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.code = data.error || 'API_ERROR';
        error.details = data.details;
        throw error;
      }

      return data;
    } catch (err) {
      // Re-throw so callers can catch and handle specific UI logic
      throw err;
    }
  }

  return {
    get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
    patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
    put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
    delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' })
  };
})();

window.API = API;
