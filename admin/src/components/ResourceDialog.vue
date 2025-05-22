<template>
  <Dialog :open="isOpen" @update:open="onOpenChange">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Edit Resource' : 'Add New Resource' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing ? 'Update resource details below.' : 'Enter resource details below to add it to JSR.' }}
        </DialogDescription>
      </DialogHeader>
      
      <div v-if="loading" class="flex items-center justify-center py-8">
        <div class="animate-spin text-2xl">↻</div>
      </div>
      
      <div v-else-if="error" class="p-4 border rounded-md border-destructive/50 bg-destructive/10 text-destructive text-center">
        <p>{{ error }}</p>
        <Button variant="outline" class="mt-4" @click="onCancel">Close</Button>
      </div>
      
      <div v-else>
        <resource-form
          :initial-data="resourceData"
          :categories="categories"
          :resource-types="resourceTypes"
          :is-loading="isSubmitting"
          :is-editing="isEditing"
          @submit="handleSubmit"
          @cancel="onCancel"
        />
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import ResourceForm from './ResourceForm.vue'
import type { ResourceData } from '../services/resource.service'
import { resourceService } from '../services/resource.service'
import { categoryService } from '../services/category.service'
import { resourceTypeService } from '../services/resourceType.service'
import type { Category, ResourceType, Resource } from '@jsr/shared/types'

interface Props {
  isOpen: boolean;
  resourceId?: string;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'created', resource: Resource): void;
  (e: 'updated', resource: Resource): void;
}>()

const isEditing = computed(() => !!props.resourceId)
const resourceData = ref<Partial<ResourceData>>({})
const categories = ref<Category[]>([])
const resourceTypes = ref<ResourceType[]>([])
const loading = ref(false)
const isSubmitting = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadResourceTypes()
  ])
  
  if (isEditing.value) {
    await loadResource()
  }
})

const loadCategories = async () => {
  try {
    const response = await categoryService.getCategories()
    if (response.status === 'success' && response.data) {
      categories.value = response.data
    }
  } catch (err) {
    console.error('Error loading categories:', err)
  }
}

const loadResourceTypes = async () => {
  try {
    const response = await resourceTypeService.getResourceTypes()
    if (response.status === 'success' && response.data) {
      resourceTypes.value = response.data
    }
  } catch (err) {
    console.error('Error loading resource types:', err)
  }
}

const loadResource = async () => {
  if (!props.resourceId) return
  
  try {
    loading.value = true
    error.value = null
    
    const response = await resourceService.getResourceById(props.resourceId)
    
    if (response.status === 'success' && response.data) {
      const resource = response.data
      
      resourceData.value = {
        name: resource.name,
        description: resource.description,
        url: resource.url,
        category: typeof resource.category === 'string' ? resource.category : resource.category.id,
        type: typeof resource.type === 'string' ? resource.type : resource.type.id,
        difficulty: resource.difficulty,
        tags: resource.tags,
        pricingType: resource.pricingType,
        price: resource.price
      }
    } else {
      error.value = 'Failed to load resource'
    }
  } catch (err) {
    console.error('Error loading resource:', err)
    error.value = 'Failed to load resource data'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async (data: ResourceData) => {
  try {
    isSubmitting.value = true
    error.value = null
    
    if (isEditing.value && props.resourceId) {
      // Update existing resource
      const response = await resourceService.updateResource(props.resourceId, data)
      
      if (response.status === 'success' && response.data) {
        emit('updated', response.data)
        emit('close')
      } else {
        error.value = 'Failed to update resource'
      }
    } else {
      // Create new resource
      const response = await resourceService.createResource(data)
      
      if (response.status === 'success' && response.data) {
        emit('created', response.data)
        emit('close')
      } else {
        error.value = 'Failed to create resource'
      }
    }
  } catch (err) {
    console.error('Error submitting resource:', err)
    error.value = 'Failed to save resource'
  } finally {
    isSubmitting.value = false
  }
}

const onCancel = () => {
  emit('close')
}

const onOpenChange = (open: boolean) => {
  if (!open) emit('close')
}

defineOptions({
  name: 'ResourceDialog'
})
</script> 