<template>
  <Sidebar v-bind="$props">
    <SidebarHeader>
      <div class="flex items-center justify-between p-4">
        <div @click="navigateTo('/')" class="flex items-center gap-2 px-2 py-1 rounded-md bg-primary/10 text-primary font-bold cursor-pointer">
          <img src="/images/logo.svg" alt="jsresources icon" class="w-6 h-6" />
          <span class="text-xl tracking-tight">jsresources<span class="text-sm opacity-70">.dev</span></span>
        </div>
      </div>
    </SidebarHeader>
    
    <SidebarContent>
            <!-- Actions Section -->
            <SidebarGroup>
        <SidebarGroupLabel>Actions</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem v-if="authStore.isAuthenticated">
            <SidebarMenuButton
              as-child
              :is-active="router.currentRoute.value.path === '/dashboard'"
            >
              <a href="#" @click.prevent="navigateTo('/dashboard')" class="flex items-center">
                <HomeIcon class="w-5 h-5 mr-2" />
                <span>Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              as-child
              :is-active="router.currentRoute.value.path === '/submit'"
            >
              <a href="#" @click.prevent="navigateTo('/submit')" class="flex items-center">
                <PlusIcon class="w-5 h-5 mr-2" />
                <span>Submit Resource</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <!-- Categories Section -->
      <SidebarGroup>
        <SidebarGroupLabel>Categories</SidebarGroupLabel>
        <SidebarMenu>
          <div v-if="loading" class="px-3 py-2 text-zinc-500">
            <div class="flex items-center">
              <div class="animate-spin mr-2">↻</div>
              Loading...
            </div>
          </div>

          <div v-else-if="error" class="px-3 py-2 text-destructive">
            {{ error }}
          </div>

          <template v-else>
            <SidebarMenuItem>
              <SidebarMenuButton 
                as-child
                :is-active="currentCategory === 'all'"
              >
                <a href="#" @click.prevent="filterByCategory('all')">
                  <FolderIcon class="w-5 h-5 mr-2" />
                  <span>All resources</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem v-for="category in categories" :key="category.id">
              <SidebarMenuButton 
                as-child
                :is-active="currentCategory === category.id"
              >
                <a href="#" @click.prevent="filterByCategory(category.id)">
                  <FolderIcon class="w-5 h-5 mr-2" />
                  <span>{{ category.name }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </template>
        </SidebarMenu>
      </SidebarGroup>

      <!-- Difficulty Level Filters -->
      <SidebarGroup>
        <SidebarGroupLabel>Difficulty</SidebarGroupLabel>
        <SidebarMenu>
          <div class="px-3 py-2 space-y-4">
            <div class="flex items-center space-x-2">
              <Checkbox 
                id="beginner" 
                v-model="difficultyFilters.beginner"
              />
              <label for="beginner" class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                Beginner
              </label>
            </div>
            
            <div class="flex items-center space-x-2">
              <Checkbox 
                id="intermediate" 
                v-model="difficultyFilters.intermediate"
              />
              <label for="intermediate" class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                Intermediate
              </label>
            </div>
            
            <div class="flex items-center space-x-2">
              <Checkbox 
                id="advanced" 
                v-model="difficultyFilters.advanced"
              />
              <label for="advanced" class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                Advanced
              </label>
            </div>
          </div>
        </SidebarMenu>
      </SidebarGroup>

      <!-- Payment Type Filters -->
      <SidebarGroup>
        <SidebarGroupLabel>Payment Type</SidebarGroupLabel>
        <SidebarMenu>
          <div class="px-3 py-2 space-y-4">
            <div class="flex items-center space-x-2">
              <Checkbox 
                id="free" 
                v-model="pricingFilters.free"
              />
              <label for="free" class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                Free
              </label>
            </div>
            
            <div class="flex items-center space-x-2">
              <Checkbox 
                id="paid" 
                v-model="pricingFilters.paid"
              />
              <label for="paid" class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                Paid
              </label>
            </div>
          </div>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    
    <SidebarRail />
  </Sidebar>
</template>

<script lang="ts">
// Add default export to make the component importable
export default {
  name: 'AppSidebar'
}
</script>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useResourceStore } from "@/stores/resource.store"
import { useAuthStore } from "@/stores/auth.store"
import { categoryService } from "@/services/category.service"
import type { Category } from "@jsr/shared/types"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  type SidebarProps
} from '@/components/ui/sidebar'
import { Checkbox } from '@/components/ui/checkbox'
import { Check } from 'lucide-vue-next'
import {
  BookmarkIcon,
  PlusIcon,
  ListIcon,
  FolderIcon,
  HomeIcon,
} from "lucide-vue-next"

const router = useRouter()
const resourceStore = useResourceStore()
const authStore = useAuthStore()

// We use SidebarProps directly from the component library
defineProps<SidebarProps>()

// Categories state
const categories = ref<Category[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentCategory = ref('all')

// Define difficulty filters
const difficultyFilters = reactive({
  beginner: false,
  intermediate: false,
  advanced: false
})

// Define pricing filters
const pricingFilters = reactive({
  free: false,
  paid: false
})

// Fetch categories on mount
onMounted(async () => {
  await fetchCategories()
})

// Fetch categories from API
const fetchCategories = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await categoryService.getCategories()
    if (response.status === "success" && response.data) {
      categories.value = response.data
    } else {
      error.value = response.error?.message || "Failed to load categories"
    }
  } catch (err) {
    console.error("Error fetching categories:", err)
    error.value = "Failed to load categories"
  } finally {
    loading.value = false
  }
}

// Filter resources by category
const filterByCategory = (categoryId: string) => {
  currentCategory.value = categoryId
  resourceStore.updateFilters({ category: categoryId })
  if (router.currentRoute.value.path !== "/resources") {
    router.push("/resources")
  }
}

// Watch for difficulty filter changes
watch(difficultyFilters, () => {
  // Get all selected difficulty levels
  const selectedLevels = Object.entries(difficultyFilters)
    .filter(([_, isSelected]) => isSelected)
    .map(([key, _]) => key)
  
  // Update filters with array of selected difficulties
  resourceStore.updateFilters({ difficulty: selectedLevels })
}, { deep: true })

// Watch for pricing filter changes
watch(pricingFilters, () => {
  // Get all selected pricing types
  const selectedTypes = Object.entries(pricingFilters)
    .filter(([_, isSelected]) => isSelected)
    .map(([key, _]) => key) as ('free' | 'paid')[]
  
  // Update filters with array of selected pricing types
  resourceStore.updateFilters({ pricingType: selectedTypes })
}, { deep: true })

const navigateTo = (path: string) => {
  router.push(path)
}
</script>