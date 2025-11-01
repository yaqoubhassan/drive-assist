/**
 * Clear all browser session data
 */
export function clearBrowserSession() {
  localStorage.clear();
  sessionStorage.clear();

  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
  }

  console.log('🧹 Browser session cleared');
}

/**
 * Force refresh CSRF token from server
 */
export async function refreshCsrfToken() {
  try {
    const response = await fetch(window.location.href, {
      method: 'GET',
      cache: 'no-store',
    });

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const token = doc.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    if (token) {
      const meta = document.querySelector('meta[name="csrf-token"]');
      if (meta) {
        meta.setAttribute('content', token);
      }
      window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
      console.log('✅ CSRF token refreshed');
      return token;
    }
  } catch (error) {
    console.error('❌ Failed to refresh CSRF token:', error);
  }
  return null;
}