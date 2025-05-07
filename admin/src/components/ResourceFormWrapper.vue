<template>
  <component :is="ResourceForm"
    :initial-data="initialData"
    :categories="categories"
    :resource-types="resourceTypes"
    :is-loading="isLoading"
    :is-editing="isEditing"
    @submit="$emit('submit', $event)"
    @cancel="$emit('cancel')"
  />
</template>

<script setup lang="ts">
import ResourceForm from './ResourceForm.vue'
import type { ResourceData } from '../services/resource.service'
import type { Category, ResourceType } from '@jsr/shared/types'

defineProps<{
  initialData?: Partial<ResourceData>;
  categories: Category[];
  resourceTypes: ResourceType[];
  isLoading?: boolean;
  isEditing?: boolean;
}>()

defineEmits<{
  (e: 'submit', data: ResourceData): void;
  (e: 'cancel'): void;
}>()

defineOptions({
  name: 'ResourceFormWrapper'
})
</script> 