<template>
  <div class="resources-page">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Resource Management</h1>
      <div class="flex items-center gap-4">
        <Button @click="openCreateResourceDialog">
          Add New Resource
        </Button>
        <span class="text-sm text-muted-foreground">
          Total: {{ resourcesTotal }} resources
        </span>
      </div>
    </div>
    
    <!-- Filters Section -->
    <div class="bg-card p-5 rounded-lg shadow mb-6">
      <h2 class="text-lg font-medium mb-4">Filters</h2>
      <ResourceFiltersComponent
        :categories="categories"
        :resource-types="resourceTypes"
        :initial-filters="filters"
        @update:filters="updateFilters"
      />
    </div>
    
    <!-- Resources Table -->
    <div class="bg-card rounded-lg shadow overflow-hidden">
      <!-- Error Message -->
      <div v-if="error" class="p-6 text-center">
        <div class="text-lg text-destructive mb-2">Failed to load resources</div>
        <p class="text-muted-foreground">{{ error }}</p>
        <button 
          @click="loadResources"
          class="mt-4 px-4 py-2 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
      
      <!-- Resources Table with shadcn-vue -->
      <div v-else class="w-full">
        <Table>
          <TableCaption>List of resources managed by JSR Admin</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category / Type</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="loading" class="h-24">
              <TableCell colspan="5" class="text-center">
                Loading resources...
              </TableCell>
            </TableRow>
            <TableRow v-else-if="resources.length === 0" class="h-24">
              <TableCell colspan="5" class="text-center">
                No resources found. Try adjusting your filters to find resources.
              </TableCell>
            </TableRow>
            <TableRow v-else v-for="resource in resources" :key="resource.id" class="hover:bg-muted/30">
              <TableCell>
                <div class="flex flex-col">
                  <a 
                    :href="resource.url" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="font-medium hover:underline"
                  >
                    {{ resource.name }}
                  </a>
                  <span class="text-sm text-muted-foreground">{{ resource.description.substring(0, 60) }}{{ resource.description.length > 60 ? '...' : '' }}</span>
                </div>
              </TableCell>
              <TableCell>
                <div class="flex flex-col">
                  <span class="text-sm">
                    {{ typeof resource.category === 'string' ? resource.category : resource.category.name }}
                  </span>
                  <span class="text-xs text-muted-foreground">
                    {{ typeof resource.type === 'string' ? resource.type : resource.type.name }}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div class="flex items-center">
                  <PricingBadge :pricing-type="resource.pricingType" :price="resource.price" />
                  <button 
                    @click="openPricingModal(resource)"
                    class="ml-2 text-xs text-primary hover:text-primary/80"
                  >
                    Edit
                  </button>
                </div>
              </TableCell>
              <TableCell>
                <ResourceStatusBadge :status="resource.status" />
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <ResourceStatusActions 
                    :resource="resource" 
                    @status-updated="handleStatusUpdate"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="openEditResourceDialog(resource)"
                  >
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        <!-- Pagination -->
        <ResourcePagination
          v-if="resourcesTotal > 0"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total="resourcesTotal"
          :limit="limit"
          @page-change="handlePageChange"
        />
      </div>
    </div>
    
    <!-- Pricing Modal -->
    <ResourcePricingModal
      v-if="selectedResource"
      :is-open="isPricingModalOpen"
      :resource-id="selectedResource.id"
      :initial-pricing-type="selectedResource.pricingType"
      :initial-price="selectedResource.price"
      @close="closePricingModal"
      @saved="handlePricingUpdate"
    />

    <!-- ResourceForm Modal -->
    <Dialog :open="isResourceFormOpen" @update:open="onResourceFormOpenChange">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ editingResource ? 'Edit Resource' : 'Add New Resource' }}</DialogTitle>
          <DialogDescription>
            {{ editingResource ? 'Update resource details below.' : 'Enter resource details below to add it to JSR.' }}
          </DialogDescription>
        </DialogHeader>
        
        <div v-if="resourceFormLoading" class="flex items-center justify-center py-8">
          <div class="animate-spin text-2xl">↻</div>
        </div>
        
        <div v-else-if="resourceFormError" class="p-4 border rounded-md border-destructive/50 bg-destructive/10 text-destructive text-center">
          <p>{{ resourceFormError }}</p>
          <Button variant="outline" class="mt-4" @click="closeResourceForm">Close</Button>
        </div>
        
        <div v-else>
          <Form @submit="handleResourceFormSubmit" class="space-y-4">
            <!-- Name Field -->
            <div class="space-y-2">
              <FormField name="name">
                <FormItem>
                  <FormLabel for="name">Name</FormLabel>
                  <FormControl>
                    <Input 
                      id="name" 
                      v-model="resourceFormData.name" 
                      placeholder="Enter resource name"
                      :disabled="resourceFormSubmitting"
                      required
                    />
                  </FormControl>
                  <FormMessage v-if="resourceFormErrors.name">{{ resourceFormErrors.name }}</FormMessage>
                </FormItem>
              </FormField>
            </div>

            <!-- Description Field -->
            <div class="space-y-2">
              <FormField name="description">
                <FormItem>
                  <FormLabel for="description">Description</FormLabel>
                  <FormControl>
                    <textarea 
                      id="description" 
                      v-model="resourceFormData.description" 
                      placeholder="Enter resource description"
                      class="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      :disabled="resourceFormSubmitting"
                      required
                    />
                  </FormControl>
                  <FormMessage v-if="resourceFormErrors.description">{{ resourceFormErrors.description }}</FormMessage>
                </FormItem>
              </FormField>
            </div>

            <!-- URL Field -->
            <div class="space-y-2">
              <FormField name="url">
                <FormItem>
                  <FormLabel for="url">URL</FormLabel>
                  <FormControl>
                    <Input 
                      id="url" 
                      v-model="resourceFormData.url" 
                      placeholder="https://example.com"
                      :disabled="resourceFormSubmitting"
                      required
                    />
                  </FormControl>
                  <FormMessage v-if="resourceFormErrors.url">{{ resourceFormErrors.url }}</FormMessage>
                </FormItem>
              </FormField>
            </div>

            <!-- Category Field -->
            <div class="space-y-2">
              <FormField name="category">
                <FormItem>
                  <FormLabel for="category">Category</FormLabel>
                  <FormControl>
                    <select
                      id="category"
                      v-model="resourceFormData.category"
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      :disabled="resourceFormSubmitting"
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      <option 
                        v-for="category in categories" 
                        :key="category.id" 
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                  </FormControl>
                  <FormMessage v-if="resourceFormErrors.category">{{ resourceFormErrors.category }}</FormMessage>
                </FormItem>
              </FormField>
            </div>

            <!-- Type Field -->
            <div class="space-y-2">
              <FormField name="type">
                <FormItem>
                  <FormLabel for="type">Resource Type</FormLabel>
                  <FormControl>
                    <select
                      id="type"
                      v-model="resourceFormData.type"
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      :disabled="resourceFormSubmitting"
                      required
                    >
                      <option value="" disabled>Select a resource type</option>
                      <option 
                        v-for="resourceType in resourceTypes" 
                        :key="resourceType.id" 
                        :value="resourceType.id"
                      >
                        {{ resourceType.name }}
                      </option>
                    </select>
                  </FormControl>
                  <FormMessage v-if="resourceFormErrors.type">{{ resourceFormErrors.type }}</FormMessage>
                </FormItem>
              </FormField>
            </div>

            <!-- Difficulty Field -->
            <div class="space-y-2">
              <FormField name="difficulty">
                <FormItem>
                  <FormLabel for="difficulty">Difficulty</FormLabel>
                  <FormControl>
                    <select
                      id="difficulty"
                      v-model="resourceFormData.difficulty"
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      :disabled="resourceFormSubmitting"
                      required
                    >
                      <option value="" disabled>Select difficulty level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </FormControl>
                  <FormMessage v-if="resourceFormErrors.difficulty">{{ resourceFormErrors.difficulty }}</FormMessage>
                </FormItem>
              </FormField>
            </div>

            <!-- Tags Field -->
            <div class="space-y-2">
              <FormField name="tags">
                <FormItem>
                  <FormLabel for="tags">Tags</FormLabel>
                  <FormControl>
                    <Input 
                      id="tags" 
                      v-model="tagsInput" 
                      placeholder="Add tags separated by commas"
                      :disabled="resourceFormSubmitting"
                      @keydown.enter.prevent="addTag"
                      @blur="addTag"
                    />
                  </FormControl>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span
                      v-for="(tag, index) in resourceFormData.tags"
                      :key="index"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-foreground text-primary"
                    >
                      {{ tag }}
                      <button
                        type="button"
                        class="ml-1.5 h-3.5 w-3.5 rounded-full inline-flex items-center justify-center text-muted-foreground hover:text-foreground"
                        @click="removeTag(index)"
                      >
                        ✕
                      </button>
                    </span>
                  </div>
                  <FormMessage v-if="resourceFormErrors.tags">{{ resourceFormErrors.tags }}</FormMessage>
                </FormItem>
              </FormField>
            </div>

            <!-- Pricing Type Field -->
            <div class="space-y-2">
              <FormField name="pricingType">
                <FormItem>
                  <FormLabel for="pricingType">Pricing Type</FormLabel>
                  <FormControl>
                    <select
                      id="pricingType"
                      v-model="resourceFormData.pricingType"
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      :disabled="resourceFormSubmitting"
                      @change="handlePricingTypeChange"
                      required
                    >
                      <option value="" disabled>Select pricing type</option>
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                    </select>
                  </FormControl>
                  <FormMessage v-if="resourceFormErrors.pricingType">{{ resourceFormErrors.pricingType }}</FormMessage>
                </FormItem>
              </FormField>
            </div>

            <!-- Price Field (only shown if pricingType is 'paid') -->
            <div v-if="resourceFormData.pricingType === 'paid'" class="space-y-2">
              <FormField name="price">
                <FormItem>
                  <FormLabel for="price">Price ($)</FormLabel>
                  <FormControl>
                    <Input 
                      id="price" 
                      v-model="resourceFormData.price" 
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter price"
                      :disabled="resourceFormSubmitting"
                      required
                    />
                  </FormControl>
                  <FormMessage v-if="resourceFormErrors.price">{{ resourceFormErrors.price }}</FormMessage>
                </FormItem>
              </FormField>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                @click="closeResourceForm"
                :disabled="resourceFormSubmitting"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                :disabled="resourceFormSubmitting"
              >
                <span v-if="resourceFormSubmitting" class="mr-2">
                  <span class="animate-spin">↻</span>
                </span>
                {{ editingResource ? 'Update' : 'Create' }} Resource
              </Button>
            </div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { Resource, Category, ResourceType } from '@jsr/shared/types'
