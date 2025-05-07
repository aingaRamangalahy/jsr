<template>
  <div class="resource-types-page">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Resource Types Management</h1>
      <Button @click="openCreateDialog">
        <span class="mr-2">+</span>
        Add Resource Type
      </Button>
    </div>

    <div class="bg-card p-6 rounded-lg shadow mb-6">
      <!-- Error State -->
      <div v-if="error" class="py-8 text-center text-destructive">
        <p>{{ error }}</p>
        <Button variant="outline" class="mt-4" @click="fetchResourceTypes">Try Again</Button>
      </div>

      <!-- Resource Types Table -->
      <Table v-else>
        <TableCaption>List of resource types managed by JSR Admin</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="isLoading" class="h-24">
            <TableCell colspan="4" class="text-center">
              Loading resource types...
            </TableCell>
          </TableRow>
          <TableRow v-else-if="!resourceTypes.length" class="h-24">
            <TableCell colspan="4" class="text-center">
              No resource types found. Create your first resource type by clicking "Add Resource Type".
            </TableCell>
          </TableRow>
          <TableRow v-else v-for="type in resourceTypes" :key="type.id">
            <TableCell>{{ type.name }}</TableCell>
            <TableCell>{{ type.description }}</TableCell>
            <TableCell>{{ formatDate(type.createdAt) }}</TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end space-x-2">
                <Button variant="ghost" size="sm" @click="openEditDialog(type)">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" class="text-destructive" @click="confirmDelete(type)">
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Entity Dialog for Create/Edit -->
    <EntityDialog
      entity-type="Resource Type"
      :isOpen="dialogOpen"
      @update:open="val => dialogOpen = val"
      :is-loading="isSubmitting"
      :is-editing="!!selectedResourceType"
      :entity-data="selectedResourceType || { name: '', description: '' }"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the resource type "{{ resourceTypeToDelete?.name }}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div class="py-6 flex justify-end space-x-2">
          <Button variant="outline" @click="deleteDialogOpen = false" :disabled="isDeleting">
            Cancel
          </Button>
          <Button variant="destructive" @click="handleDelete" :disabled="isDeleting">
            <span v-if="isDeleting" class="mr-2">
              <span class="animate-spin">↻</span>
            </span>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '../components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '../components/ui/dialog'
import EntityDialog from '../components/EntityDialog.vue'
import { resourceTypeService } from '../services/resourceType.service'
import type { ResourceType } from '@jsr/shared/types'

// Define component name
defineOptions({
  name: 'ResourceTypesPage'
})

// State
const resourceTypes = ref<ResourceType[]>([])
const isLoading = ref(false)
const error = ref('')
const dialogOpen = ref(false)
const selectedResourceType = ref<ResourceType | null>(null)
const isSubmitting = ref(false)
const deleteDialogOpen = ref(false)
const resourceTypeToDelete = ref<ResourceType | null>(null)
const isDeleting = ref(false)

// Fetch resource types on mount
onMounted(() => {
  fetchResourceTypes()
})

// Methods
const fetchResourceTypes = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await resourceTypeService.getResourceTypes()
    if (response.status === 'success' && response.data) {
      resourceTypes.value = response.data
    } else {
      error.value = response.error?.message || 'Failed to load resource types'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unknown error occurred'
  } finally {
    isLoading.value = false
  }
}

const openCreateDialog = () => {
  selectedResourceType.value = null
  dialogOpen.value = true
}

const openEditDialog = (type: ResourceType) => {
  selectedResourceType.value = type
  dialogOpen.value = true
}

const handleSubmit = async (data: { id?: string; name: string; description: string }) => {
  isSubmitting.value = true
  
  try {
    if (data.id) {
      // Update existing resource type
      await resourceTypeService.updateResourceType(data.id, data.name, data.description)
    } else {
      // Create new resource type
      await resourceTypeService.createResourceType(data.name, data.description)
    }
    
    // Refresh resource types list
    await fetchResourceTypes()
    
    // Close the dialog
    dialogOpen.value = false
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred while saving the resource type'
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (type: ResourceType) => {
  resourceTypeToDelete.value = type
  deleteDialogOpen.value = true
}

const handleDelete = async () => {
  if (!resourceTypeToDelete.value) return
  
  isDeleting.value = true
  
  try {
    await resourceTypeService.deleteResourceType(resourceTypeToDelete.value.id)
    await fetchResourceTypes()
    deleteDialogOpen.value = false
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred while deleting the resource type'
  } finally {
    isDeleting.value = false
  }
}

// Helper functions
const formatDate = (date: Date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}
</script> 