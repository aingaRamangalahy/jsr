import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api.service'

export interface User {
  id: string
  name: string
  email?: string
  githubId: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userDisplayName = computed(() => user.value?.name || 'Guest')
  
  // Actions
  
  // Check if user is already authenticated and fetch user data
  async function checkAuth() {
    if (!token.value) return

    try {
      loading.value = true
      const response = await api.get('/auth/me')
      user.value = response.data.data
    } catch (err) {
      console.error('Failed to fetch user data:', err)
      logout()
    } finally {
      loading.value = false
    }
  }
  
  // Handle GitHub OAuth callback
  async function handleGitHubCallback(code: string) {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/auth/github/callback', { code })
      token.value = response.data.data.token
      user.value = response.data.data.user
      
      // Save token to localStorage
      localStorage.setItem('auth_token', token.value)
      
      return true
    } catch (err: any) {
      console.error('GitHub login failed:', err)
      error.value = err.response?.data?.error?.message || 'Failed to authenticate with GitHub'
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Initiate GitHub OAuth flow
  function loginWithGitHub() {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
    const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI || `${window.location.origin}/auth/callback`
    
    const githubAuthUrl = 
      `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`
      
    window.location.href = githubAuthUrl
  }
  
  // Logout user
  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }
  
  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userDisplayName,
    checkAuth,
    handleGitHubCallback,
    loginWithGitHub,
    logout
  }
}) 