import { resourceService } from '../services/resource.service'
import type { ResourceFilters } from '../services/resource.service'
import ResourceStatusBadge from '@/components/ResourceStatusBadge.vue'
import ResourceStatusActions from '@/components/ResourceStatusActions.vue'
import ResourceFiltersComponent from '@/components/ResourceFilters.vue'
import ResourcePagination from '@/components/ResourcePagination.vue'
import ResourcePricingModal from '@/components/ResourcePricingModal.vue'
import PricingBadge from '@jsr/shared/components/custom/PricingBadge.vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { ResourceData } from '../services/resource.service'

// Import shadcn-vue Table components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table'

// Define component name
defineOptions({
  name: 'ResourcesPage'
})

// State
const resources = ref<Resource[]>([])
const resourcesTotal = ref(0)
const categories = ref<Category[]>([])
const resourceTypes = ref<ResourceType[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)
const limit = ref(10)
const filters = reactive<ResourceFilters>({})
const selectedResource = ref<Resource | null>(null)
const isPricingModalOpen = ref(false)

// Resource form state
const isResourceFormOpen = ref(false)
const resourceFormLoading = ref(false)
const resourceFormSubmitting = ref(false)
const resourceFormError = ref<string | null>(null)
const editingResource = ref<Resource | null>(null)
const resourceFormData = ref<ResourceData>({
  name: '',
  description: '',
  url: '',
  category: '',
  type: '',
  difficulty: 'beginner',
  tags: [],
  pricingType: 'free',
  price: undefined
})
const resourceFormErrors = ref({
  name: '',
  description: '',
  url: '',
  category: '',
  type: '',
  difficulty: '',
  tags: '',
  pricingType: '',
  price: ''
})
const tagsInput = ref('')

