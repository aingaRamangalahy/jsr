<template>
  <div class="p-6 space-y-4">
    <h2 class="text-2xl font-bold">Button Component Test</h2>
    
    <div class="space-y-2">
      <h3 class="text-lg font-medium">Default Variants</h3>
      <div class="flex flex-wrap gap-4">
        <Button>Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
    
    <div class="space-y-2">
      <h3 class="text-lg font-medium">Size Variants</h3>
      <div class="flex flex-wrap items-center gap-4">
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">
          <span class="transform scale-75">+</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script> 