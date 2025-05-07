<template>
  <Form @submit="onSubmit" class="space-y-4">
    <!-- Name Field -->
    <div class="space-y-2">
      <FormField name="name">
        <FormItem>
          <FormLabel for="name">Name</FormLabel>
          <FormControl>
            <Input 
              id="name" 
              v-model="formData.name" 
              placeholder="Enter resource name"
              :disabled="isLoading"
              required
            />
          </FormControl>
          <FormMessage v-if="errors.name">{{ errors.name }}</FormMessage>
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
              v-model="formData.description" 
              placeholder="Enter resource description"
              class="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isLoading"
              required
            />
          </FormControl>
          <FormMessage v-if="errors.description">{{ errors.description }}</FormMessage>
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
              v-model="formData.url" 
              placeholder="https://example.com"
              :disabled="isLoading"
              required
            />
          </FormControl>
          <FormMessage v-if="errors.url">{{ errors.url }}</FormMessage>
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
              v-model="formData.category"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isLoading"
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
          <FormMessage v-if="errors.category">{{ errors.category }}</FormMessage>
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
              v-model="formData.type"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isLoading"
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
          <FormMessage v-if="errors.type">{{ errors.type }}</FormMessage>
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
              v-model="formData.difficulty"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isLoading"
              required
            >
              <option value="" disabled>Select difficulty level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </FormControl>
          <FormMessage v-if="errors.difficulty">{{ errors.difficulty }}</FormMessage>
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
              :disabled="isLoading"
              @keydown.enter.prevent="addTag"
              @blur="addTag"
            />
          </FormControl>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="(tag, index) in formData.tags"
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
          <FormMessage v-if="errors.tags">{{ errors.tags }}</FormMessage>
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
              v-model="formData.pricingType"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isLoading"
              @change="handlePricingTypeChange"
              required
            >
              <option value="" disabled>Select pricing type</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </FormControl>
          <FormMessage v-if="errors.pricingType">{{ errors.pricingType }}</FormMessage>
        </FormItem>
      </FormField>
    </div>

    <!-- Price Field (only shown if pricingType is 'paid') -->
    <div v-if="formData.pricingType === 'paid'" class="space-y-2">
      <FormField name="price">
        <FormItem>
          <FormLabel for="price">Price ($)</FormLabel>
          <FormControl>
            <Input 
              id="price" 
              v-model="formData.price" 
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter price"
              :disabled="isLoading"
              required
            />
          </FormControl>
          <FormMessage v-if="errors.price">{{ errors.price }}</FormMessage>
        </FormItem>
      </FormField>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        @click="onCancel"
        :disabled="isLoading"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        :disabled="isLoading"
      >
        <span v-if="isLoading" class="mr-2">
          <span class="animate-spin">↻</span>
        </span>
        {{ isEditing ? 'Update' : 'Create' }} Resource
      </Button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './ui/form'
import type { ResourceData } from '../services/resource.service'
import type { Category, ResourceType, ResourceDifficulty, PricingType } from '@jsr/shared/types'

interface Props {
  initialData?: Partial<ResourceData>;
  categories: Category[];
  resourceTypes: ResourceType[];
  isLoading?: boolean;
  isEditing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({
    name: '',
    description: '',
    url: '',
    category: '',
    type: '',
    difficulty: 'beginner',
    tags: [],
    pricingType: 'free',
    price: undefined
  }),
  isLoading: false,
  isEditing: false
})

const emit = defineEmits<{
  (e: 'submit', data: ResourceData): void;
  (e: 'cancel'): void;
}>()

const formData = ref({
  name: props.initialData.name || '',
  description: props.initialData.description || '',
  url: props.initialData.url || '',
  category: props.initialData.category || '',
  type: props.initialData.type || '',
  difficulty: (props.initialData.difficulty as ResourceDifficulty) || 'beginner',
  tags: props.initialData.tags || [],
  pricingType: (props.initialData.pricingType as PricingType) || 'free',
  price: props.initialData.price
})

const tagsInput = ref('')

// Reset form when initialData changes
watchEffect(() => {
  formData.value = {
    name: props.initialData.name || '',
    description: props.initialData.description || '',
    url: props.initialData.url || '',
    category: props.initialData.category || '',
    type: props.initialData.type || '',
    difficulty: (props.initialData.difficulty as ResourceDifficulty) || 'beginner',
    tags: props.initialData.tags || [],
    pricingType: (props.initialData.pricingType as PricingType) || 'free',
    price: props.initialData.price
  }
})

const errors = ref({
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

const validateForm = () => {
  let isValid = true
  errors.value = {
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

  if (!formData.value.name.trim()) {
    errors.value.name = 'Name is required'
    isValid = false
  }

  if (!formData.value.description.trim()) {
    errors.value.description = 'Description is required'
    isValid = false
  }

  if (!formData.value.url.trim()) {
    errors.value.url = 'URL is required'
    isValid = false
  } else if (!isValidUrl(formData.value.url)) {
    errors.value.url = 'Please enter a valid URL'
    isValid = false
  }

  if (!formData.value.category) {
    errors.value.category = 'Category is required'
    isValid = false
  }

  if (!formData.value.type) {
    errors.value.type = 'Resource type is required'
    isValid = false
  }

  if (!formData.value.difficulty) {
    errors.value.difficulty = 'Difficulty level is required'
    isValid = false
  }

  if (formData.value.tags.length === 0) {
    errors.value.tags = 'At least one tag is required'
    isValid = false
  }

  if (!formData.value.pricingType) {
    errors.value.pricingType = 'Pricing type is required'
    isValid = false
  }

  if (formData.value.pricingType === 'paid' && (!formData.value.price || formData.value.price <= 0)) {
    errors.value.price = 'Price is required for paid resources'
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
    formData.value.tags = [...new Set([...formData.value.tags, ...newTags])]
    
    // Clear the input
    tagsInput.value = ''
  }
}

const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1)
}

const handlePricingTypeChange = () => {
  if (formData.value.pricingType === 'free') {
    formData.value.price = undefined
  }
}

const onSubmit = () => {
  if (validateForm()) {
    emit('submit', formData.value)
  }
}

const onCancel = () => {
  emit('cancel')
}

// Define component name and export it
const name = 'ResourceForm'
defineOptions({ name })
</script> 