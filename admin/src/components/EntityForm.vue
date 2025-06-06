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
              placeholder="Enter name"
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
            <Input 
              id="description" 
              v-model="formData.description" 
              placeholder="Enter description"
              :disabled="isLoading"
              required
            />
          </FormControl>
          <FormMessage v-if="errors.description">{{ errors.description }}</FormMessage>
        </FormItem>
      </FormField>

      <!-- Icon URL Field -->
      <FormField name="iconUrl">
        <FormItem>
          <FormLabel for="iconUrl">Icon URL</FormLabel>
          <FormControl>
            <Input 
              id="iconUrl" 
              v-model="formData.iconUrl" 
              placeholder="Enter icon URL"
              :disabled="isLoading"
            />
          </FormControl>
          <FormMessage v-if="errors.iconUrl">{{ errors.iconUrl }}</FormMessage>
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
        {{ isEditing ? 'Update' : 'Create' }}
      </Button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './ui/form'

interface Props {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    iconUrl?: string;
  };
  isLoading?: boolean;
  isEditing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({ name: '', description: '', iconUrl: undefined }),
  isLoading: false,
  isEditing: false
})

const emit = defineEmits<{
  (e: 'submit', data: { name: string; description: string; id?: string; iconUrl?: string }): void;
  (e: 'cancel'): void;
}>()

const formData = ref({
  id: props.initialData.id,
  name: props.initialData.name,
  description: props.initialData.description,
  iconUrl: props.initialData.iconUrl
})

// Reset form when initialData changes
watchEffect(() => {
  formData.value = {
    id: props.initialData.id,
    name: props.initialData.name,
    description: props.initialData.description,
    iconUrl: props.initialData.iconUrl
  }
})

const errors = ref({
  name: '',
  description: '',
  iconUrl: ''
})

const validateForm = () => {
  let isValid = true
  errors.value = { name: '', description: '', iconUrl: '' }

  if (!formData.value.name.trim()) {
    errors.value.name = 'Name is required'
    isValid = false
  }

  if (!formData.value.description.trim()) {
    errors.value.description = 'Description is required'
    isValid = false
  }

  if (!formData.value.iconUrl.trim()) {
    errors.value.iconUrl = 'Icon URL is required'
    isValid = false
  }

  return isValid
}

const onSubmit = () => {
  if (validateForm()) {
    emit('submit', { 
      id: formData.value.id,
      name: formData.value.name,
      description: formData.value.description,
      iconUrl: formData.value.iconUrl
    })
  }
}

const onCancel = () => {
  emit('cancel')
}

// Define options
defineOptions({
  name: 'EntityForm'
})
</script> 