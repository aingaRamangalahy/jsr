<template>
  <div class="min-h-screen bg-background">
    <TooltipProvider>
      <MainLayout>
        <RouterView />
      </MainLayout>
    </TooltipProvider>
    <Toaster />
    <AuthModal 
      :showModal="authState.isAuthModalOpen" 
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
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const authState = useAuth()
const authStore = useAuthStore()

// Check if user is already authenticated
onMounted(async () => {
  await authStore.checkAuth()
})
</script> 