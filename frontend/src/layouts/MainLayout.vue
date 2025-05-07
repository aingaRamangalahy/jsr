<template>
  <div class="min-h-screen flex bg-zinc-950 text-zinc-100">
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <!-- Top Navigation -->
        <header class="border-b border-zinc-800 py-3 px-6">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <SidebarTrigger />
              <div class="relative w-full max-w-2xl ml-4">
                <Input
                  v-model="searchQuery"
                  placeholder="Search..."
                  class="pl-9 bg-zinc-900 border-zinc-800"
                  @keyup.enter="handleSearch"
                />
                <SearchIcon
                  class="absolute left-3 top-2.5 h-4 w-4 text-zinc-500"
                />
              </div>
            </div>

            <div class="flex items-center gap-4">
              <ThemeToggle />
              <button class="p-2 hover:bg-zinc-800 rounded-full">
                <BellIcon class="h-5 w-5 text-zinc-400" />
              </button>
              <button class="p-2 hover:bg-zinc-800 rounded-full">
                <UserIcon class="h-5 w-5 text-zinc-400" />
              </button>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <div class="p-5">
          <router-view />
        </div>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useResourceStore } from "@/stores/resource";
import ThemeToggle from "@/components/custom/ThemeToggle.vue";
import AppSidebar from "@/components/AppSidebar.vue";
import { Input } from "@/components/ui/input";
import { 
  SidebarProvider, 
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  SearchIcon,
  UserIcon,
  BellIcon,
} from "lucide-vue-next";

const router = useRouter();
const resourceStore = useResourceStore();
const searchQuery = ref("");

const handleSearch = () => {
  resourceStore.updateFilters({ search: searchQuery.value });
  if (router.currentRoute.value.path !== "/resources") {
    router.push("/resources");
  }
};
</script> 