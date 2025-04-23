<template>
  <!-- Loading state -->
  <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
    <i class="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></i>
    <p class="text-gray-600 dark:text-gray-300">Loading resources...</p>
  </div>

  <!-- Error state -->
  <div
    v-else-if="error"
    class="text-center py-12 bg-white dark:bg-[#1e1f23] rounded-lg border border-gray-200 dark:border-[#27292f] p-8"
  >
    <div class="text-red-500 dark:text-red-400 mb-4">
      <i class="pi pi-exclamation-triangle text-4xl"></i>
    </div>
    <h3 class="text-xl font-medium text-gray-800 dark:text-blue-100 mb-2">
      Error loading resources
    </h3>
    <p class="text-gray-600 dark:text-gray-300 mb-4">
      {{ error }}
    </p>
    <Button severity="primary" @click="refreshResources">Try Again</Button>
  </div>

  <!-- Resources loaded successfully -->
  <div v-else-if="filteredResources.length > 0" class="grid grid-cols-1 gap-6">
    <ResourceCard v-for="resource in filteredResources" :key="resource.id" :resource="resource" />
  </div>

  <!-- No resources found -->
  <div
    v-else
    class="text-center py-12 bg-white dark:bg-[#1e1f23] rounded-lg border border-gray-200 dark:border-[#27292f] p-8"
  >
    <div class="text-gray-500 dark:text-blue-400 mb-4">
      <i class="pi pi-search text-4xl"></i>
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
import ResourceCard from './ResourceCard.vue';
import Button from '@/volt/Button.vue';
import { useResourceStore } from '@/stores/resource';
import { storeToRefs } from 'pinia';

const resourceStore = useResourceStore();
const { fetchResources } = resourceStore;
const { filteredResources, isLoading, error } = storeToRefs(resourceStore);
const refreshResources = () => {
  fetchResources();
};
</script>
