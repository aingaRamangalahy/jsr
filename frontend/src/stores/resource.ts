import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { resourceService } from '@/services/api/resource.service';
import type { Resource, ResourceCreateDTO } from '@jsr/common';

export interface FilterState {
  sortBy: string;
  type: string;
  skillLevel: string;
  frameworks: string[];
  category: string;
  search: string;
}

export const useResourceStore = defineStore('resources', () => {
  const resources = ref<Resource[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const filters = ref<FilterState>({
    sortBy: 'newest',
    type: 'all',
    skillLevel: 'all',
    frameworks: [],
    category: 'all',
    search: '',
  });

  // Computed property for filtered resources
  const filteredResources = computed(() => {
    let result = [...resources.value];

    if (filters.value.search.trim()) {
      const searchLower = filters.value.search.toLowerCase();
      result = result.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchLower) ||
          resource.description.toLowerCase().includes(searchLower) ||
          resource.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)),
      );
    }

    // Category filter
    if (filters.value.category !== 'all') {
      switch (filters.value.category) {
        case 'blog':
          result = result.filter((r) => r.type === 'website' || r.type === 'book');
          break;
        case 'youtube':
          result = result.filter((r) => r.type === 'youtube');
          break;
        case 'twitter':
          result = result.filter((r) => r.type === 'twitter');
          break;
        // Add more categories as needed
      }
    }

    // Type filter
    if (filters.value.type !== 'all') {
      result = result.filter((r) => r.type === filters.value.type);
    }

    // Skill level filter
    if (filters.value.skillLevel !== 'all') {
      result = result.filter((r) => r.skillLevel === filters.value.skillLevel);
    }

    // Framework filters
    if (filters.value.frameworks.length > 0) {
      result = result.filter((resource) =>
        filters.value.frameworks.some((framework) => resource.tags.includes(framework)),
      );
    }

    // Sorting
    switch (filters.value.sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        break;
      case 'popular':
        result.sort((a, b) => b.votes - a.votes);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
    }

    return result;
  });

  async function fetchResources() {
    if (isLoading.value) return;
    isLoading.value = true;
    error.value = null;
    try {
      const response = await resourceService.getResources();
      resources.value = response.data;
    } catch (err) {
      console.error('Error fetching resources:', err);
      error.value = 'Failed to fetch resources. Please try again later.';
    } finally {
      isLoading.value = false;
    }
  }

  // Update filter functions
  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    if (value === 'all') {
      clearFilters();
    } else {
      filters.value[key] = value;
    }
  }

  function updateFrameworkFilters(frameworks: string[]) {
    filters.value.frameworks = frameworks;
  }

  function toggleFramework(frameworkId: string) {
    const index = filters.value.frameworks.indexOf(frameworkId);
    if (index === -1) {
      filters.value.frameworks.push(frameworkId);
    } else {
      filters.value.frameworks.splice(index, 1);
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
    };
  }

  function setSearchQuery(query: string) {
    filters.value.search = query;
  }

  // Resource management
  async function addResource(resourceData: ResourceCreateDTO) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await resourceService.createResource(resourceData);
      resources.value?.unshift(response.data);
      return response.data;
    } catch (err) {
      error.value = 'Failed to add resource';
      console.error(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function getResourceById(id: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await resourceService.getResourceById(id);
      return response.data;
    } catch (err) {
      error.value = 'Failed to get resource';
      console.error(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function init() {
    fetchResources();
  }

  return {
    resources,
    filters,
    filteredResources,
    isLoading,
    error,
    init,
    fetchResources,
    updateFilter,
    updateFrameworkFilters,
    toggleFramework,
    clearFilters,
    setSearchQuery,
    addResource,
    getResourceById,
  };
});
