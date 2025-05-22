import type { ApiResponse, ResourceType } from '@jsr/shared/types'
import api from './api.service'

export const resourceTypeService = {
    async getResourceTypes(): Promise<ApiResponse<ResourceType[]>> {
        try {
          const { data } = await api.get('/types')
          return data
        } catch (error: any) {
          return {
            status: 'error',
            error: {
              message: error.response?.data?.message || error.message || 'Failed to get resource types',
              code: error.response?.data?.code || 'UNKNOWN_ERROR'
            }
          }
        }
      }
}
