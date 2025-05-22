import api from './api.service'
import type { Resource, PricingType, ResourceStatus, Vote } from '@jsr/shared/types'

// Define the ResourceFilters interface
export interface ResourceFilters {
  category?: string;
  type?: string;
  difficulty?: string | string[];
  pricingType?: PricingType | PricingType[];
  search?: string;
}

// Resource with added user interactions
export interface ResourceWithInteractions extends Resource {
  userInteractions?: {
    vote: Vote | null;
    isBookmarked: boolean;
  };
  commentCount?: number;
}

// API response with interaction-enhanced resources
interface ResourcesResponse {
  status: string;
  data: ResourceWithInteractions[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const resourceService = {
  // Get all resources with optional filtering
  async getResources(filters: ResourceFilters = {}, page = 1, limit = 10): Promise<ResourcesResponse> {
    // Process array filters to be API-friendly
    const processedFilters: Record<string, any> = { ...filters };
    
    // Convert arrays to comma-separated strings for the API
    if (Array.isArray(processedFilters.difficulty)) {
      processedFilters.difficulty = processedFilters.difficulty.join(',');
    }
    
    if (Array.isArray(processedFilters.pricingType)) {
      processedFilters.pricingType = processedFilters.pricingType.join(',');
    }
    
    const { data } = await api.get('/resources', {
      params: {
        ...processedFilters,
        page,
        limit
      }
    })
    return data
  },

  // Get free resources
  async getFreeResources(page = 1, limit = 10): Promise<ResourcesResponse> {
    const { data } = await api.get('/resources/free', {
      params: { page, limit }
    })
    return data
  },

  // Get paid resources
  async getPaidResources(page = 1, limit = 10): Promise<ResourcesResponse> {
    const { data } = await api.get('/resources/paid', {
      params: { page, limit }
    })
    return data
  },

  // Get resource by ID
  async getResourceById(id: string): Promise<{status: string, data: ResourceWithInteractions}> {
    const { data } = await api.get(`/resources/${id}`)
    return data
  },

  // Submit a new resource
  async submitResource(resource: Omit<Resource, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
    const { data } = await api.post('/resources', resource)
    return data
  },
  
  // Bookmark a resource (requires authentication)
  async bookmarkResource(resourceId: string) {
    return api.post(`/resources/${resourceId}/bookmark`)
  },
  
  // Remove a bookmark (requires authentication)
  async removeBookmark(resourceId: string) {
    return api.delete(`/resources/${resourceId}/bookmark`)
  },
  
  // Get user's bookmarks (requires authentication)
  async getBookmarks(pricingType?: 'free' | 'paid') {
    const params = new URLSearchParams()
    if (pricingType) {
      params.append('pricingType', pricingType)
    }
    const { data } = await api.get('/bookmarks', { params })
    return data
  },

  // Get resources submitted by the current user (requires authentication)
  async getSubmittedResources(statusFilter?: ResourceStatus | 'all') {
    const params = new URLSearchParams()
    if (statusFilter && statusFilter !== 'all') {
      params.append('status', statusFilter)
    }
    const { data } = await api.get('/resources/user/submitted', { params })
    return data
  },

  // Prefetch resource metadata from URL
  async prefetchResource(url: string) {
    try {
      const { data } = await api.get('/resources/prefetch', {
        params: { url },
      })
      return data
    } catch (error) {
      console.error('Error prefetching resource:', error)
      throw error
    }
  }
}

export default resourceService 