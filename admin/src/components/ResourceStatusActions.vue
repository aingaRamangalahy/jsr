<template>
  <div class="resource-status-actions">
    <div class="flex gap-2">
      <!-- Approve Button -->
      <button
        v-if="resource.status !== 'approved'"
        @click="confirmStatusChange('approved')"
        class="px-3 py-1 rounded-md bg-green-100 text-green-800 text-xs font-medium hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800"
      >
        Approve
      </button>
      
      <!-- Reject Button -->
      <button
        v-if="resource.status !== 'rejected'"
        @click="confirmStatusChange('rejected')"
        class="px-3 py-1 rounded-md bg-red-100 text-red-800 text-xs font-medium hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
      >
        Reject
      </button>
      
      <!-- Reset to Pending Button -->
      <button
        v-if="resource.status !== 'pending'"
        @click="confirmStatusChange('pending')"
        class="px-3 py-1 rounded-md bg-yellow-100 text-yellow-800 text-xs font-medium hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:hover:bg-yellow-800"
      >
        Reset to Pending
      </button>
    </div>
    
    <!-- Confirmation Dialog -->
    <div v-if="showConfirmation" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showConfirmation = false"></div>
      <div class="bg-card p-6 rounded-lg shadow-xl w-full max-w-md relative z-10">
        <h3 class="text-lg font-semibold mb-4">Confirm Status Change</h3>
        <p>
          Are you sure you want to mark this resource as 
          <span class="font-medium" :class="{
            'text-green-600': newStatus === 'approved',
            'text-red-600': newStatus === 'rejected',
            'text-yellow-600': newStatus === 'pending'
          }">{{ newStatus }}</span>?
        </p>
        
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showConfirmation = false"
            class="px-4 py-2 rounded border border-input bg-background text-sm font-medium"
          >
            Cancel
          </button>
          <button
            @click="updateStatus"
            class="px-4 py-2 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            :disabled="loading"
          >
            {{ loading ? 'Updating...' : 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { resourceService } from '../services/resource.service'
import type { Resource, ResourceStatus } from '@jsr/shared/types'

// Props
interface Props {
  resource: Resource;
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  (e: 'status-updated', resource: Resource): void;
}>()

// State
const showConfirmation = ref(false)
const newStatus = ref<ResourceStatus>('pending')
const loading = ref(false)

// Methods
const confirmStatusChange = (status: ResourceStatus) => {
  newStatus.value = status
  showConfirmation.value = true
}

const updateStatus = async () => {
  try {
    loading.value = true
    
    const response = await resourceService.updateResourceStatus(
      props.resource.id,
      newStatus.value
    )
    
    if (response.status === 'success' && response.data) {
      emit('status-updated', response.data)
    }
    
    showConfirmation.value = false
  } catch (error) {
    console.error('Failed to update resource status:', error)
  } finally {
    loading.value = false
  }
}
</script> 