<template>
  <div class="max-w-4xl mx-auto">
    <Card>
      <template #content>
        <h1 class="text-2xl font-bold mb-6">Add New Resource</h1>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Single column layout -->
          <div class="space-y-4">
            <!-- URL -->
            <div>
              <label for="url" class="block text-sm font-medium mb-1">Resource URL</label>
              <InputText
                id="url"
                type="url"
                v-model="formData.url"
                placeholder="https://"
                :class="{ 'p-invalid': errors.url }"
                class="w-full"
              >
                <template #prefix>
                  <i class="pi pi-link text-surface-400"></i>
                </template>
              </InputText>
              <p v-if="errors.url" class="mt-1 text-sm text-red-500 flex items-center">
                <i class="pi pi-exclamation-circle mr-1 text-xs"></i>
                {{ errors.url }}
              </p>
            </div>

            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium mb-1">Resource Title</label>
              <InputText
                id="title"
                type="text"
                v-model="formData.title"
                placeholder="e.g., JavaScript.info"
                :class="{ 'p-invalid': errors.title }"
                class="w-full"
              >
                <template #prefix>
                  <i class="pi pi-file-edit text-surface-400"></i>
                </template>
              </InputText>
              <p v-if="errors.title" class="mt-1 text-sm text-red-500 flex items-center">
                <i class="pi pi-exclamation-circle mr-1 text-xs"></i>
                {{ errors.title }}
              </p>
            </div>

            <!-- Image URL -->
            <div>
              <label for="image" class="block text-sm font-medium mb-1">Resource Image URL</label>
              <div class="flex flex-col gap-3">
                <InputText
                  id="image"
                  type="url"
                  v-model="formData.image"
                  placeholder="https://"
                  class="w-full"
                >
                  <template #prefix>
                    <i class="pi pi-image text-surface-400"></i>
                  </template>
                </InputText>
              </div>
            </div>

            <!-- Type -->
            <div>
              <label for="type" class="block text-sm font-medium mb-1">Resource Type</label>
              <Select
                id="type"
                v-model="formData.type"
                :options="typeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select a type"
                class="w-full"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center">
                    <i :class="getTypeIcon(slotProps.value)" class="mr-2"></i>
                    <span>{{ slotProps.value }}</span>
                  </div>
                  <span v-else>Select a type</span>
                </template>
                <template #option="slotProps">
                  <div class="flex items-center">
                    <i :class="getTypeIcon(slotProps.option?.value)" class="mr-2"></i>
                    <span>{{ slotProps.option?.label }}</span>
                  </div>
                </template>
              </Select>
            </div>

            <!-- Skill Level -->
            <div>
              <label for="level" class="block text-sm font-medium mb-1">Skill Level</label>
              <Select
                id="level"
                v-model="formData.skillLevel"
                :options="skillLevelOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select skill level"
                class="w-full"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center">
                    <i :class="getSkillLevelIcon(slotProps.value)" class="mr-2"></i>
                    <span>{{ slotProps.value }}</span>
                  </div>
                  <span v-else>Select skill level</span>
                </template>
                <template #option="slotProps">
                  <div class="flex items-center">
                    <i :class="getSkillLevelIcon(slotProps.option?.value)" class="mr-2"></i>
                    <span>{{ slotProps.option?.label }}</span>
                  </div>
                </template>
              </Select>
            </div>

            <!-- Tags -->
            <div>
              <label class="block text-sm font-medium mb-1">Tags</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <Chip
                  v-for="tag in formData.tags"
                  :key="tag"
                  :label="tag"
                  :removable="true"
                  @remove="removeTag(tag)"
                  class="bg-primary-50 text-primary dark:bg-primary-900 dark:text-primary-300"
                />
              </div>
              <InputText
                v-model="currentTag"
                @keydown="handleTagAdd"
                placeholder="Type a tag and press Enter"
                class="w-full"
              >
                <template #prefix>
                  <i class="pi pi-tag text-surface-400"></i>
                </template>
              </InputText>
            </div>

            <!-- Description (moved to end because it's larger) -->
            <div>
              <label for="description" class="block text-sm font-medium mb-1">Description</label>
              <Textarea
                id="description"
                v-model="formData.description"
                rows="5"
                placeholder="Describe the resource and what makes it valuable..."
                :class="{ 'p-invalid': errors.description }"
                class="w-full"
              />
              <p v-if="errors.description" class="mt-1 text-sm text-red-500 flex items-center">
                <i class="pi pi-exclamation-circle mr-1 text-xs"></i>
                {{ errors.description }}
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-between gap-4 pt-4">
            <Button
              icon="pi pi-times"
              class="flex-1/2"
              type="button"
              variant="text"
              severity="secondary"
              @click="navigateToHome"
            >
              <i class="pi pi-times mr-2"></i>
              Cancel
            </Button>
            <Button icon="pi pi-plus" class="flex-1/2" type="submit" severity="primary">
              <i class="pi pi-plus mr-2"></i>
              Add Resource
            </Button>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import Card from '@/volt/Card.vue'
  import InputText from '@/volt/InputText.vue'
  import Textarea from '@/volt/Textarea.vue'
  import Select from '@/volt/Select.vue'
  import Button from '@/volt/Button.vue'
  import Chip from '@/volt/Chip.vue'
  import { useResourceStore } from '@/stores/resource'

  const router = useRouter()
  const resourceStore = useResourceStore()

  interface FormData {
    title: string
    description: string
    url: string
    type: string
    image: string
    skillLevel: string
    tags: string[]
    frameworks: string[]
  }

  const initialFormData: FormData = {
    title: '',
    description: '',
    url: '',
    type: 'website',
    image: '',
    skillLevel: 'beginner',
    tags: [],
    frameworks: [],
  }

  const formData = ref<FormData>({ ...initialFormData })
  const currentTag = ref('')
  const errors = ref<Partial<FormData>>({})

  const typeOptions = [
    { label: 'Website', value: 'website' },
    { label: 'Book', value: 'book' },
    { label: 'YouTube', value: 'youtube' },
    { label: 'Twitter', value: 'twitter' },
    { label: 'Course', value: 'course' },
  ]

  const skillLevelOptions = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ]

  // Get icon class based on resource type
  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'website':
        return 'pi pi-globe'
      case 'book':
        return 'pi pi-book'
      case 'youtube':
        return 'pi pi-youtube'
      case 'twitter':
        return 'pi pi-twitter'
      case 'course':
        return 'pi pi-desktop'
      default:
        return 'pi pi-globe'
    }
  }

  // Get icon based on skill level
  const getSkillLevelIcon = (level: string): string => {
    switch (level) {
      case 'beginner':
        return 'pi pi-star text-green-500'
      case 'intermediate':
        return 'pi pi-star-fill text-blue-500'
      case 'advanced':
        return 'pi pi-star-fill text-purple-500'
      default:
        return 'pi pi-star'
    }
  }

  const handleSubmit = () => {
    const newErrors: Partial<FormData> = {}

    // Basic validation
    if (!formData.value.title) newErrors.title = 'Title is required'
    if (!formData.value.description) newErrors.description = 'Description is required'
    if (!formData.value.url) newErrors.url = 'URL is required'
    if (!formData.value.type) newErrors.type = 'Type is required'
    if (!formData.value.skillLevel) newErrors.skillLevel = 'Skill level is required'

    if (Object.keys(newErrors).length > 0) {
      errors.value = newErrors
      return
    }

    // Handle form submission
    console.log('Form submitted:', formData.value)
    resourceStore.addResource({
      ...formData.value,
      id: 0,
      rating: 0,
      votes: 0,
      dateAdded: '',
    })

    // Navigate back to home after successful submission
    router.push('/')
  }

  const handleTagAdd = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.value.trim()) {
      e.preventDefault()
      if (!formData.value.tags.includes(currentTag.value.trim())) {
        formData.value.tags.push(currentTag.value.trim())
      }
      currentTag.value = ''
    }
  }

  const removeTag = (tagToRemove: string) => {
    formData.value.tags = formData.value.tags.filter((tag) => tag !== tagToRemove)
  }

  const navigateToHome = () => {
    router.push('/')
  }
</script>
