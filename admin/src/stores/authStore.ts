import { defineStore } from 'pinia'
import api from '../services/api'

interface AuthState {
  token: string | null
  adminName: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('adminToken'),
    adminName: localStorage.getItem('adminName'),
    isAuthenticated: !!localStorage.getItem('adminToken'),
    loading: false,
    error: null
  }),
  
  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.post('/api/v1/auth/admin/login', {
          email,
          password
        })
        
        const { token, admin } = response.data.data
        
        // Store in state
        this.token = token
        this.adminName = admin.name
        this.isAuthenticated = true
        
        // Store in localStorage
        localStorage.setItem('adminToken', token)
        localStorage.setItem('adminName', admin.name)
        
        return true
      } catch (error: any) {
        this.error = error.response?.data?.error?.message || 'Failed to login'
        return false
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      // Clear state
      this.token = null
      this.adminName = null
      this.isAuthenticated = false
      
      // Clear localStorage
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminName')
    }
  }
}) 