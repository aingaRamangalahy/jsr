<template>
  <div class="container flex h-screen w-screen flex-col items-center justify-center">
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>Welcome to JSR</CardTitle>
        <CardDescription>
          Sign in to access JavaScript learning resources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <GitHubAuthButton />
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <p class="text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import GitHubAuthButton from '@/components/custom/GitHubAuthButton.vue'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  // Check if we're returning from GitHub OAuth
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  
  if (code) {
    const success = await authStore.handleGitHubCallback(code)
    if (success) {
      toast.success('Successfully logged in with GitHub')
      router.push('/')
    } else {
      toast.error('Failed to complete GitHub login')
    }
  }
})
</script> 