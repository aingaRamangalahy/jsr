<template>
  <div class="container py-8">
    <div class="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Submit a Resource</CardTitle>
          <CardDescription>
            Share a valuable JavaScript resource with the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <!-- URL Prefetch Section -->
          <div v-if="!prefetched && !submissionSuccess" class="space-y-6">
            <div class="space-y-2">
              <label for="url" class="text-sm font-medium">Resource URL *</label>
              <div class="flex gap-2">
                <Input
                  id="url"
                  v-model="resourceUrl"
                  type="url"
                  placeholder="https://example.com"
                  required
                  :disabled="prefetching"
                />
                <Button type="button" @click="handlePrefetch" :disabled="prefetching || !isValidUrl">
                  {{ prefetching ? 'Fetching...' : 'Fetch' }}
                </Button>
              </div>
              <p class="text-xs text-muted-foreground">
                Paste a resource URL to automatically fetch its details
              </p>
            </div>
            
            <div v-if="prefetchError" class="text-sm text-destructive">
              {{ prefetchError }}
            </div>
          </div>

          <!-- Resource Form Section -->
          <form v-else-if="prefetched && !submissionSuccess" @submit.prevent="handleSubmit" class="space-y-6">
            <!-- URL Preview -->
            <div class="rounded-md border p-4 space-y-3">
              <div class="flex items-center gap-3">
                <img 
                  v-if="resource.providerIcon" 
                  :src="resource.providerIcon" 
                  alt="Site icon" 
                  class="w-6 h-6" 
                  @error="handleImageError" 
                />
                <h3 class="text-sm font-medium">{{ resourceUrl }}</h3>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                class="text-xs" 
                @click="resetForm"
              >
                Change URL
              </Button>
            </div>

            <!-- Name -->
            <div class="space-y-2">
              <Label for="name">Name *</Label>
              <Input
                id="name"
                v-model="resource.name"
                placeholder="Enter resource name"
                required
              />
            </div>

            <!-- Description -->
            <div class="space-y-2">
              <Label for="description">Description *</Label>
              <Textarea
                id="description"
                v-model="resource.description"
                placeholder="Enter resource description"
                class="min-h-[100px] resize-y"
                required
              />
            </div>

            <!-- Category -->
            <div class="space-y-2">
              <Label for="category">Category</Label>
              <div v-if="categoriesLoading" class="flex items-center space-x-2 text-sm text-muted-foreground">
                <div class="animate-spin">↻</div>
                <span>Loading categories...</span>
              </div>
              <div v-else-if="categoriesError" class="text-sm text-destructive">
                {{ categoriesError }}
              </div>
              <Select v-else v-model="resource.category">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem :value="'placeholder'">Select a category</SelectItem>
                    <SelectItem 
                      v-for="category in categories" 
                      :key="category.id" 
                      :value="category.id"
                    >
                      {{ category.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <!-- Type -->
            <div class="space-y-2">
              <Label for="type">Type</Label>
              <div v-if="typesLoading" class="flex items-center space-x-2 text-sm text-muted-foreground">
                <div class="animate-spin">↻</div>
                <span>Loading resource types...</span>
              </div>
              <div v-else-if="typesError" class="text-sm text-destructive">
                {{ typesError }}
              </div>
              <Select v-else v-model="resource.type">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem :value="'placeholder'">Select a type</SelectItem>
                    <SelectItem 
                      v-for="type in types" 
                      :key="type.id" 
                      :value="type.id"
                    >
                      {{ type.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <!-- Difficulty -->
            <div class="space-y-2">
              <Label for="difficulty">Difficulty</Label>
              <Select v-model="resource.difficulty">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem 
                      v-for="difficulty in difficulties" 
                      :key="difficulty" 
                      :value="difficulty"
                    >
                      {{ difficulty.charAt(0).toUpperCase() + difficulty.slice(1) }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <!-- Pricing -->
            <div class="space-y-2">
              <Label for="pricingType">Pricing Type</Label>
              <Select v-model="resource.pricingType">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select pricing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <!-- Price (if paid) -->
            <div v-if="resource.pricingType === 'paid'" class="space-y-2">
              <Label for="price">Price</Label>
              <Input
                id="price"
                v-model.number="resource.price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter price"
              />
            </div>

            <!-- Tags -->
            <div class="space-y-2">
              <Label for="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Enter tags (comma-separated)"
                @input="handleTagInput"
              />
            </div>

            <!-- Resource Preview Toggle -->
            <div class="flex items-center space-x-2 pt-4">
              <Checkbox
                id="show-preview"
                v-model="showPreview"
              />
              <label for="show-preview" class="text-sm font-medium cursor-pointer">
                Show resource preview
              </label>
            </div>

            <!-- Resource Preview Section -->
            <div v-if="showPreview" class="p-4 border rounded-md bg-muted/30">
              <h3 class="text-sm font-medium mb-3">Resource Preview</h3>
              
              <!-- Preview using ResourceCard -->
              <ResourceCard :resource="previewResource" />
            </div>

            <Separator />

            <!-- Submit Button -->
            <Button type="submit" class="w-full" :disabled="loading">
              {{ loading ? 'Submitting...' : 'Submit Resource' }}
            </Button>

            <!-- Error Message -->
            <div v-if="error" class="text-sm text-destructive text-center">
              {{ error }}
            </div>
          </form>

          <!-- Submission Success Section -->
          <div v-else-if="submissionSuccess && showSuccessMessage" class="space-y-6 text-center py-8">
            <div class="flex justify-center mb-4">
              <!-- You can use a nice checkmark icon here -->
              <CheckCircle2Icon class="text-green-500 w-16 h-16" />
            </div>
            <h2 class="text-2xl font-semibold">Resource Submitted!</h2>
            <p class="text-muted-foreground">
              Your resource has been successfully submitted for review.
            </p>
            <div class="flex justify-center gap-4 pt-6">
              <Button @click="goToDashboard" variant="outline">Go to Dashboard</Button>
              <Button @click="submitAnother">Submit Another Resource</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from '@/components/ui/select'
import { resourceService } from '@/services/resource.service'
import { categoryService } from '@/services/category.service'
import { resourceTypeService } from '@/services/resource-type.service'
import { useAuthStore } from '@/stores/auth.store'
import type { Resource, Category, ResourceType } from '@jsr/shared/types'
import { toast } from 'vue-sonner'
import { defineAsyncComponent } from 'vue'
import { CheckCircle2Icon } from 'lucide-vue-next'

// Asynchronously load ResourceCard to potentially help with type inference issues
const ResourceCard = defineAsyncComponent(() => import('@/components/ResourceCard.vue'))

const router = useRouter()
const authStore = useAuthStore()

// Check authentication status
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Success state
const submissionSuccess = ref(false)
const showSuccessMessage = ref(false)

// URL for prefetching
const resourceUrl = ref('')
const prefetching = ref(false)
const prefetched = ref(false)
const prefetchError = ref<string | null>(null)

// Preview toggle
const showPreview = ref(false)

// Form data
const resource = ref<Partial<Resource>>({
  name: '',
  description: '',
  url: '',
  category: '',
  type: '',
  difficulty: 'beginner',
  pricingType: 'free',
  price: 0,
  tags: [],
  imageUrl: '',
  providerIcon: ''
})

const loading = ref(false)
const error = ref<string | null>(null)

// Categories
const categories = ref<Category[]>([])
const categoriesLoading = ref(false)
const categoriesError = ref<string | null>(null)

// Resource Types
const types = ref<ResourceType[]>([])
const typesLoading = ref(false)
const typesError = ref<string | null>(null)

// Helper for preview
const selectedCategory = computed(() => {
  if (!resource.value.category || resource.value.category === 'placeholder') return '';
  const category = categories.value.find(c => c.id === resource.value.category);
  return category ? category.name : '';
});

const previewResource = computed(() => {
  return {
    id: 'preview',
    ...resource.value,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'approved',
    categoryName: selectedCategory.value,
    votes: { upvotes: 0, downvotes: 0 },
    commentsCount: 0,
    isPreview: true
  } as Partial<Resource>;
});

// Helper functions
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

// Redirect unauthenticated users and fetch data on mount
onMounted(async () => {
  // Check authentication
  if (!isAuthenticated.value) {
    toast.error('You need to be logged in to submit a resource')
    router.push('/')
    return
  }
  
  // Fetch categories
  await fetchCategories()
  
  // Fetch resource types
  await fetchResourceTypes()
})

// Check if URL is valid
const isValidUrl = computed(() => {
  if (!resourceUrl.value) return false
  try {
    new URL(resourceUrl.value)
    return true
  } catch {
    return false
  }
})

// Handle prefetch to get link metadata
const handlePrefetch = async () => {
  try {
    // Check authentication before making request
    if (!isAuthenticated.value) {
      toast.error('You need to be logged in to submit a resource')
      router.push('/')
      return
    }
    
    prefetching.value = true
    prefetchError.value = null
    
    const response = await resourceService.prefetchResource(resourceUrl.value)
    
    if (response.status === 'success' && response.data) {
      // Fill the form with prefetched data
      resource.value = {
        ...resource.value,
        url: resourceUrl.value,
        name: response.data.name || '',
        description: response.data.description || '',
        imageUrl: response.data.imageUrl || '',
        providerIcon: response.data.providerIcon || '',
        category: 'placeholder', // Default to placeholder
        type: 'placeholder', // Default to placeholder
        difficulty: 'beginner', // Default
        pricingType: 'free', // Default
        price: 0,
        tags: []
      }
      
      prefetched.value = true
      toast.success('Resource details fetched successfully')
    } else {
      prefetchError.value = response.error?.message || 'Failed to fetch resource details'
      toast.error(prefetchError.value || 'Failed to fetch resource details')
    }
  } catch (err: any) {
    // Handle authentication errors specifically
    if (err.response && err.response.status === 401) {
      prefetchError.value = 'You need to be logged in to fetch resource details'
      toast.error(prefetchError.value)
      router.push('/')
    } else {
      prefetchError.value = err instanceof Error ? err.message : 'Failed to fetch resource details'
      toast.error(prefetchError.value || 'Failed to fetch resource details')
    }
  } finally {
    prefetching.value = false
  }
}

// Fetch categories from API
const fetchCategories = async () => {
  categoriesLoading.value = true
  categoriesError.value = null

  try {
    const response = await categoryService.getCategories()
    if (response.status === "success" && response.data) {
      categories.value = response.data
    } else {
      categoriesError.value = response.error?.message || "Failed to load categories"
      toast.error(categoriesError.value)
    }
  } catch (err) {
    console.error("Error fetching categories:", err)
    categoriesError.value = "Failed to load categories"
    toast.error(categoriesError.value)
  } finally {
    categoriesLoading.value = false
  }
}

// Fetch resource types from API
const fetchResourceTypes = async () => {
  typesLoading.value = true
  typesError.value = null

  try {
    const response = await resourceTypeService.getResourceTypes()
    if (response.status === "success" && response.data) {
      types.value = response.data
    } else {
      typesError.value = response.error?.message || "Failed to load resource types"
      toast.error(typesError.value)
    }
  } catch (err) {
    console.error("Error fetching resource types:", err)
    typesError.value = "Failed to load resource types"
    toast.error(typesError.value)
  } finally {
    typesLoading.value = false
  }
}

// Reset form to go back to URL input
const resetForm = () => {
  prefetched.value = false
  prefetchError.value = null
}

// Handle image loading error
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const difficulties = [
  'beginner',
  'intermediate',
  'advanced'
]

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = null

    // Validate required fields
    if (!resource.value.name || !resource.value.description || !resource.value.url) {
      throw new Error('Please fill in all required fields')
    }

    // Validate URL format (should already be valid from prefetch)
    try {
      new URL(resource.value.url)
    } catch {
      throw new Error('Please enter a valid URL')
    }

    // Remove placeholder values before submission
    const submissionResource = { ...resource.value };
    if (submissionResource.category === 'placeholder') submissionResource.category = '';
    if (submissionResource.type === 'placeholder') submissionResource.type = '';

    // Submit resource
    await resourceService.submitResource(submissionResource as Resource)
    
    toast.success('Resource submitted successfully')
    submissionSuccess.value = true
    showSuccessMessage.value = true
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to submit resource'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

const handleTagInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const tags = input.value.split(',').map(tag => tag.trim()).filter(Boolean)
  resource.value.tags = tags
}

const submitAnother = () => {
  submissionSuccess.value = false;
  showSuccessMessage.value = false;
  prefetched.value = false;
  resourceUrl.value = '';
  resource.value = {
    name: '',
    description: '',
    url: '',
    category: 'placeholder',
    type: 'placeholder',
    difficulty: 'beginner',
    pricingType: 'free',
    price: 0,
    tags: [],
    imageUrl: '',
    providerIcon: ''
  };
  error.value = null;
  prefetchError.value = null;
  showPreview.value = false;
};

const goToDashboard = () => {
  // Simplified check: if user exists, go to a general dashboard.
  // TODO: Implement a more specific role check if needed, e.g., by adding an isAdmin getter to authStore.
  if (authStore.isAuthenticated && authStore.user) { // Check isAuthenticated and user object
    // Defaulting to a general '/dashboard'. Adjust if admin has a different path like '/admin/dashboard'
    // and you have a way to check role e.g. authStore.isAdmin or authStore.user.role (if type is updated)
    router.push('/dashboard'); 
  } else {
    // If not authenticated or user object is not available, redirect to home or login.
    router.push('/'); 
  }
};
</script> 