import api from './api'
import type { ApiResponse, ResourceType } from '@jsr/shared/types'

// Resource Type service methods
export const resourceTypeService = {
  // Get all resource types
  async getResourceTypes(): Promise<ApiResponse<ResourceType[]>> {
    const response = await api.get('/types')
    return response.data
  },

  // Get a single resource type by ID
  async getResourceTypeById(id: string): Promise<ApiResponse<ResourceType>> {
    const response = await api.get(`/types/${id}`)
    return response.data
  },

  // Create a new resource type
  async createResourceType(name: string, description: string): Promise<ApiResponse<ResourceType>> {
    const response = await api.post('/types', { name, description })
    return response.data
  },

  // Update a resource type
  async updateResourceType(id: string, name: string, description: string): Promise<ApiResponse<ResourceType>> {
    const response = await api.put(`/types/${id}`, { name, description })
    return response.data
  },

  // Delete a resource type
  async deleteResourceType(id: string): Promise<ApiResponse<null>> {
    const response = await api.delete(`/types/${id}`)
    return response.data
  }
}

export default resourceTypeService 