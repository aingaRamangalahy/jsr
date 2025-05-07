import api from './api'
import type { ApiResponse, Category } from '@jsr/shared/types'

// Category service methods
export const categoryService = {
  // Get all categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await api.get('/api/v1/categories')
    return response.data
  },

  // Get a single category by ID
  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    const response = await api.get(`/api/v1/categories/${id}`)
    return response.data
  },

  // Create a new category
  async createCategory(name: string, description: string): Promise<ApiResponse<Category>> {
    const response = await api.post('/api/v1/categories', { name, description })
    return response.data
  },

  // Update a category
  async updateCategory(id: string, name: string, description: string): Promise<ApiResponse<Category>> {
    const response = await api.put(`/api/v1/categories/${id}`, { name, description })
    return response.data
  },

  // Delete a category
  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    const response = await api.delete(`/api/v1/categories/${id}`)
    return response.data
  }
}

export default categoryService 