// Computed
const totalPages = computed(() => {
  return Math.ceil(resourcesTotal.value / limit.value)
})

// Methods
const loadResources = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await resourceService.getResources(
      filters,
      currentPage.value,
      limit.value
    )
    
    if (response.status === 'success' && response.data) {
      resources.value = response.data
      resourcesTotal.value = response.pagination.total
    } else {
      error.value = 'Failed to load resources'
    }
  } catch (err) {
    console.error('Error loading resources:', err)
    error.value = 'Failed to connect to the server'
  } finally {
    loading.value = false
  }
}

// We'll simulate loading categories and resource types for now
// In a real implementation, we would fetch these from the API
const loadCategories = async () => {
  // Simulated data
  categories.value = [
    { id: '1', name: 'Framework', description: 'JavaScript frameworks', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Library', description: 'JavaScript libraries', createdAt: new Date(), updatedAt: new Date() },
    { id: '3', name: 'Tools', description: 'Development tools', createdAt: new Date(), updatedAt: new Date() },
  ]
}

const loadResourceTypes = async () => {
  // Simulated data
  resourceTypes.value = [
    { id: '1', name: 'Article', description: 'Written content', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Video', description: 'Video content', createdAt: new Date(), updatedAt: new Date() },
    { id: '3', name: 'Course', description: 'Comprehensive courses', createdAt: new Date(), updatedAt: new Date() },
  ]
}

const updateFilters = (newFilters: ResourceFilters) => {
  Object.assign(filters, newFilters)
  currentPage.value = 1 // Reset to first page when filters change
  loadResources()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadResources()
}

const handleStatusUpdate = (updatedResource: Resource) => {
  // Update the resource in the list
  const index = resources.value.findIndex(r => r.id === updatedResource.id)
  if (index !== -1) {
    resources.value[index] = updatedResource
  }
}

const openPricingModal = (resource: Resource) => {
  selectedResource.value = resource
  isPricingModalOpen.value = true
}

const closePricingModal = () => {
  isPricingModalOpen.value = false
  selectedResource.value = null
}

const handlePricingUpdate = () => {
  loadResources() // Reload resources to get updated pricing
}

// Resource form methods
const resetResourceForm = () => {
  resourceFormData.value = {
    name: '',
    description: '',
    url: '',
    category: '',
    type: '',
    difficulty: 'beginner',
    tags: [],
    pricingType: 'free',
    price: undefined
  }
  resourceFormErrors.value = {
    name: '',
    description: '',
    url: '',
    category: '',
    type: '',
    difficulty: '',
    tags: '',
    pricingType: '',
    price: ''
  }
  tagsInput.value = ''
  editingResource.value = null
}

const openCreateResourceDialog = () => {
  resetResourceForm()
  isResourceFormOpen.value = true
}

const openEditResourceDialog = (resource: Resource) => {
  resetResourceForm()
  editingResource.value = resource
  
  resourceFormData.value = {
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
  
  isResourceFormOpen.value = true
}

const closeResourceForm = () => {
  isResourceFormOpen.value = false
}

const onResourceFormOpenChange = (open: boolean) => {
  if (!open) closeResourceForm()
}

const validateResourceForm = () => {
  let isValid = true
  resourceFormErrors.value = {
    name: '',
    description: '',
    url: '',
    category: '',
    type: '',
    difficulty: '',
    tags: '',
    pricingType: '',
    price: ''
  }

  if (!resourceFormData.value.name.trim()) {
    resourceFormErrors.value.name = 'Name is required'
    isValid = false
  }

  if (!resourceFormData.value.description.trim()) {
    resourceFormErrors.value.description = 'Description is required'
    isValid = false
  }

  if (!resourceFormData.value.url.trim()) {
    resourceFormErrors.value.url = 'URL is required'
    isValid = false
  } else if (!isValidUrl(resourceFormData.value.url)) {
    resourceFormErrors.value.url = 'Please enter a valid URL'
    isValid = false
  }

  if (!resourceFormData.value.category) {
    resourceFormErrors.value.category = 'Category is required'
    isValid = false
  }

  if (!resourceFormData.value.type) {
    resourceFormErrors.value.type = 'Resource type is required'
    isValid = false
  }

  if (!resourceFormData.value.difficulty) {
    resourceFormErrors.value.difficulty = 'Difficulty level is required'
    isValid = false
  }

  if (resourceFormData.value.tags.length === 0) {
    resourceFormErrors.value.tags = 'At least one tag is required'
    isValid = false
  }

  if (!resourceFormData.value.pricingType) {
    resourceFormErrors.value.pricingType = 'Pricing type is required'
    isValid = false
  }

  if (resourceFormData.value.pricingType === 'paid' && (!resourceFormData.value.price || resourceFormData.value.price <= 0)) {
    resourceFormErrors.value.price = 'Price is required for paid resources'
    isValid = false
  }

  return isValid
}

const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

const addTag = () => {
  if (tagsInput.value.trim()) {
    // Split by commas and filter empty strings
    const newTags = tagsInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
    
    // Add new tags and remove duplicates
    resourceFormData.value.tags = [...new Set([...resourceFormData.value.tags, ...newTags])]
    
    // Clear the input
    tagsInput.value = ''
  }
}

const removeTag = (index: number) => {
  resourceFormData.value.tags.splice(index, 1)
}

const handlePricingTypeChange = () => {
  if (resourceFormData.value.pricingType === 'free') {
    resourceFormData.value.price = undefined
  }
}

const handleResourceFormSubmit = async () => {
  if (!validateResourceForm()) {
    return
  }
  
  try {
    resourceFormSubmitting.value = true
    resourceFormError.value = null
    
    if (editingResource.value) {
      // Update existing resource
      const response = await resourceService.updateResource(editingResource.value.id, resourceFormData.value)
      
      if (response.status === 'success' && response.data) {
        // Replace the resource in the table
        const index = resources.value.findIndex(r => r.id === response.data.id)
        if (index !== -1) {
          resources.value[index] = response.data
        }
        
        closeResourceForm()
      } else {
        resourceFormError.value = 'Failed to update resource'
      }
    } else {
      // Create new resource
      const response = await resourceService.createResource(resourceFormData.value)
      
      if (response.status === 'success' && response.data) {
        // Refresh the list to include the new resource
        loadResources()
        closeResourceForm()
      } else {
        resourceFormError.value = 'Failed to create resource'
      }
    }
  } catch (err) {
    console.error('Error submitting resource:', err)
    resourceFormError.value = 'Failed to save resource'
  } finally {
    resourceFormSubmitting.value = false
  }
}

// Lifecycle hooks
onMounted(async () => {
  await loadCategories()
  await loadResourceTypes()
  
  loadResources()
})
</script> 