<template>
  <Dialog :open="isOpen" @update:open="toggleDialog">
    <DialogContent class="overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? `Edit ${entityType}` : `Add New ${entityType}` }}</DialogTitle>
        <DialogDescription>
          {{ isEditing ? `Update an existing ${entityType.toLowerCase()}` : `Create a new ${entityType.toLowerCase()} here. Click save when you're done.` }}
        </DialogDescription>
      </DialogHeader>
      
      <div class="py-6">
        <EntityForm
          :initial-data="entityData"
          :is-loading="isLoading"
          :is-editing="isEditing"
          @submit="handleSubmit"
          @cancel="toggleDialog(false)"
        />
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog'
import EntityForm from './EntityForm.vue'

// Define component name
defineOptions({
  name: 'EntityDialog'
})

interface Props {
  entityType: string;
  isOpen: boolean;
  isLoading: boolean;
  isEditing: boolean;
  entityData: {
    id?: string;
    name: string;
    description: string;
    iconUrl?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  entityData: () => ({ name: '', description: '', iconUrl: undefined }),
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'submit', data: { id?: string; name: string; description: string; iconUrl?: string }): void;
}>()

const toggleDialog = (value: boolean) => {
  emit('update:open', value)
}

const handleSubmit = (data: { id?: string; name: string; description: string; iconUrl?: string }) => {
  emit('submit', data) 
}
</script> 