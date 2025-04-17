<template>
  <div class="mb-6">
    <div class="flex items-center mb-3">
      <h3
        class="text-sm font-medium text-gray-500 dark:text-blue-300 uppercase tracking-wider mb-3"
      >
        Popular Frameworks
      </h3>
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
        @click="handleFrameworkToggle(framework.id)"
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
import { useRoute, useRouter } from 'vue-router'

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
    icon: '⚛️',
  },
  {
    id: 'vue',
    name: 'Vue',
    color: 'bg-emerald-500',
    darkColor: 'bg-emerald-600',
    icon: '🟢',
  },
  {
    id: 'angular',
    name: 'Angular',
    color: 'bg-red-500',
    darkColor: 'bg-red-600',
    icon: '🅰️',
  },
  {
    id: 'svelte',
    name: 'Svelte',
    color: 'bg-orange-500',
    darkColor: 'bg-orange-600',
    icon: '🔥',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    color: 'bg-green-600',
    darkColor: 'bg-green-700',
    icon: '💚',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    color: 'bg-gray-600',
    darkColor: 'bg-gray-700',
    icon: '▲',
  },
  {
    id: 'nuxtjs',
    name: 'Nuxt.js',
    color: 'bg-green-500',
    darkColor: 'bg-green-600',
    icon: '🟩',
  },
]

const { filters, toggleFramework, updateFrameworkFilters } = useFilters()
const route = useRoute()
const router = useRouter()

const selectedFrameworks = computed(() => filters.value.frameworks)

const isSelected = (frameworkId: string): boolean => {
  return selectedFrameworks.value.includes(frameworkId)
}

// Handle framework toggle with router navigation if needed
const handleFrameworkToggle = (frameworkId: string) => {
  if (route.path !== '/') {
    // Create a copy of current frameworks
    const currentFrameworks = [...filters.value.frameworks];

    // Toggle the framework in the copy
    const index = currentFrameworks.indexOf(frameworkId);
    if (index === -1) {
      currentFrameworks.push(frameworkId);
    } else {
      currentFrameworks.splice(index, 1);
    }

    // Navigate to home with frameworks in query
    router.push({
      path: '/',
      query: {
        ...route.query,
        frameworks: currentFrameworks
      }
    });
  } else {
    // Already on home, just toggle
    toggleFramework(frameworkId);
  }
};

const clearFrameworks = () => {
  if (route.path !== '/') {
    const query = { ...route.query };
    delete query.frameworks;
    router.push({ path: '/', query });
  } else {
    updateFrameworkFilters([]);
  }
}

// This function returns the appropriate color class based on dark mode
const getFrameworkActiveColor = (frameworkId: string): string => {
  const framework = frameworks.find((f) => f.id === frameworkId)
  if (!framework) return 'bg-blue-500 dark:bg-blue-600'

  const isDarkMode = document.documentElement.classList.contains('dark')
  return isDarkMode ? framework.darkColor : framework.color
}
</script>
