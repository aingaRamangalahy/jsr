<template>
  <div class="inline-flex items-center">
    <slot></slot>
    <button 
      type="button" 
      role="switch" 
      :aria-checked="modelValue" 
      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      :class="modelValue ? 'bg-primary dark:bg-primary light:bg-blue-600' : 'bg-gray-200 dark:bg-zinc-700 light:bg-gray-300'"
      @click="toggle"
    >
      <span 
        class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';

const props = defineProps<{
  modelValue: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const toggle = () => {
  emit('update:modelValue', !props.modelValue);
};
</script>

<script lang="ts">
export default defineComponent({
  name: 'ToggleButton'
});
</script> 