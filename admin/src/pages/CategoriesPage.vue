<template>
  <div class="categories-page">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Category Management</h1>
      <Button @click="openCreateDialog">
        <span class="mr-2">+</span>
        Add Category
      </Button>
    </div>

    <div class="bg-card p-6 rounded-lg shadow mb-6">
      <!-- Error State -->
      <div v-if="error" class="py-8 text-center text-destructive">
        <p>{{ error }}</p>
        <Button variant="outline" class="mt-4" @click="fetchCategories">Try Again</Button>
      </div>

      <!-- Categories Table -->
      <Table v-else>
        <TableCaption>List of categories managed by JSR Admin</TableCaption>
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
              Loading categories...
            </TableCell>
          </TableRow>
          <TableRow v-else-if="!categories.length" class="h-24">
            <TableCell colspan="4" class="text-center">
              No categories found. Create your first category by clicking "Add Category".
            </TableCell>
          </TableRow>
          <TableRow v-else v-for="category in categories" :key="category.id">
            <TableCell>{{ category.name }}</TableCell>
            <TableCell>{{ category.description }}</TableCell>
            <TableCell>{{ formatDate(category.createdAt) }}</TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end space-x-2">
                <Button variant="ghost" size="sm" @click="openEditDialog(category)">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" class="text-destructive" @click="confirmDelete(category)">
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
      entity-type="Category"
      :isOpen="dialogOpen"
      @update:open="val => dialogOpen = val"
      :is-loading="isSubmitting"
      :is-editing="!!selectedCategory"
      :entity-data="selectedCategory || { name: '', description: '' }"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the category "{{ categoryToDelete?.name }}"? This action cannot be undone.
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
import { categoryService } from '../services/category.service'
import type { Category } from '@jsr/shared/types'

// Define component name
defineOptions({
  name: 'CategoriesPage'
})

// State
const categories = ref<Category[]>([])
const isLoading = ref(false)
const error = ref('')
const dialogOpen = ref(false)
const selectedCategory = ref<Category | null>(null)
const isSubmitting = ref(false)
const deleteDialogOpen = ref(false)
const categoryToDelete = ref<Category | null>(null)
const isDeleting = ref(false)

// Fetch categories on mount
onMounted(() => {
  fetchCategories()
})

// Methods
const fetchCategories = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await categoryService.getCategories()
    if (response.status === 'success' && response.data) {
      categories.value = response.data
    } else {
      error.value = response.error?.message || 'Failed to load categories'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unknown error occurred'
  } finally {
    isLoading.value = false
  }
}

const openCreateDialog = () => {
  selectedCategory.value = null
  dialogOpen.value = true
}

const openEditDialog = (category: Category) => {
  selectedCategory.value = category
  dialogOpen.value = true
}

const handleSubmit = async (data: { id?: string; name: string; description: string }) => {
  isSubmitting.value = true
  
  try {
    if (data.id) {
      // Update existing category
      await categoryService.updateCategory(data.id, data.name, data.description)
    } else {
      // Create new category
      await categoryService.createCategory(data.name, data.description)
    }
    
    // Refresh categories list
    await fetchCategories()
    
    // Close the dialog
    dialogOpen.value = false
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred while saving the category'
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (category: Category) => {
  categoryToDelete.value = category
  deleteDialogOpen.value = true
}

const handleDelete = async () => {
  if (!categoryToDelete.value) return
  
  isDeleting.value = true
  
  try {
    await categoryService.deleteCategory(categoryToDelete.value.id)
    await fetchCategories()
    deleteDialogOpen.value = false
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred while deleting the category'
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