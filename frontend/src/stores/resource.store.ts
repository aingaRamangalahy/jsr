import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Resource } from '@jsr/shared/types'
import { resourceService, ResourceWithInteractions } from '@/services/resource.service'
import { useInteractionsStore } from './interactions.store'
import { interactionService } from '@/services/interaction.service'

export const useResourceStore = defineStore('resource', () => {
  const resources = ref<ResourceWithInteractions[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const filters = ref({
    category: '',
    type: '',
    difficulty: [] as string[],
    pricingType: [] as ('free' | 'paid')[],
    search: ''
  })
  
  // Get the interactions store for syncing
  const interactionsStore = useInteractionsStore()

  // Computed property for filtered resources
  const filteredResources = computed(() => resources.value)

  // Sync embedded interactions to the interactions store
  const syncInteractionsToStore = (resourcesList: ResourceWithInteractions[]) => {
    // Check if any resources have embedded interactions
    const resourcesWithInteractions = resourcesList.filter(
      resource => resource.id && resource.userInteractions !== undefined
    );
    
    if (resourcesWithInteractions.length > 0) {
      // Extract interactions using the utility method
      const interactionsMap = interactionService.extractInteractionsFromResources(resourcesWithInteractions);
      
      // Update the interactions store with the extracted data
      interactionsStore.updateInteractionsMap(interactionsMap);
    }
  }

  // Load resources with current filters
  const loadResources = async (append = false) => {
    try {
      loading.value = true
      error.value = null
      const response = await resourceService.getResources(filters.value, currentPage.value)
      
      // If append is true, add to existing resources, otherwise replace
      if (append) {
        resources.value = [...resources.value, ...response.data]
      } else {
        resources.value = response.data
      }
      
      // Sync interactions to the store if they exist in the response
      syncInteractionsToStore(response.data)
      
      totalPages.value = response.pagination.pages
    } catch (err) {
      error.value = 'Failed to load resources'
      console.error('Error loading resources:', err)
    } finally {
      loading.value = false
    }
  }

  // Load free resources
  const loadFreeResources = async (append = false) => {
    try {
      loading.value = true
      error.value = null
      const response = await resourceService.getFreeResources(currentPage.value)
      
      // If append is true, add to existing resources, otherwise replace
      if (append) {
        resources.value = [...resources.value, ...response.data]
      } else {
        resources.value = response.data
      }
      
      // Sync interactions to the store if they exist in the response
      syncInteractionsToStore(response.data)
      
      totalPages.value = response.pagination.pages
    } catch (err) {
      error.value = 'Failed to load free resources'
      console.error('Error loading free resources:', err)
    } finally {
      loading.value = false
    }
  }

  // Load paid resources
  const loadPaidResources = async (append = false) => {
    try {
      loading.value = true
      error.value = null
      const response = await resourceService.getPaidResources(currentPage.value)
      
      // If append is true, add to existing resources, otherwise replace
      if (append) {
        resources.value = [...resources.value, ...response.data]
      } else {
        resources.value = response.data
      }
      
      // Sync interactions to the store if they exist in the response
      syncInteractionsToStore(response.data)
      
      totalPages.value = response.pagination.pages
    } catch (err) {
      error.value = 'Failed to load paid resources'
      console.error('Error loading paid resources:', err)
    } finally {
      loading.value = false
    }
  }

  // Update filters
  const updateFilters = (newFilters: Partial<typeof filters.value>) => {
    if (newFilters.category === 'all') {
      // Clear category filter but keep others
      filters.value.category = ''
    } else {
      // For array filters, handle them properly
      if (newFilters.difficulty !== undefined) {
        filters.value.difficulty = newFilters.difficulty
      }
      if (newFilters.pricingType !== undefined) {
        filters.value.pricingType = newFilters.pricingType
      }
      
      // For string filters
      if (newFilters.category !== undefined) {
        filters.value.category = newFilters.category
      }
      if (newFilters.type !== undefined) {
        filters.value.type = newFilters.type
      }
      if (newFilters.search !== undefined) {
        filters.value.search = newFilters.search
      }
    }
    
    currentPage.value = 1
    loadResources()
  }

  // Change page
  const changePage = (page: number) => {
    currentPage.value = page
    loadResources()
  }

  // Get a resource by ID with interactions
  const getResourceById = async (id: string): Promise<ResourceWithInteractions | null> => {
    try {
      loading.value = true
      error.value = null
      const response = await resourceService.getResourceById(id)
      
      if (response.status === 'success' && response.data) {
        // Sync interaction data if available
        if (response.data.userInteractions) {
          // Use the extract method to update interactions store
          const resourceWithInteractions = [response.data];
          syncInteractionsToStore(resourceWithInteractions);
        }
        
        return response.data
      }
      return null
    } catch (err) {
      error.value = 'Failed to load resource'
      console.error('Error loading resource:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    resources,
    loading,
    error,
    currentPage,
    totalPages,
    filters,
    filteredResources,
    loadResources,
    loadFreeResources,
    loadPaidResources,
    updateFilters,
    changePage,
    getResourceById
  }
}) 