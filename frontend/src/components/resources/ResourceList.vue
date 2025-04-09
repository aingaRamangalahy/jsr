<template>
  <div v-if="filteredResources.length > 0" class="grid grid-cols-1 gap-6">
    <ResourceCard v-for="resource in filteredResources" :key="resource.id" :resource="resource" />
  </div>
  <div
    v-else
    class="text-center py-12 bg-white dark:bg-[#1e1f23] rounded-lg border border-gray-200 dark:border-[#27292f] p-8"
  >
    <div class="text-gray-500 dark:text-blue-400 mb-4">
      <span class="pi pi-search text-4xl"></span>
    </div>
    <h3 class="text-xl font-medium text-gray-800 dark:text-blue-100 mb-2">No resources found</h3>
    <p class="text-gray-600 dark:text-gray-300 mb-4">
      Try adjusting your filters or add a new resource.
    </p>
    <Button
      severity="primary"
      class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 p-2 rounded-md"
    >
      <router-link to="/add-resource" class="flex items-center gap-2 text-white">
        <i class="pi pi-plus"></i>
        <span>Add Resource</span>
      </router-link>
    </Button>
  </div>
</template>

<script setup lang="ts">
  import ResourceCard from './ResourceCard.vue'
  import Button from '@/volt/Button.vue'
  import { useFilters } from '@/composables/useFilters'

  const { filteredResources } = useFilters()
</script>
