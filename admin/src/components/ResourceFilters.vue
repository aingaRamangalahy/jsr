<template>
  <div class="resource-filters space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- Status Filter -->
      <div class="space-y-2">
        <label class="text-sm font-medium" for="status-filter">Status</label>
        <select
          id="status-filter"
          v-model="filters.status"
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      
      <!-- Category Filter -->
      <div class="space-y-2">
        <label class="text-sm font-medium" for="category-filter">Category</label>
        <select
          id="category-filter"
          v-model="filters.category"
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
      
      <!-- Type Filter -->
      <div class="space-y-2">
        <label class="text-sm font-medium" for="type-filter">Type</label>
        <select
          id="type-filter"
          v-model="filters.type"
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Types</option>
          <option v-for="type in resourceTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>
      </div>
      
      <!-- Difficulty Filter -->
      <div class="space-y-2">
        <label class="text-sm font-medium" for="difficulty-filter">Difficulty</label>
        <select
          id="difficulty-filter"
          v-model="filters.difficulty"
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      
      <!-- Pricing Type Filter -->
      <div class="space-y-2">
        <label class="text-sm font-medium" for="pricing-filter">Pricing</label>
        <select
          id="pricing-filter"
          v-model="filters.pricingType"
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Resources</option>
          <option value="free">Free Only</option>
          <option value="paid">Paid Only</option>
        </select>
      </div>
    </div>
    
    <!-- Search Bar -->
    <div class="relative">
      <input
        type="text"
        v-model="filters.search"
        placeholder="Search resources..."
        class="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <button 
        v-if="filters.search" 
        @click="clearSearch"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        ✕
      </button>
    </div>
    
    <!-- Reset Filters Button -->
    <div class="flex justify-end">
      <button
        @click="resetFilters"
        class="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
      >
        Reset Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { ResourceFilters } from '../services/resource.service'
import type { Category, ResourceType, ResourceStatus } from '@jsr/shared/types'

// Props
interface Props {
  categories: Category[];
  resourceTypes: ResourceType[];
  initialFilters?: ResourceFilters;
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  resourceTypes: () => [],
  initialFilters: () => ({})
})

// Emits
const emit = defineEmits<{
  (e: 'update:filters', filters: ResourceFilters): void;
}>()

// State
const filters = reactive<ResourceFilters>({
  status: props.initialFilters.status,
  category: props.initialFilters.category,
  type: props.initialFilters.type,
  difficulty: props.initialFilters.difficulty,
  pricingType: props.initialFilters.pricingType,
  search: props.initialFilters.search || ''
})

// Methods
const clearSearch = () => {
  filters.search = ''
}

const resetFilters = () => {
  filters.status = undefined
  filters.category = undefined
  filters.type = undefined 
  filters.difficulty = undefined
  filters.pricingType = undefined
  filters.search = ''
}

// Watch for changes to emit updates
watch(filters, (newFilters) => {
  emit('update:filters', { ...newFilters })
}, { deep: true })
</script> 