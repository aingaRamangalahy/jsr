import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response && error.response.status === 401) {
      // Only redirect if the 401 is NOT from the login attempt itself
      if (error.config.url !== '/auth/admin/login') {
        console.log('Unauthorized (session expired/invalid), redirecting to login:', error.response);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminName');
        window.location.href = '/login';
      } else {
        // If 401 is from login, let authStore handle the error message display
        console.log('Unauthorized (login failed):', error.response);
      }
    }
    return Promise.reject(error);
  }
)

export default api 