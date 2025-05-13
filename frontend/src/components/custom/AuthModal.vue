<template>
  <Dialog :open="showModal" @update:open="(value) => !value && closeModal()">
    <DialogContent class="max-w-md">
      <!-- Close button -->
      <button 
        @click="closeModal" 
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
      
      <!-- Modal content -->
      <div class="px-1 pb-3 pt-1">
        <DialogTitle class="text-center text-xl font-semibold leading-none tracking-tight">
          Welcome to JSResources
        </DialogTitle>
        <DialogDescription class="mx-auto mt-2 max-w-xs text-center text-sm">
          Continue with a social login to access all features.
        </DialogDescription>
      </div>
      
      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="login">Log In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" class="p-1">
          <div class="flex flex-col gap-3 px-1 py-3">
            <Button 
              variant="outline" 
              @click="handleLogin('github')" 
              :disabled="isLoading" 
              class="flex h-11 w-full items-center justify-center gap-2"
            >
              <GithubIcon class="h-5 w-5" />
              <span>Continue with GitHub</span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="signup" class="p-1">
          <div class="flex flex-col gap-3 px-1 py-3">
            <Button 
              variant="outline" 
              @click="handleLogin('github')" 
              :disabled="isLoading" 
              class="flex h-11 w-full items-center justify-center gap-2"
            >
              <GithubIcon class="h-5 w-5" />
              <span>Sign up with GitHub</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <div class="mt-4 text-center text-xs text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </div>
    </DialogContent>
  </Dialog>
</template> 

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GithubIcon } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'

// Define props
interface Props {
  showModal: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

// Store
const authStore = useAuthStore()

// State
const activeTab = ref('login')
const isLoading = ref(false)

// Methods
const handleLogin = async (provider: 'github') => {
  isLoading.value = true
  try {
    if (provider === 'github') {
      await authStore.loginWithGitHub()
    }
  } catch (error) {
    console.error(`${provider} login failed`, error)
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script>

