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
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Name -->
            <div class="space-y-2">
              <label for="name" class="text-sm font-medium">Name *</label>
              <Input
                id="name"
                v-model="resource.name"
                placeholder="Enter resource name"
                required
              />
            </div>

            <!-- Description -->
            <div class="space-y-2">
              <label for="description" class="text-sm font-medium">Description *</label>
              <Input
                id="description"
                v-model="resource.description"
                placeholder="Enter resource description"
                required
              />
            </div>

            <!-- URL -->
            <div class="space-y-2">
              <label for="url" class="text-sm font-medium">URL *</label>
              <Input
                id="url"
                v-model="resource.url"
                type="url"
                placeholder="https://example.com"
                required
              />
            </div>

            <!-- Category -->
            <div class="space-y-2">
              <label for="category" class="text-sm font-medium">Category</label>
              <select
                id="category"
                v-model="resource.category"
                class="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">Select a category</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <!-- Type -->
            <div class="space-y-2">
              <label for="type" class="text-sm font-medium">Type</label>
              <select
                id="type"
                v-model="resource.type"
                class="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">Select a type</option>
                <option v-for="type in types" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>

            <!-- Difficulty -->
            <div class="space-y-2">
              <label for="difficulty" class="text-sm font-medium">Difficulty</label>
              <select
                id="difficulty"
                v-model="resource.difficulty"
                class="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option v-for="difficulty in difficulties" :key="difficulty" :value="difficulty">
                  {{ difficulty.charAt(0).toUpperCase() + difficulty.slice(1) }}
                </option>
              </select>
            </div>

            <!-- Pricing -->
            <div class="space-y-2">
              <label for="pricingType" class="text-sm font-medium">Pricing Type</label>
              <select
                id="pricingType"
                v-model="resource.pricingType"
                class="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <!-- Price (if paid) -->
            <div v-if="resource.pricingType === 'paid'" class="space-y-2">
              <label for="price" class="text-sm font-medium">Price</label>
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
              <label for="tags" class="text-sm font-medium">Tags</label>
              <Input
                id="tags"
                placeholder="Enter tags (comma-separated)"
                @input="handleTagInput"
              />
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
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { resourceService } from '@/services/resource.service'
import type { Resource } from '@jsr/shared/types'
import { toast } from 'vue-sonner'

const router = useRouter()

const resource = ref<Partial<Resource>>({
  name: '',
  description: '',
  url: '',
  category: '',
  type: '',
  difficulty: 'beginner',
  pricingType: 'free',
  price: 0,
  tags: []
})

const loading = ref(false)
const error = ref<string | null>(null)

const categories = [
  'Tutorial',
  'Course',
  'Book',
  'Video',
  'Article',
  'Tool',
  'Library',
  'Framework',
  'Other'
]

const types = [
  'Website',
  'GitHub Repository',
  'YouTube Channel',
  'Documentation',
  'Blog',
  'Forum',
  'Other'
]

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

    // Validate URL format
    try {
      new URL(resource.value.url)
    } catch {
      throw new Error('Please enter a valid URL')
    }

    // Submit resource
    await resourceService.submitResource(resource.value as Resource)
    
    toast.success('Resource submitted successfully')
    router.push('/resources')
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
</script> 