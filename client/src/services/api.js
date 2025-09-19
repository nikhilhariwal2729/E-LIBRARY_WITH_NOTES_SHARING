import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    console.log('API request with token:', token ? 'exists' : 'none');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API response error:', error.response?.status, error.message);
    if (error.response?.status === 401) {
      console.log('401 error - clearing token and redirecting');
      // Token expired or invalid, clear it
      Cookies.remove('token');
      localStorage.removeItem('token');
      // Only redirect if we're not on the auth page and not during initialization
      if (window.location.pathname !== '/auth' && !window.location.pathname.includes('/api')) {
        // Use a small delay to avoid race conditions
        setTimeout(() => {
          window.location.href = '/auth';
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
