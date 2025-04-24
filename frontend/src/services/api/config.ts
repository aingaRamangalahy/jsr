import axios from 'axios';

// Get the base URL from environment variables or use a default
const API_URL = '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10_000,
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    // add auth tokens here when needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle specific error cases
    if (error.response) {
      // Server responded with an error status
      console.error('API Error:', error.response.status, error.response.data);

      // Handle specific status codes when needed
      // if (error.response.status === 401 && !originalRequest._retry) {
      //   // Handle unauthorized error or token refresh
      // }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Error setting up the request
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
