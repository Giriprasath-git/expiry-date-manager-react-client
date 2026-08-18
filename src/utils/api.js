const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, '');

/**
 * Utility wrapper for backend API HTTP requests
 */
export async function apiRequest(endpoint, options = {}) {
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${formattedEndpoint}`;
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        data.message ||
        (Array.isArray(data.errors) && data.errors.map(e => e.msg).join(', ')) ||
        'API Request failed';
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please try again later.');
    }
    throw error;
  }
}
