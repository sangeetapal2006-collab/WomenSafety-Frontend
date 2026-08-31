import axios from 'axios';

// Base API URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000 // 15s timeout
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('safewoman_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Graceful Error Handling & Session Expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server returned an error response
      if (error.response.status === 401) {
        // Clear invalid token if expired
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
          localStorage.removeItem('safewoman_token');
          localStorage.removeItem('safewoman_user');
          // Optionally redirect if necessary
        }
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Network failure / Server down
      return Promise.reject({
        success: false,
        message: 'Unable to connect to the safety server. Please verify your internet connection or try again later.'
      });
    } else {
      return Promise.reject({
        success: false,
        message: error.message || 'An unexpected request error occurred.'
      });
    }
  }
);

export default api;
