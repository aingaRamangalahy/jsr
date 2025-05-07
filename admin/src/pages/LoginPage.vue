<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-center">JSR Admin</CardTitle>
        <CardDescription class="text-center">Login to access the dashboard</CardDescription>
      </CardHeader>
      <CardContent class="gap-4">
        <div class="space-y-4">
          <Form @submit="onSubmit">
            <FormField
              v-slot="{ field, errorMessage }"
              name="email"
              :validate="validateEmail"
            >
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    v-bind="field"
                    type="email"
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>
            
            <FormField
              v-slot="{ field, errorMessage }"
              name="password"
              :validate="validatePassword"
            >
              <FormItem class="mt-4">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    v-bind="field"
                    type="password"
                    placeholder="Enter your password"
                  />
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>
            
            <div v-if="authStore.error" class="text-destructive text-sm text-center mt-4">
              {{ authStore.error }}
            </div>

            <Button 
              class="mt-4 w-full" 
              :disabled="isSubmitting"
              type="submit"
            >
              {{ isSubmitting ? "Logging in..." : "Login" }}
            </Button>
          </Form>
        </div>
      </CardContent>
    </Card>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const router = useRouter()
const authStore = useAuthStore()

// Email validation using Zod
const validateEmail = (value: string) => {
  if (!value) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format'
  return true
}

// Password validation using Zod
const validatePassword = (value: string) => {
  if (!value) return 'Password is required'
  if (value.length < 6) return 'Password must be at least 6 characters'
  return true
}

// Use vee-validate's useForm for form handling
const { isSubmitting } = useForm({
  validationSchema: {
    email: validateEmail,
    password: validatePassword
  }
})

// Form submission handler
const onSubmit = async (values: any) => {
  const { email, password } = values
  try {
    const success = await authStore.login(email, password)
    if (success) {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}
</script> 