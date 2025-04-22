import { useResourceStore } from '@/stores/resource'
import { computed } from 'vue'

export function useFilters() {
  const resourceStore = useResourceStore()

  const filters = computed({
    get: () => resourceStore.filters,
    set: (value) => Object.assign(resourceStore.filters, value),
  })

  const getTypeOptions = () => [
    { label: 'All Types', value: 'all' },
    { label: 'Websites', value: 'website' },
    { label: 'Books', value: 'book' },
    { label: 'YouTube', value: 'youtube' },
    { label: 'Twitter', value: 'twitter' },
    { label: 'Courses', value: 'course' },
    { label: 'Podcasts', value: 'podcast' },
    { label: 'Must Reads', value: 'must-read' },
  ]


  const getSkillLevelOptions = () => [
    { label: 'All Levels', value: 'all' },
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ]

  const getSortOptions = () => [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    // { label: 'Most Popular', value: 'popular' },
    // { label: 'Highest Rated', value: 'rating' },
  ]

  return {
    filters,
    filteredResources: computed(() => resourceStore.filteredResources),
    updateFilter: resourceStore.updateFilter,
    toggleFramework: resourceStore.toggleFramework,
    updateFrameworkFilters: resourceStore.updateFrameworkFilters,
    clearFilters: resourceStore.clearFilters,
    setSearchQuery: resourceStore.setSearchQuery,
    getTypeOptions,
    getSkillLevelOptions,
    getSortOptions,
  }
}
