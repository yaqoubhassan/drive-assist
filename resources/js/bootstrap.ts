import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Function to get fresh CSRF token
function getCsrfToken(): string | null {
  const token = document.head.querySelector('meta[name="csrf-token"]');
  return token ? token.getAttribute('content') : null;
}

// Set initial CSRF token
const initialToken = getCsrfToken();
if (initialToken) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = initialToken;
  console.log('✅ CSRF token configured for axios');
} else {
  console.error('❌ CSRF token not found');
}

// Refresh token before each request
window.axios.interceptors.request.use(
  (config) => {
    const freshToken = getCsrfToken();
    if (freshToken) {
      config.headers['X-CSRF-TOKEN'] = freshToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 419 errors and force reload
window.axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('⚠️ CSRF token mismatch (419), refreshing page...');
      window.location.reload();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);