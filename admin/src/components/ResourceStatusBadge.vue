<template>
  <span 
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
    :class="badgeClass"
  >
    {{ displayText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ResourceStatus } from '@jsr/shared/types'

// Props
interface Props {
  status: ResourceStatus;
}

const props = defineProps<Props>()

// Computed
const displayText = computed(() => {
  return props.status.charAt(0).toUpperCase() + props.status.slice(1)
})

const badgeClass = computed(() => {
  switch (props.status) {
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
  }
})
</script> 