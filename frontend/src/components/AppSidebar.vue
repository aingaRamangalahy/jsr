<template>
  <Sidebar v-bind="$props">
    <SidebarHeader>
      <div class="flex items-center justify-between p-4">
        <div @click="navigateTo('/')" class="flex items-center gap-2 px-2 py-1 rounded-md bg-primary/10 text-primary font-bold cursor-pointer">
          <span class="text-xl">~/</span>
          <span class="text-2xl tracking-tight">js resources</span>
        </div>
      </div>
    </SidebarHeader>
    
    <SidebarContent>
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
                  <ListIcon class="w-5 h-5 mr-2" />
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
              <CheckboxRoot 
                id="beginner" 
                class="peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                v-model:checked="difficultyFilters.beginner" 
                @update:checked="updateDifficultyFilters('beginner', $event)"
              >
                <CheckboxIndicator class="flex items-center justify-center text-current">
                  <Check class="size-3.5" />
                </CheckboxIndicator>
              </CheckboxRoot>
              <label for="beginner" class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                Beginner
              </label>
            </div>
            
            <div class="flex items-center space-x-2">
              <CheckboxRoot 
                id="intermediate" 
                class="peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                v-model:checked="difficultyFilters.intermediate" 
                @update:checked="updateDifficultyFilters('intermediate', $event)"
              >
                <CheckboxIndicator class="flex items-center justify-center text-current">
                  <Check class="size-3.5" />
                </CheckboxIndicator>
              </CheckboxRoot>
              <label for="intermediate" class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                Intermediate
              </label>
            </div>
            
            <div class="flex items-center space-x-2">
              <CheckboxRoot 
                id="advanced" 
                class="peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                v-model:checked="difficultyFilters.advanced" 
                @update:checked="updateDifficultyFilters('advanced', $event)"
              >
                <CheckboxIndicator class="flex items-center justify-center text-current">
                  <Check class="size-3.5" />
                </CheckboxIndicator>
              </CheckboxRoot>
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
              <CheckboxRoot 
                id="free" 
                class="peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                v-model:checked="pricingFilters.free" 
                @update:checked="updatePricingFilters('free', $event)"
              >
                <CheckboxIndicator class="flex items-center justify-center text-current">
                  <Check class="size-3.5" />
                </CheckboxIndicator>
              </CheckboxRoot>
              <label for="free" class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                Free
              </label>
            </div>
            
            <div class="flex items-center space-x-2">
              <CheckboxRoot 
                id="paid" 
                class="peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                v-model:checked="pricingFilters.paid" 
                @update:checked="updatePricingFilters('paid', $event)"
              >
                <CheckboxIndicator class="flex items-center justify-center text-current">
                  <Check class="size-3.5" />
                </CheckboxIndicator>
              </CheckboxRoot>
              <label for="paid" class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                Paid
              </label>
            </div>
          </div>
        </SidebarMenu>
      </SidebarGroup>

      <!-- Actions Section -->
      <SidebarGroup>
        <SidebarGroupLabel>Actions</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              as-child
              :is-active="router.currentRoute.value.path === '/bookmarks'"
            >
              <a href="#" @click.prevent="navigateTo('/bookmarks')" class="flex items-center">
                <BookmarkIcon class="w-5 h-5 mr-2" />
                <span>Bookmarks</span>
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
    </SidebarContent>
    
    <SidebarRail />
  </Sidebar>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useResourceStore } from "@/stores/resource"
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
import { CheckboxRoot, CheckboxIndicator, type CheckboxRootProps } from 'reka-ui'
import { Check } from 'lucide-vue-next'
import {
  BookmarkIcon,
  PlusIcon,
  ListIcon,
  FolderIcon,
} from "lucide-vue-next"

const router = useRouter()
const resourceStore = useResourceStore()

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

// Update difficulty filters
const updateDifficultyFilters = (level: string, checked: boolean) => {
  // If filter is checked, apply it, otherwise clear it
  const difficulty = checked ? level : ''
  
  // Only update if there's a single filter checked
  if (checked) {
    Object.keys(difficultyFilters).forEach(key => {
      if (key !== level) difficultyFilters[key as keyof typeof difficultyFilters] = false
    })
    resourceStore.updateFilters({ difficulty })
  } else {
    // If no filters are checked, clear the difficulty filter
    const anyChecked = Object.values(difficultyFilters).some(value => value)
    if (!anyChecked) {
      resourceStore.updateFilters({ difficulty: '' })
    }
  }
}

// Update pricing filters
const updatePricingFilters = (type: string, checked: boolean) => {
  // If filter is checked, apply it, otherwise clear it
  const pricingType = checked ? (type as '' | 'free' | 'paid') : ''
  
  // Only update if there's a single filter checked
  if (checked) {
    Object.keys(pricingFilters).forEach(key => {
      if (key !== type) pricingFilters[key as keyof typeof pricingFilters] = false
    })
    resourceStore.updateFilters({ pricingType })
  } else {
    // If no filters are checked, clear the pricing filter
    const anyChecked = Object.values(pricingFilters).some(value => value)
    if (!anyChecked) {
      resourceStore.updateFilters({ pricingType: '' })
    }
  }
}

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<script lang="ts">
export default {}
</script> 