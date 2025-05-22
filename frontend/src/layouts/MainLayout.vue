<template>
  <div class="min-h-screen flex dark:bg-zinc-950 dark:text-zinc-100 bg-white text-zinc-800">
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <!-- Top Navigation -->
        <header class="border-b border-sidebar-border py-3 px-6 bg-sidebar sticky top-0 z-10">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2 flex-1">
              <SidebarTrigger class="text-zinc-600 dark:text-zinc-400" />
              <div class="relative w-full max-w-3xl mx-4">
                <Input
                  v-model="searchQuery"
                  placeholder="Search..."
                  class="pl-9 pr-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                  @keyup.enter="handleSearch"
                />
                <SearchIcon
                  class="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-500"
                />
                <!-- Clear button -->
                <button 
                  v-if="searchQuery" 
                  class="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 focus:outline-none"
                  @click="clearSearch"
                >
                  <XIcon class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="flex items-center gap-4">
              
              <ThemeToggle />
              
              <!-- GitHub Login Button -->
              <div v-if="!isAuthenticated">
                <Button 
                  variant="outline" 
                  size="sm" 
                  class="px-3 py-1 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  @click="authStore.loginWithGitHub"
                >
                  <GithubIcon class="mr-2 h-4 w-4" />
                  Sign in
                </Button>
              </div>
              
              <!-- User Avatar and Dropdown Menu -->
              <DropdownMenu v-else>
                <DropdownMenuTrigger asChild>
                  <button class="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <img 
                      v-if="userAvatar" 
                      :src="userAvatar" 
                      :alt="userDisplayName"
                      class="h-full w-full object-cover"
                    />
                    <UserIcon 
                      v-else 
                      class="h-5 w-5 text-zinc-600 dark:text-zinc-400" 
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-56">
                  <DropdownMenuLabel>
                    <div class="flex flex-col">
                      <span>{{ userDisplayName }}</span>
                      <span class="text-xs text-muted-foreground truncate">{{ authStore.user?.email }}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="handleLogout">
                    <LogOutIcon class="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <div class="p-5 bg-gray-50 dark:bg-zinc-900 min-h-[calc(100vh-64px)]">
          <router-view />
        </div>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useResourceStore } from "@/stores/resource";
import { useAuthStore } from "@/stores/auth.store";
import ThemeToggle from "@/components/custom/ThemeToggle.vue";
import AppSidebar from "@/components/AppSidebar.vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  SidebarProvider, 
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  SearchIcon,
  UserIcon,
  GithubIcon,
  LogOutIcon,
  XIcon
} from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const router = useRouter();
const resourceStore = useResourceStore();
const authStore = useAuthStore();
const searchQuery = ref("");
let searchTimeout: any = null;

// Get authentication status and user info
const isAuthenticated = computed(() => authStore.isAuthenticated);
const userDisplayName = computed(() => authStore.userDisplayName);
const userAvatar = computed(() => authStore.userAvatar);

// Watch for changes to the search query with debouncing
watch(searchQuery, (newValue) => {
  // Clear any existing timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // Set a new timeout to debounce the search
  searchTimeout = setTimeout(() => {
    // Only trigger search if query is at least 2 characters or empty (to clear the search)
    if (newValue.length >= 2 || newValue === '') {
      doSearch();
    }
  }, 500); // 500ms debounce delay
});

// Function to clear the search
const clearSearch = () => {
  searchQuery.value = "";
  doSearch();
};

// Function to perform the actual search
const doSearch = () => {
  resourceStore.updateFilters({ search: searchQuery.value });
  
  // Navigate to resources page if not there already
  if (router.currentRoute.value.path !== "/resources") {
    router.push("/resources");
  }
};

const handleSearch = () => {
  // Clear any pending timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // Immediately perform search
  doSearch();
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/');
};
</script> 