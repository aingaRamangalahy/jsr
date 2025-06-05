<template>
  <Sidebar v-bind="$props">
    <SidebarHeader>
      <div class="flex items-center justify-between p-4">
        <div @click="navigateTo('/')" class="flex items-center gap-2 px-2 py-1 rounded-md text-primary font-bold cursor-pointer">
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
                  <div class="flex items-center justify-center w-5 h-5 mr-2 rounded-full overflow-hidden">
                    <img v-if="category.iconUrl" :src="category.iconUrl" alt="Category Icon" class="w-full h-full object-cover" />
                    <FolderIcon v-else class="w-full h-full object-cover" />
                  </div>
                  <span>{{ category.name }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </template>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    
    <!-- Signature Footer -->
    <div class="p-4 border-t border-sidebar-border">
      <div class="text-xs text-center text-zinc-500 dark:text-zinc-400">
        crafted with ❤️ by 
        <a 
          href="https://www.ainga.me" 
          target="_blank" 
          rel="noopener noreferrer"
          class="text-primary hover:underline font-medium"
        >
          Ainga
        </a>
      </div>
    </div>
    
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