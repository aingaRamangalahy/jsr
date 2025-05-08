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
              <div class="relative w-full max-w-3xl ml-4">
                <Input
                  v-model="searchQuery"
                  placeholder="Search..."
                  class="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                  @keyup.enter="handleSearch"
                />
                <SearchIcon
                  class="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-500"
                />
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
              
              <!-- User Icon/Profile if logged in -->
              <button v-else class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                <UserIcon class="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </button>
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
  GithubIcon
} from "lucide-vue-next";

const router = useRouter();
const resourceStore = useResourceStore();
const authStore = useAuthStore();
const searchQuery = ref("");


// Get authentication status
const isAuthenticated = computed(() => authStore.isAuthenticated);

const handleSearch = () => {
  resourceStore.updateFilters({ search: searchQuery.value });
  if (router.currentRoute.value.path !== "/resources") {
    router.push("/resources");
  }
};
</script> 