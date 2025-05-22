import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@jsr/shared/types'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Initialize auth state from localStorage
  const initAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  // Login with GitHub
  const loginWithGitHub = async () => {
    try {
      isLoading.value = true
      error.value = null
      const { url } = await authService.getGitHubAuthUrl()
      window.location.href = url
    } catch (err) {
      error.value = 'Failed to initiate GitHub login'
      console.error('GitHub login error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Handle GitHub OAuth callback
  const handleGitHubCallback = async (code: string) => {
    try {
      isLoading.value = true
      error.value = null
      const { user: userData, token: authToken } = await authService.handleGitHubCallback(code)
      
      // Store auth data
      token.value = authToken
      user.value = userData
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      return true
    } catch (err) {
      error.value = 'Failed to complete GitHub login'
      console.error('GitHub callback error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token.value && !!user.value
  }

  return {
    user,
    token,
    isLoading,
    error,
    initAuth,
    loginWithGitHub,
    handleGitHubCallback,
    logout,
    isAuthenticated
  }
}) 