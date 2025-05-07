<template>
  <div class="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all duration-200 flex flex-col h-full">
    <!-- Card Header with Author Info -->
    <div class="flex items-center p-3 border-b border-zinc-800">
      <div class="flex items-center">
        <div class="w-6 h-6 rounded-full bg-zinc-700 overflow-hidden mr-2">
          <div class="flex items-center justify-center w-full h-full text-xs text-zinc-300">
            {{ getAuthorInitial() }}
          </div>
        </div>
        <div class="text-sm">
          <span class="text-zinc-300">{{ getAuthorName() }}</span>
        </div>
      </div>
      <div class="ml-auto flex items-center">
        <Badge :variant="resource.pricingType === 'free' ? 'outline' : 'default'" class="ml-2">
          {{ formatPrice(resource.price) }}
        </Badge>
      </div>
    </div>
    
    <!-- Card Content -->
    <div class="flex-1 p-4">
      <div class="flex flex-col h-full">
        <h3 class="text-base font-medium text-zinc-100 mb-2 line-clamp-2">{{ resource.name }}</h3>
        <p class="text-sm text-zinc-400 mb-3 line-clamp-3 flex-1">
          {{ resource.description }}
        </p>
        
        <!-- Tags -->
        <div class="mt-auto flex flex-wrap gap-2">
          <Badge variant="secondary" class="text-xs" v-if="resource.category">
            #{{ getCategoryName() }}
          </Badge>
          <Badge variant="secondary" class="text-xs" v-if="resource.difficulty">
            #{{ resource.difficulty }}
          </Badge>
          <Badge variant="secondary" class="text-xs" v-for="tag in resource.tags?.slice(0, 3)" :key="tag">
            #{{ tag }}
          </Badge>
        </div>
      </div>
    </div>
    
    <!-- Card Footer -->
    <div class="border-t border-zinc-800 p-3 flex items-center justify-between bg-zinc-900">
      <div class="flex items-center gap-4">
        <button class="text-zinc-400 hover:text-zinc-100 transition-colors" title="Upvote">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <span class="text-sm text-zinc-400">{{ resource.votes?.upvotes || 0 }}</span>
        <button class="text-zinc-400 hover:text-zinc-100 transition-colors" title="Comment">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </button>
      </div>
      <div>
        <Button variant="ghost" size="sm" @click="openResource" class="text-xs">
          Open
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Resource, User, Category } from '@jsr/shared/types'

interface Props {
  resource: Resource
}

const props = defineProps<Props>()

const formatPrice = (price?: number) => {
  if (!price) return 'Free'
  return `$${price.toFixed(2)}`
}

const openResource = () => {
  window.open(props.resource.url, '_blank')
}

const getAuthorInitial = () => {
  if (typeof props.resource.createdBy === 'string') {
    return 'U'
  } else {
    return (props.resource.createdBy as User)?.name?.[0] || 'U'
  }
}

const getAuthorName = () => {
  if (typeof props.resource.createdBy === 'string') {
    return 'User'
  } else {
    return (props.resource.createdBy as User)?.name || 'Unknown'
  }
}

const getCategoryName = () => {
  if (typeof props.resource.category === 'string') {
    return props.resource.category
  } else {
    return (props.resource.category as Category)?.name || 'Uncategorized'
  }
}
</script> 