import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Resource } from '@jsr/shared/types'
import { resourceService } from '@/services/resource.service'

export const useResourceStore = defineStore('resource', () => {
  const resources = ref<Resource[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const filters = ref({
    category: '',
    type: '',
    difficulty: '',
    pricingType: '' as 'free' | 'paid' | '',
    search: ''
  })

  // Computed property for filtered resources
  const filteredResources = computed(() => resources.value)

  // Load resources with current filters
  const loadResources = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await resourceService.getResources(filters.value, currentPage.value)
      resources.value = response.data
      totalPages.value = response.pagination.pages
    } catch (err) {
      error.value = 'Failed to load resources'
      console.error('Error loading resources:', err)
    } finally {
      loading.value = false
    }
  }

  // Load free resources
  const loadFreeResources = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await resourceService.getFreeResources(currentPage.value)
      resources.value = response.data
      totalPages.value = response.pagination.pages
    } catch (err) {
      error.value = 'Failed to load free resources'
      console.error('Error loading free resources:', err)
    } finally {
      loading.value = false
    }
  }

  // Load paid resources
  const loadPaidResources = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await resourceService.getPaidResources(currentPage.value)
      resources.value = response.data
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
      filters.value = { ...filters.value }
    } else {
      filters.value = { ...filters.value, ...newFilters }
    }
    currentPage.value = 1
    loadResources()
  }

  // Change page
  const changePage = (page: number) => {
    currentPage.value = page
    loadResources()
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
    changePage
  }
}) 