import api from './api.service'
import type { User } from '@jsr/shared/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export const authService = {
  // Get GitHub OAuth URL
  async getGitHubAuthUrl() {
    const { data } = await api.get(`${API_URL}/auth/github/url`)
    return data
  },

  // Handle GitHub OAuth callback
  async handleGitHubCallback(code: string): Promise<{ user: User; token: string }> {
    const { data } = await api.get(`${API_URL}/auth/github/callback`, {
      params: { code }
    })
    return data
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const { data } = await api.get(`${API_URL}/auth/me`)
    return data
  }
} 