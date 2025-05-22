import api from './api.service'
import type { Category, ApiResponse } from '@jsr/shared/types'

export const categoryService = {
  // Get all categories
  async getCategories() {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories')
    return data
  },

  // Get a single category by ID
  async getCategoryById(id: string) {
    const { data } = await api.get<ApiResponse<Category>>(`/categories/${id}`)
    return data
  }
}

export default categoryService 