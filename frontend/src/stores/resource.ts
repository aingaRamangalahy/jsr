import type { Resource } from '@/types/resource'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { resources as initialResources } from '@/data/resources'

export interface FilterState {
  sortBy: string
  type: string
  skillLevel: string
  frameworks: string[]
  category: string
  search: string
}

export const useResourceStore = defineStore('resources', () => {
  const resources = ref([...initialResources])

  const filters = ref<FilterState>({
    sortBy: 'newest',
    type: 'all',
    skillLevel: 'all',
    frameworks: [],
    category: 'all',
    search: '',
  })

  // Computed property for filtered resources
  const filteredResources = computed(() => {
    let result = [...resources.value]

    if (filters.value.search.trim()) {
      const searchLower = filters.value.search.toLowerCase()
      result = result.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchLower) ||
          resource.description.toLowerCase().includes(searchLower) ||
          resource.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    // Category filter
    if (filters.value.category !== 'all') {
      switch (filters.value.category) {
        case 'blog':
          result = result.filter((r) => r.type === 'website' || r.type === 'book')
          break
        case 'youtube':
          result = result.filter((r) => r.type === 'youtube')
          break
        case 'twitter':
          result = result.filter((r) => r.type === 'twitter')
          break
        // Add more categories as needed
      }
    }

    // Type filter
    if (filters.value.type !== 'all') {
      result = result.filter((r) => r.type === filters.value.type)
    }

    // Skill level filter
    if (filters.value.skillLevel !== 'all') {
      result = result.filter((r) => r.skillLevel === filters.value.skillLevel)
    }

    // Framework filters
    if (filters.value.frameworks.length > 0) {
      result = result.filter((resource) =>
        filters.value.frameworks.some((framework) => resource.tags.includes(framework)),
      )
    }

    // Sorting
    switch (filters.value.sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())
        break
      case 'popular':
        result.sort((a, b) => b.votes - a.votes)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        break
    }

    return result
  })

  // Update filter functions
  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    filters.value[key] = value
  }

  function updateFrameworkFilters(frameworks: string[]) {
    filters.value.frameworks = frameworks
  }

  function toggleFramework(frameworkId: string) {
    const index = filters.value.frameworks.indexOf(frameworkId)
    if (index === -1) {
      filters.value.frameworks.push(frameworkId)
    } else {
      filters.value.frameworks.splice(index, 1)
    }
  }

  function clearFilters() {
    filters.value = {
      sortBy: 'newest',
      type: 'all',
      skillLevel: 'all',
      frameworks: [],
      category: 'all',
      search: '',
    }
  }

  function setSearchQuery(query: string) {
    filters.value.search = query
  }

  // Resource management
  const addResource = (resource: Resource) => {
    // Generate a new ID based on the highest current ID
    const newId = Math.max(0, ...resources.value.map((r) => r.id)) + 1
    const newResource = {
      ...resource,
      id: newId,
      votes: 0,
      rating: 0,
      dateAdded: new Date().toISOString(),
    }

    resources.value.push(newResource)
    return newResource
  }

  const getResourceById = (id: number) => {
    return resources.value.find((r) => r.id === id)
  }

  return {
    resources,
    filters,
    filteredResources,
    updateFilter,
    updateFrameworkFilters,
    toggleFramework,
    clearFilters,
    setSearchQuery,
    addResource,
    getResourceById,
  }
})
