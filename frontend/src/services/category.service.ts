import api from './api.service'
import type { Category, ApiResponse } from '@jsr/shared/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export const categoryService = {
  // Get all categories
  async getCategories() {
    const { data } = await api.get<ApiResponse<Category[]>>(`${API_URL}/categories`)
    return data
  },

  // Get a single category by ID
  async getCategoryById(id: string) {
    const { data } = await api.get<ApiResponse<Category>>(`${API_URL}/categories/${id}`)
    return data
  }
}

export default categoryService 