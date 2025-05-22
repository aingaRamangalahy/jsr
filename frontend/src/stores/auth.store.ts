import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api.service'
import * as supabaseService from '../services/supabase.service'
import type { User as SupabaseUser } from '@supabase/supabase-js'
// Import will be resolved at runtime when store is actually used
import { useInteractionsStore } from './interactions.store'

export interface User {
  id: string
  name: string
  email?: string
  githubId?: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const supabaseUser = ref<SupabaseUser | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const isAuthenticated = computed(() => !!supabaseUser.value)
  const userDisplayName = computed(() => user.value?.name || supabaseUser.value?.user_metadata?.name || 'Guest')
  const userAvatar = computed(() => user.value?.avatar || supabaseUser.value?.user_metadata?.avatar_url || '')
  
  // Actions
  
  // Check if user is already authenticated and fetch user data
  async function checkAuth() {
    try {
      loading.value = true
      
      // Get session from Supabase
      const { session } = await supabaseService.getSession()
      
      if (session) {
        // Get user from Supabase
        const supabaseUserData = await supabaseService.getUser()
        supabaseUser.value = supabaseUserData
        
        // Save token to local state
        token.value = session.access_token
        localStorage.setItem('auth_token', session.access_token)
        
        // Sync with backend
        await syncUserWithBackend(supabaseUserData)
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err)
      await logout()
    } finally {
      loading.value = false
    }
  }

  // Sync Supabase user with our backend
  async function syncUserWithBackend(supabaseUserData: SupabaseUser) {
    try {
      // Send user data to our backend to create/update the user
      const response = await api.post('/auth/sync', {
        id: supabaseUserData.id,
        email: supabaseUserData.email,
        name: supabaseUserData.user_metadata.name || supabaseUserData.email?.split('@')[0],
        avatar: supabaseUserData.user_metadata.avatar_url,
        provider: supabaseUserData.app_metadata.provider,
        providerId: supabaseUserData.user_metadata.sub
      })
      
      // Set our user object
      user.value = response.data.data
    } catch (err) {
      console.error('Failed to sync user with backend:', err)
    }
  }
  
  // Handle authentication callback
  async function handleCallback() {
    try {
      loading.value = true
      error.value = null
      
      console.log('Auth store: Handling callback')
      
      // Handle Supabase callback
      const { session } = await supabaseService.handleAuthCallback()
      
      if (!session) {
        console.error('Auth store: No session returned from handleAuthCallback')
        error.value = 'Authentication failed - No session returned'
        return false
      }
      
      console.log('Auth store: Session obtained', session.user.id)
      
      // Get user from Supabase
      const supabaseUserData = await supabaseService.getUser()
      
      if (!supabaseUserData) {
        console.error('Auth store: Failed to get user data')
        error.value = 'Authentication failed - Could not get user data'
        return false
      }
      
      console.log('Auth store: User data retrieved', supabaseUserData.id)
      supabaseUser.value = supabaseUserData
      
      // Save token
      token.value = session.access_token
      localStorage.setItem('auth_token', session.access_token)
      
      // Sync with backend
      try {
        await syncUserWithBackend(supabaseUserData)
        console.log('Auth store: User synced with backend')
      } catch (syncError) {
        console.error('Auth store: Failed to sync user with backend', syncError)
        // Don't fail the auth process for backend sync issues
      }
      
      return true
    } catch (err: any) {
      console.error('Auth store: Authentication callback failed:', err)
      error.value = err.message || 'Failed to complete authentication'
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Initiate GitHub OAuth flow
  async function loginWithGitHub() {
    try {
      loading.value = true
      error.value = null
      await supabaseService.signInWithGitHub()
      return true
    } catch (err: any) {
      console.error('GitHub login failed:', err)
      error.value = err.message || 'Failed to authenticate with GitHub'
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Logout user
  async function logout() {
    try {
      // Sign out from Supabase
      await supabaseService.signOut()
      
      // Clear local state
      user.value = null
      supabaseUser.value = null
      token.value = null
      localStorage.removeItem('auth_token')
      
      // Clear interactions store
      // Note: We use this approach to avoid circular imports
      const interactionsStore = useInteractionsStore()
      interactionsStore.clearInteractions()
      
      return true
    } catch (err) {
      console.error('Logout failed:', err)
      return false
    }
  }
  
  return {
    user,
    supabaseUser,
    token,
    loading,
    error,
    isAuthenticated,
    userDisplayName,
    userAvatar,
    checkAuth,
    handleCallback,
    loginWithGitHub,
    logout
  }
}) 