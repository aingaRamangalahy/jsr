<template>
  <div class="mb-6">
    <div class="flex items-center mb-3">
      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Popular Frameworks</h3>
      <Button
        v-if="selectedFrameworks.length > 0"
        @click="clearFrameworks"
        class="ml-3 text-xs text-gray-500 dark:text-blue-500 hover:text-gray-700 dark:hover:text-blue-400"
        text
      >
        Clear all
      </Button>
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="framework in frameworks"
        :key="framework.id"
        @click="toggleFramework(framework.id)"
        :class="[
          'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer',
          isSelected(framework.id)
            ? `${getFrameworkActiveColor(framework.id)} text-white dark:text-white`
            : 'bg-gray-100 dark:bg-[#27292f] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
        ]"
      >
        <span class="mr-1.5">{{ framework.icon }}</span>
        {{ framework.name }}
        <i v-if="isSelected(framework.id)" class="pi pi-times ml-1.5 hover:text-gray-100"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import Button from '@/volt/Button.vue'
  import { useFilters } from '@/composables/useFilters'

  interface Framework {
    id: string
    name: string
    color: string
    darkColor: string
    icon: string
  }

  const frameworks: Framework[] = [
    {
      id: 'react',
      name: 'React',
      color: 'bg-blue-500',
      darkColor: 'bg-blue-600',
      icon: '⚛️'
    },
    {
      id: 'vue',
      name: 'Vue',
      color: 'bg-emerald-500',
      darkColor: 'bg-emerald-600',
      icon: '🟢'
    },
    {
      id: 'angular',
      name: 'Angular',
      color: 'bg-red-500',
      darkColor: 'bg-red-600',
      icon: '🅰️'
    },
    {
      id: 'svelte',
      name: 'Svelte',
      color: 'bg-orange-500',
      darkColor: 'bg-orange-600',
      icon: '🔥'
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      color: 'bg-green-600',
      darkColor: 'bg-green-700',
      icon: '💚'
    },
    {
      id: 'express',
      name: 'Express.js',
      color: 'bg-gray-600',
      darkColor: 'bg-gray-700',
      icon: '🚂'
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      color: 'bg-gray-600',
      darkColor: 'bg-gray-700',
      icon: '▲'
    },
  ]

  const { filters, toggleFramework, updateFilter } = useFilters()

  const selectedFrameworks = computed(() => filters.value.frameworks)

  const isSelected = (frameworkId: string): boolean => {
    return selectedFrameworks.value.includes(frameworkId)
  }

  const clearFrameworks = () => {
    updateFilter('frameworks', [])
  }

  // This function returns the appropriate color class based on dark mode
  const getFrameworkActiveColor = (frameworkId: string): string => {
    const framework = frameworks.find(f => f.id === frameworkId)
    if (!framework) return 'bg-blue-500 dark:bg-blue-600'

    const isDarkMode = document.documentElement.classList.contains('dark')
    return isDarkMode ? framework.darkColor : framework.color
  }
</script>
