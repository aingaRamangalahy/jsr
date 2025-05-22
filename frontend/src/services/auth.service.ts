import api from './api.service'
import type { User } from '@jsr/shared/types'

export const authService = {
  // Get GitHub OAuth URL
  async getGitHubAuthUrl() {
    const { data } = await api.get('/auth/github/url')
    return data
  },

  // Handle GitHub OAuth callback
  async handleGitHubCallback(code: string): Promise<{ user: User; token: string }> {
    const { data } = await api.get('/auth/github/callback', {
      params: { code }
    })
    return data
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const { data } = await api.get('/auth/me')
    return data
  }
} 