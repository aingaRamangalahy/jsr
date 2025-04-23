<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-[#151618]">
    <AppHeader class="sticky top-0 z-40" />
    <div class="flex flex-col md:flex-row flex-1">
      <!-- Fixed Sidebar component -->
      <div v-if="shouldShowSidebar" class="hidden md:block relative">
        <AppSidebar
          class="fixed md:w-64 lg:w-72 xl:w-80 h-[calc(100vh-4rem)] top-16 overflow-hidden"
        />
      </div>
      <!-- Placeholder to maintain layout -->
      <div v-if="shouldShowSidebar" class="hidden md:block md:w-64 lg:w-72 xl:w-80 shrink-0"></div>

      <!-- Main content area -->
      <main class="flex-1 p-4 md:p-6 lg:p-8 xl:px-16">
        <div class="max-w-7xl mx-auto w-full">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layouts/AppHeader.vue';
import AppSidebar from '@/components/layouts/AppSidebar.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const routesWithoutSidebar = ['/add-resource'];

const shouldShowSidebar = computed(() => {
  return !routesWithoutSidebar.includes(route.path);
});
</script>
