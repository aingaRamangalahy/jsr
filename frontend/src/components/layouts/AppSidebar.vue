<template>
  <aside
    class="hidden md:block w-64 bg-white dark:bg-[#1e1f23] border-r border-gray-200 dark:border-[#27292f] fixed top-16 h-[calc(100vh-4rem)] overflow-hidden"
  >
    <!-- Main content wrapper with scrollable area -->
    <div class="flex flex-col h-full">
      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="mb-6">
          <h3
            class="text-sm font-medium text-gray-500 dark:text-blue-300 uppercase tracking-wider mb-3"
          >
            Resource Types
          </h3>
          <Menu :model="resourceTypeItems" class="border-none p-0 w-full" />
        </div>

        <div class="mb-6">
          <h3
            class="text-sm font-medium text-gray-500 dark:text-blue-300 uppercase tracking-wider mb-3"
          >
            Filter By
          </h3>
          <Menu :model="filterItems" class="border-none p-0 w-full" />
        </div>
      </div>

      <!-- Footer pinned to bottom -->
      <div class="mt-auto border-t border-gray-200 dark:border-gray-800 py-3 px-4">
        <AppFooter />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import AppFooter from '@/components/layouts/AppFooter.vue';
import Menu from '@/volt/Menu.vue';
import { computed } from 'vue';
import { useFilters } from '@/composables/useFilters';
import { useRoute, useRouter } from 'vue-router';

const { filters, updateFilter } = useFilters();
const route = useRoute();
const router = useRouter();

// Resource types based on ResourceType type
const resourceTypes = [
  { id: 'all', name: 'All Resources', icon: 'pi pi-globe' },
  { id: 'website', name: 'Websites', icon: 'pi pi-globe' },
  { id: 'book', name: 'Books', icon: 'pi pi-book' },
  { id: 'youtube', name: 'YouTube Channels', icon: 'pi pi-youtube' },
  { id: 'twitter', name: 'Twitter Accounts', icon: 'pi pi-twitter' },
  { id: 'course', name: 'Courses', icon: 'pi pi-desktop' },
  { id: 'podcast', name: 'Podcasts', icon: 'pi pi-volume-up' },
  { id: 'must-read', name: 'Must read articles', icon: 'pi pi-star' },
];

const sidebarFilters = [
  { id: 'beginner', name: 'Beginner Friendly', icon: 'pi pi-users', level: 'beginner' },
  { id: 'intermediate', name: 'Intermediate', icon: 'pi pi-shield', level: 'intermediate' },
  { id: 'advanced', name: 'Advanced Topics', icon: 'pi pi-server', level: 'advanced' },
];

// Helper function to handle navigation
const handleFilterUpdate = (filterType: string, value: string) => {
  // If not on home page, navigate to home with query params
  if (route.path !== '/') {
    router.push({
      path: '/',
      query: {
        [filterType]: value,
      },
    });
  } else {
    // Already on home page, just update the filter
    updateFilter(filterType, value);
  }
};

// Map resource type items to menu items
const resourceTypeItems = computed(() => {
  return resourceTypes.map((type) => ({
    label: type.name,
    icon: type.icon,
    class:
      filters.value.type === type.id
        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium rounded-md'
        : '',
    command: () => {
      handleFilterUpdate('type', type.id);
    },
  }));
});

// Map filter items to menu items
const filterItems = computed(() => {
  return sidebarFilters.map((filter) => ({
    label: filter.name,
    icon: filter.icon,
    class:
      (filter.sort && filters.value.sortBy === filter.sort) ||
      (filter.level && filters.value.skillLevel === filter.level)
        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium rounded-md'
        : '',
    command: () => {
      // Update the appropriate filter based on the item
      if (filter.sort) handleFilterUpdate('sortBy', filter.sort);
      if (filter.level) handleFilterUpdate('skillLevel', filter.level);
    },
  }));
});
</script>
