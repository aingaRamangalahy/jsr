import axios from 'axios'
import type { Resource, ResourceFilters } from '@jsr/shared/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export const resourceService = {
  // Get all resources with optional filtering
  async getResources(filters: ResourceFilters = {}, page = 1, limit = 10) {
    const { data } = await axios.get(`${API_URL}/resources`, {
      params: {
        ...filters,
        page,
        limit
      }
    })
    return data
  },

  // Get free resources
  async getFreeResources(page = 1, limit = 10) {
    const { data } = await axios.get(`${API_URL}/resources/free`, {
      params: { page, limit }
    })
    return data
  },

  // Get paid resources
  async getPaidResources(page = 1, limit = 10) {
    const { data } = await axios.get(`${API_URL}/resources/paid`, {
      params: { page, limit }
    })
    return data
  },

  // Get resource by ID
  async getResourceById(id: string) {
    const { data } = await axios.get(`${API_URL}/resources/${id}`)
    return data
  },

  // Submit a new resource
  async submitResource(resource: Omit<Resource, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
    const { data } = await axios.post(`${API_URL}/resources`, resource)
    return data
  },
  
  // Bookmark a resource (requires authentication)
  async bookmarkResource(resourceId: string) {
    return axios.post(`${API_URL}/resources/${resourceId}/bookmark`)
  },
  
  // Remove a bookmark (requires authentication)
  async removeBookmark(resourceId: string) {
    return axios.delete(`${API_URL}/resources/${resourceId}/bookmark`)
  },
  
  // Get user's bookmarks (requires authentication)
  async getBookmarks(pricingType?: 'free' | 'paid') {
    const params = new URLSearchParams()
    if (pricingType) {
      params.append('pricingType', pricingType)
    }
    const { data } = await axios.get(`${API_URL}/bookmarks`, { params })
    return data
  }
}

export default resourceService 