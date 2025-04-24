import apiClient from './config';
import type { ResourceCreateDTO, ResourceUpdateDTO } from '@jsr/common';
import type { FilterState } from '@jsr/common';

export const resourceService = {
  // Get all resources with filtering
  async getResources(filters: FilterState = {} as FilterState) {
    const response = await apiClient.get('/resources');
    return response.data;
  },

  // Get resource by ID
  async getResourceById(id: string) {
    const response = await apiClient.get(`/resources/${id}`);
    return response.data;
  },

  // Create new resource
  async createResource(resource: ResourceCreateDTO) {
    const response = await apiClient.post('/resources', resource);
    return response.data;
  },

  // Update resource
  async updateResource(id: string, resource: ResourceUpdateDTO) {
    const response = await apiClient.put(`/resources/${id}`, resource);
    return response.data;
  },

  // Delete resource
  async deleteResource(id: string) {
    const response = await apiClient.delete(`/resources/${id}`);
    return response.data;
  },

  // Prefetch resource
  async preFetchUrl(url: string) {
    const response = await apiClient.get('/resources/prefetch', {
      params: { url },
    });
    return response.data;
  },
};
