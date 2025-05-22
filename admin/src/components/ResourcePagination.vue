<template>
  <div class="resource-pagination flex items-center justify-between px-2 py-4">
    <!-- Page Info -->
    <div class="text-sm text-muted-foreground">
      Showing {{ startItem }} to {{ endItem }} of {{ total }} resources
    </div>
    
    <!-- Page Controls -->
    <div class="flex items-center space-x-2">
      <!-- Previous Button -->
      <button
        @click="previousPage"
        class="p-2 rounded-md border border-input bg-background text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === 1"
      >
        Previous
      </button>
      
      <!-- Page Number -->
      <span class="px-3 py-1 rounded-md bg-muted text-foreground text-sm font-medium">
        {{ currentPage }}
      </span>
      
      <!-- Next Button -->
      <button
        @click="nextPage"
        class="p-2 rounded-md border border-input bg-background text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === totalPages"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  (e: 'page-change', page: number): void;
}>()

// Computed
const startItem = computed(() => {
  return (props.currentPage - 1) * props.limit + 1
})

const endItem = computed(() => {
  const end = props.currentPage * props.limit
  return end > props.total ? props.total : end
})

// Methods
const previousPage = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1)
  }
}

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1)
  }
}
</script> 