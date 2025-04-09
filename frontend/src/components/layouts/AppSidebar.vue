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
            Categories
          </h3>
          <Menu :model="categoryItems" class="border-none p-0 w-full" />
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

      <CallToAction />

      <!-- Footer pinned to bottom -->
      <div class="mt-auto border-t border-gray-200 dark:border-gray-800 py-3 px-4">
        <AppFooter />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import AppFooter from '@/components/layouts/AppFooter.vue'
  import CallToAction from '@/components/resources/CallToAction.vue'
  import Menu from '@/volt/Menu.vue'
  import { computed } from 'vue'
  import { useFilters } from '@/composables/useFilters'

  const { filters, updateFilter } = useFilters()

  const categories = [
    { id: 'all', name: 'All Resources', icon: 'pi pi-globe' },
    { id: 'blog', name: 'Blogs & Articles', icon: 'pi pi-book' },
    { id: 'youtube', name: 'YouTube Channels', icon: 'pi pi-youtube' },
    { id: 'twitter', name: 'Twitter Accounts', icon: 'pi pi-twitter' },
  ]

  const sidebarFilters = [
    // { id: 'popular', name: 'Most Popular', icon: 'pi pi-chart-line', sort: 'popular' },
    // { id: 'rating', name: 'Highest Rated', icon: 'pi pi-star-fill', sort: 'rating' },
    { id: 'beginner', name: 'Beginner Friendly', icon: 'pi pi-users', level: 'beginner' },
    { id: 'advanced', name: 'Advanced Topics', icon: 'pi pi-server', level: 'advanced' },
    { id: 'newest', name: 'Latest Additions', icon: 'pi pi-clock', sort: 'newest' },
  ]

  // Map category items to menu items
  const categoryItems = computed(() => {
    return categories.map((category) => ({
      label: category.name,
      icon: category.icon,
      class: filters.value.category === category.id ? 'text-blue-600 dark:text-blue-400' : '',
      command: () => {
        updateFilter('category', category.id)
      },
    }))
  })

  // Map filter items to menu items
  const filterItems = computed(() => {
    return sidebarFilters.map((filter) => ({
      label: filter.name,
      icon: filter.icon,
      class:
        (filter.sort && filters.value.sortBy === filter.sort) ||
        (filter.level && filters.value.skillLevel === filter.level)
          ? 'text-blue-600 dark:text-blue-400'
          : '',
      command: () => {
        // Update the appropriate filter based on the item
        if (filter.sort) updateFilter('sortBy', filter.sort)
        if (filter.level) updateFilter('skillLevel', filter.level)
      },
    }))
  })
</script>
