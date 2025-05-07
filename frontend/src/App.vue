<template>
  <div class="min-h-screen bg-background">
    <TooltipProvider>
      <MainLayout>
        <RouterView />
      </MainLayout>
    </TooltipProvider>
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from 'reka-ui'
import MainLayout from '@/layouts/MainLayout.vue'
</script> 