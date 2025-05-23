<template>
  <div class="min-h-screen bg-background">
    <TooltipProvider>
      <MainLayout>
        <RouterView />
      </MainLayout>
    </TooltipProvider>
    <Toaster />
    <AuthModal 
      :showModal="authState.isAuthModalOpen.value" 
      @close="authState.closeAuthModal"
    />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from 'reka-ui'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthModal from '@/components/custom/AuthModal.vue'
import { useAuth } from '@/composables/useAuth'
import { onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useInteractionsStore } from '@/stores/interactions.store'
import { useResourceStore } from '@/stores/resource'

const authState = useAuth()
const authStore = useAuthStore()
// Initialize interactions store early
const interactionsStore = useInteractionsStore()
// Get access to the resource store
const resourceStore = useResourceStore()

// Check if user is already authenticated
onMounted(async () => {
  await authStore.checkAuth()
})

// Watch for authentication status changes to initialize or clear interactions
watch(() => authStore.isAuthenticated, (isAuthenticated: boolean) => {
  if (!isAuthenticated) {
    // Clear interactions when user logs out
    interactionsStore.clearInteractions()
  }
  // We no longer fetch interactions here, it's now handled in ResourcesPage.vue
}, { immediate: true })
</script> 