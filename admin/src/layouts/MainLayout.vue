<template>
  <div class="flex flex-col min-h-screen bg-background text-foreground">
    <div class="flex flex-1 relative md:flex-row flex-col">
      <AppSidebar 
        class="sticky top-0 h-screen md:relative md:top-0 w-full md:w-auto" 
        v-model:collapsed="sidebarCollapsed" 
        :mobile="isMobile"
      >
        
        <template #user-info>
          <div v-if="authStore.adminName" class="px-4 text-sm">
            {{ authStore.adminName }}
          </div>
        </template>
        
        <template #footer>
          <div class="px-4 py-4 mt-auto">
            <button @click="logout" class="w-full bg-primary text-primary-foreground px-3 py-1.5 rounded-[var(--radius)] cursor-pointer text-sm hover:opacity-90">
              Logout
            </button>
          </div>
        </template>
      </AppSidebar>
      
      <main class="flex-1 p-5 overflow-x-hidden">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import AppSidebar from '../components/AppSidebar.vue'

const router = useRouter()
const authStore = useAuthStore()
const sidebarCollapsed = ref(false)
const isMobile = ref(false)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
  sidebarCollapsed.value = isMobile.value
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}

// Add default export
defineOptions({
  name: 'MainLayout'
})
</script> 