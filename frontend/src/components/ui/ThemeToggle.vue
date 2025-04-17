<template>
  <Button
    text
    rounded
    @click="toggleTheme"
    :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
    class="text-gray-700 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
  >
    <template #icon>
      <SunIcon v-if="isDark" :size="18" />
      <MoonIcon v-else :size="18" />
    </template>
  </Button>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { SunIcon, MoonIcon } from 'lucide-vue-next'
import Button from '@/volt/Button.vue'
import { computed } from 'vue'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.theme === 'dark')

function toggleTheme() {
  themeStore.toggleTheme()
}
</script>
