<template>
  <div class="space-y-6">
    <div id="resources">
      <FrameworkFilters />

      <ResourceFilters />

      <ResourceList />

      <transition
        enter-active-class="transition-opacity duration-300 ease-out"
        leave-active-class="transition-opacity duration-200 ease-in"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-show="showBackToTop"
          class="fixed bottom-6 right-6 z-30 cursor-pointer text-gray-700 dark:text-blue-300"
        >
          <Button
            severity="secondary"
            rounded
            aria-label="Back to top"
            class="shadow-md hover:shadow-lg !p-3"
            @click="scrollToTop"
          >
            <i class="pi pi-arrow-up"></i>
          </Button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import ResourceFilters from '@/components/resources/ResourceFilters.vue'
import ResourceList from '@/components/resources/ResourceList.vue'
import Button from '@/volt/Button.vue'
import FrameworkFilters from '@/components/resources/FrameworkFilters.vue'

const showBackToTop = ref(false)

onMounted(() => {
  const handleScroll = () => {
    // Show button when scrolled down 300px or more
    showBackToTop.value = window.scrollY > 300
  }

  window.addEventListener('scroll', handleScroll)

  // Clean up event listener on component unmount
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>
