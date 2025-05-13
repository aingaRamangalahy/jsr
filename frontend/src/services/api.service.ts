import axios from 'axios'
import { useAuth } from '@/composables/useAuth'
import { toast } from 'vue-sonner'

// Create a custom axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Get auth state at runtime to avoid SSR issues
const getAuthState = () => useAuth()

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle authentication error
      localStorage.removeItem('auth_token')
      
      // Show auth modal instead of redirecting
      const authState = getAuthState()
      authState.openAuthModal()
      toast.error('Your session has expired. Please sign in again.')
    }
    return Promise.reject(error)
  }
)

export default api 