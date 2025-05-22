<template>
  <Sheet :open="isOpen" @update:open="toggleSheet">
    <SheetContent :side="side" class="overflow-y-auto">
      <SheetHeader>
        <SheetTitle>{{ isEditing ? `Edit ${entityType}` : `Add New ${entityType}` }}</SheetTitle>
        <SheetDescription>
          {{ isEditing ? `Update an existing ${entityType.toLowerCase()}` : `Create a new ${entityType.toLowerCase()} here. Click save when you're done.` }}
        </SheetDescription>
      </SheetHeader>
      
      <div class="py-6">
        <EntityForm
          :initial-data="entityData"
          :is-loading="isLoading"
          :is-editing="isEditing"
          @submit="handleSubmit"
          @cancel="toggleSheet(false)"
        />
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet'
import EntityForm from './EntityForm.vue'

// Define component name
defineOptions({
  name: 'EntitySheet'
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
  };
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const props = withDefaults(defineProps<Props>(), {
  entityData: () => ({ name: '', description: '' }),
  side: 'right',
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'submit', data: { id?: string; name: string; description: string }): void;
}>()

const toggleSheet = (value: boolean) => {
  emit('update:open', value)
}

const handleSubmit = (data: { id?: string; name: string; description: string }) => {
  emit('submit', data)
}
</script> 