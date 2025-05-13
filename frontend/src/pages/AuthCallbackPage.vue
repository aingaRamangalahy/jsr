<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'vue-sonner'

const router = useRouter()
const authStore = useAuthStore()

const status = ref('Loading...')
const error = ref('')

onMounted(async () => {
  try {
    console.log('Auth callback page mounted')
    status.value = 'Processing authentication...'
    
    // Handle the OAuth callback
    console.log('Handling OAuth callback')
    const success = await authStore.handleCallback()
    console.log('Callback handled, success:', success)
    
    if (success) {
      status.value = 'Successfully authenticated! Redirecting...'
      toast.success('Successfully signed in!')
      
      // Redirect to the home page immediately
      console.log('Redirecting to home page')
      router.push({ name: 'home' })
    } else {
      status.value = 'Authentication failed!'
      error.value = authStore.error || 'An unknown error occurred'
      toast.error('Authentication failed')
      console.error('Auth callback failed:', authStore.error)
    }
  } catch (err: any) {
    console.error('Auth callback error:', err)
    status.value = 'Authentication error!'
    error.value = err.message || 'An unknown error occurred'
    toast.error(`Authentication error: ${err.message || 'Unknown error'}`)
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
      <div class="text-center">
        <h1 class="text-2xl font-semibold text-card-foreground">{{ status }}</h1>
        
        <div v-if="error" class="mt-4">
          <p class="text-sm text-destructive">{{ error }}</p>
          <button
            @click="router.push('/login')"
            class="mt-4 inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Try Again
          </button>
        </div>
        
        <div v-else class="mt-4">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        </div>
      </div>
    </div>
  </div>
</template> 