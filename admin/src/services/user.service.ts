import api from './api'
import type { ApiResponse } from '@jsr/shared/types'

// Define a User interface specific to the admin application
export interface User {
  id: string
  name: string
  email: string
  githubId?: string
  role: 'user' | 'moderator'
  createdAt: Date
}

// User service methods
export const userService = {
  // Get all users
  async getUsers(): Promise<ApiResponse<User[]>> {
    const response = await api.get('/api/v1/admin/users')
    return response.data
  },

  // Get a single user by ID
  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await api.get(`/api/v1/admin/users/${id}`)
    return response.data
  },

  // Create a new user
  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await api.post('/api/v1/admin/users', userData)
    return response.data
  },

  // Update a user
  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await api.put(`/api/v1/admin/users/${id}`, userData)
    return response.data
  },

  // Delete a user
  async deleteUser(id: string): Promise<ApiResponse<null>> {
    const response = await api.delete(`/api/v1/admin/users/${id}`)
    return response.data
  }
}

export default userService 