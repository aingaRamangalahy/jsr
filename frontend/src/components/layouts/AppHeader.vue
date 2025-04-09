<template>
  <header
  class="bg-white dark:bg-[#1e1f23] border-b border-gray-200 dark:border-[#27292f] sticky top-0 z-10 shadow-sm"
  >
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center">
        <button
          class="md:hidden mr-3 text-gray-700 dark:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md"
          @click="isMenuOpen = !isMenuOpen"
        >
          <i class="pi pi-bars text-xl"></i>
        </button>
        <router-link to="/" class="flex items-center">
          <span class="text-blue-600 dark:text-indigo-400 font-bold text-xl md:text-2xl">JS</span>
          <span class="font-bold text-xl md:text-2xl ml-1 text-gray-900 dark:text-blue-300">
            Resources
          </span>
        </router-link>
      </div>

      <!-- Search bar -->
      <div class="hidden md:flex items-center flex-1 max-w-xl mx-6">
        <div class="relative w-full">
          <InputText v-model="searchQuery" placeholder="Search resources..." class="w-full pl-10" />
          <i
            class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          ></i>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center space-x-4">
        <Button
          as-child
          severity="primary"
          class="hidden md:flex bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <router-link
            to="/add-resource"
            class="flex items-center gap-2 text-blue-600 dark:text-blue-400"
          >
            <i class="pi pi-plus"></i>
            <span>Add Resource</span>
          </router-link>
        </Button>
        <ThemeToggle />
      </div>
    </div>

    <!-- Mobile search - only shown when menu is closed -->
    <div v-if="!isMenuOpen" class="md:hidden px-4 pb-3">
      <div class="relative w-full">
        <InputText v-model="searchQuery" placeholder="Search resources..." class="w-full pl-10" />
        <i
          class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        ></i>
      </div>
    </div>

    <!-- Mobile menu -->
    <nav
      v-if="isMenuOpen"
      class="md:hidden bg-white dark:bg-gray-900 px-4 py-3 border-t border-gray-200 dark:border-gray-800"
    >
      <ul class="space-y-3">
        <li>
          <router-link
            to="/"
            class="block py-2 text-gray-700 dark:text-blue-300 hover:text-blue-600 dark:hover:text-indigo-400"
            @click="isMenuOpen = false"
          >
            Home
          </router-link>
        </li>
        <li>
          <router-link
            to="/about"
            class="block py-2 text-gray-700 dark:text-blue-300 hover:text-blue-600 dark:hover:text-indigo-400"
            @click="isMenuOpen = false"
          >
            About
          </router-link>
        </li>
        <li>
          <router-link
            to="/add-resource"
            class="flex items-center text-blue-600 dark:text-indigo-400 py-2"
            @click="isMenuOpen = false"
          >
            <i class="pi pi-plus mr-1"></i>
            <span>Add Resource</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import ThemeToggle from '../ui/ThemeToggle.vue'
  import InputText from '@/volt/InputText.vue'
  import Button from '@/volt/Button.vue'
  import { useFilters } from '@/composables/useFilters'

  const isMenuOpen = ref(false)
  const { filters, setSearchQuery } = useFilters()

  // Create computed property for the search query
  const searchQuery = computed({
    get: () => filters.value.search,
    set: (value) => setSearchQuery(value),
  })
</script>
