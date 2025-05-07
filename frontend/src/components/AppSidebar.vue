<template>
  <Sidebar v-bind="$props">
    <SidebarHeader>
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center gap-2 px-2 py-1 rounded-md bg-primary/10 text-primary font-bold">
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
                <a href="#" @click.prevent="filterByCategory('all')">All resources</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem v-for="category in categories" :key="category.id">
              <SidebarMenuButton 
                as-child
                :is-active="currentCategory === category.id"
              >
                <a href="#" @click.prevent="filterByCategory(category.id)">{{ category.name }}</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </template>
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
import { ref, onMounted } from 'vue'
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
import {
  BookmarkIcon,
  PlusIcon,
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

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<script lang="ts">
export default {}
</script> 