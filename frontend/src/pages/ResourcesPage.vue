<template>
  <!-- Resources Grid -->
  <div class="px-6 py-4">
    <div v-if="resourceStore.loading" class="text-center py-8">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      ></div>
    </div>

    <div
      v-else-if="resourceStore.error"
      class="text-center py-8 text-destructive"
    >
      {{ resourceStore.error }}
    </div>

    <div
      v-else-if="resourceStore.resources.length === 0"
      class="text-center py-8 text-muted-foreground"
    >
      No resources found matching your criteria.
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-auto-fit gap-6"
      style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));"
    >
      <ResourceCard
        v-for="resource in resourceStore.resources"
        :key="resource.id"
        :resource="resource"
      />
    </div>

    <!-- Pagination -->
    <div
      v-if="resourceStore.totalPages > 1"
      class="mt-8 flex justify-center gap-2"
    >
      <Button
        v-for="page in resourceStore.totalPages"
        :key="page"
        :variant="page === resourceStore.currentPage ? 'default' : 'outline'"
        size="sm"
        @click="handlePageChange(page)"
      >
        {{ page }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useResourceStore } from "@/stores/resource";
import { useAuthStore } from "@/stores/auth.store";
import { resourceService } from "@/services/resource.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ResourceCard from "@/components/ResourceCard.vue";
import { toast } from "vue-sonner";
import { useInteractionsStore } from '@/stores/interactions.store';
import {
  FilterIcon,
  StarIcon,
  TrendingUpIcon,
  SettingsIcon,
  ClockIcon,
  FlameIcon,
} from "lucide-vue-next";

const resourceStore = useResourceStore();
const authStore = useAuthStore();
const interactionsStore = useInteractionsStore();
const searchQuery = ref("");
const selectedTab = ref("feed");

// Load resources on mount - interactions will be embedded if user is authenticated
onMounted(() => {
  resourceStore.loadResources();
});

// Single watcher for both resource changes and authentication changes
watch(
  [() => resourceStore.resources, () => authStore.isAuthenticated],
  ([newResources, isAuthenticated]) => {
    if (isAuthenticated && newResources.length > 0) {
      // Get resources that need interaction data
      const resourcesNeedingInteractions = newResources.filter(
        resource => resource.id && !resource.userInteractions
      );
      
      // Only fetch interactions for resources that don't have them embedded
      if (resourcesNeedingInteractions.length > 0) {
        console.log(`Fetching interactions for ${resourcesNeedingInteractions.length} resources`);
        const resourceIds = resourcesNeedingInteractions
          .map(resource => resource.id)
          .filter(Boolean);
          
        if (resourceIds.length > 0) {
          interactionsStore.fetchResourceInteractions(resourceIds);
        }
      }
    }
  },
  { deep: true, immediate: true }
);

// Handle search
const handleSearch = () => {
  resourceStore.updateFilters({ search: searchQuery.value });
};

// Handle filter changes
const handleFilterChange = (filter: string, value: string) => {
  resourceStore.updateFilters({ [filter]: value });
};

// Handle page change
const handlePageChange = (page: number) => {
  resourceStore.changePage(page);
};

// Set active tab
const setTab = (tab: string) => {
  selectedTab.value = tab;
  // You can add logic here to filter resources based on the selected tab
};
</script>