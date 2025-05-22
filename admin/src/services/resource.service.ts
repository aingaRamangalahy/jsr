import api from './api'
import type { ApiResponse, PaginatedResponse, Resource, ResourceStatus } from '@jsr/shared/types'

// Resource filters type
export interface ResourceFilters {
  status?: ResourceStatus;
  category?: string;
  type?: string;
  difficulty?: string;
  pricingType?: 'free' | 'paid';
  search?: string;
}

// Resource data for create/update operations
export interface ResourceData {
  name: string;
  description: string;
  url: string;
  category: string;
  type: string;
  difficulty: string;
  tags: string[];
  pricingType: 'free' | 'paid';
  price?: number;
}

// Resource service methods
export const resourceService = {
  // Get all resources with optional filtering
  async getResources(filters: ResourceFilters = {}, page = 1, limit = 10): Promise<PaginatedResponse<Resource>> {
    const params = { page, limit, ...filters }
    const response = await api.get('/api/v1/resources/admin/all', { params })
    return response.data
  },

  // Get a single resource by ID
  async getResourceById(id: string): Promise<ApiResponse<Resource>> {
    const response = await api.get(`/api/v1/resources/admin/${id}`)
    return response.data
  },

  // Create a new resource
  async createResource(data: ResourceData): Promise<ApiResponse<Resource>> {
    const response = await api.post('/api/v1/resources/admin', data)
    return response.data
  },

  // Update an existing resource
  async updateResource(id: string, data: ResourceData): Promise<ApiResponse<Resource>> {
    const response = await api.put(`/api/v1/resources/admin/${id}`, data)
    return response.data
  },

  // Update resource status (approve/reject)
  async updateResourceStatus(id: string, status: ResourceStatus): Promise<ApiResponse<Resource>> {
    const response = await api.put(`/api/v1/resources/admin/${id}/status`, { status })
    return response.data
  },

  // Update resource pricing information
  async updateResourcePricing(id: string, pricingType: 'free' | 'paid', price?: number): Promise<ApiResponse<Resource>> {
    const response = await api.put(`/api/v1/resources/admin/${id}/pricing`, { 
      pricingType, 
      price: pricingType === 'paid' ? price : undefined 
    })
    return response.data
  }
}

export default resourceService 