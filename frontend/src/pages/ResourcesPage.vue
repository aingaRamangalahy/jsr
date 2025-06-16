<template>
  <!-- Filter Section -->
  <div class="py-3 px-6">
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Difficulty:
        </label>
        <div class="flex gap-2">
          <Button
            v-for="difficulty in ['beginner', 'intermediate', 'advanced']"
            :key="difficulty"
            :variant="difficultyFilters[difficulty] ? 'default' : 'outline'"
            size="sm"
            class="text-xs"
            @click="handleDifficultyChange(difficulty)"
          >
            {{ difficulty.charAt(0).toUpperCase() + difficulty.slice(1) }}
          </Button>
        </div>
        <Button
          v-if="selectedDifficulties.length > 0"
          variant="ghost"
          size="sm"
          class="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 ml-2"
          @click="clearDifficultyFilter"
        >
          Clear
        </Button>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Payment:
        </label>
        <div class="flex gap-2">
          <Button
            v-for="pricing in ['free', 'paid']"
            :key="pricing"
            :variant="pricingFilters[pricing] ? 'default' : 'outline'"
            size="sm"
            class="text-xs"
            @click="handlePricingChange(pricing)"
          >
            {{ pricing.charAt(0).toUpperCase() + pricing.slice(1) }}
          </Button>
        </div>
        <Button
          v-if="selectedPricingTypes.length > 0"
          variant="ghost"
          size="sm"
          class="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 ml-2"
          @click="clearPricingFilter"
        >
          Clear
        </Button>
      </div>
    </div>
  </div>

  <!-- Resources Grid -->
  <div class="px-6 py-4">
    <!-- Initial loading -->
    <div v-if="resourceStore.loading && resourceStore.resources.length === 0" class="grid grid-cols-1 sm:grid-cols-auto-fit gap-6" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
      <ResourceCardSkeleton v-for="i in 6" :key="i" />
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

    <!-- Loading indicator for infinite scroll -->
    <div v-if="isLoadingMore" class="grid grid-cols-1 sm:grid-cols-auto-fit gap-6 mt-6" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
      <ResourceCardSkeleton v-for="i in 3" :key="i" />
    </div>

    <!-- Invisible element for intersection observer -->
    <div ref="loadMoreTrigger" class="h-1 w-full" v-if="hasMorePages"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick, onUnmounted, reactive, computed } from "vue";
import { useResourceStore } from "@/stores/resource.store";
import { useAuthStore } from "@/stores/auth.store";
import { resourceService } from "@/services/resource.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ResourceCard from "@/components/ResourceCard.vue";
import ResourceCardSkeleton from "@/components/ResourceCardSkeleton.vue";
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
const loadMoreTrigger = ref<HTMLElement | null>(null);
const isLoadingMore = ref(false);
const observer = ref<IntersectionObserver | null>(null);

// Determine if there are more pages to load
const hasMorePages = ref(false);

// Define difficulty filters
const difficultyFilters = reactive({
  beginner: false,
  intermediate: false,
  advanced: false
});

// Define pricing filters
const pricingFilters = reactive({
  free: false,
  paid: false
});

// Watch for difficulty filter changes
watch(difficultyFilters, () => {
  // Get all selected difficulty levels
  const selectedLevels = Object.entries(difficultyFilters)
    .filter(([_, isSelected]) => isSelected)
    .map(([key, _]) => key)
  
  // Update filters with array of selected difficulties
  resourceStore.updateFilters({ difficulty: selectedLevels })
}, { deep: true });

// Watch for pricing filter changes
watch(pricingFilters, () => {
  // Get all selected pricing types
  const selectedTypes = Object.entries(pricingFilters)
    .filter(([_, isSelected]) => isSelected)
    .map(([key, _]) => key) as ('free' | 'paid')[]
  
  // Update filters with array of selected pricing types
  resourceStore.updateFilters({ pricingType: selectedTypes })
}, { deep: true });

// Computed values for display
const selectedDifficulties = computed(() => 
  Object.entries(difficultyFilters)
    .filter(([_, isSelected]) => isSelected)
    .map(([key, _]) => key)
);

const selectedPricingTypes = computed(() => 
  Object.entries(pricingFilters)
    .filter(([_, isSelected]) => isSelected)
    .map(([key, _]) => key)
);

// Functions to handle filter changes
const handleDifficultyChange = (value: string) => {
  difficultyFilters[value as keyof typeof difficultyFilters] = !difficultyFilters[value as keyof typeof difficultyFilters];
};

const handlePricingChange = (value: string) => {
  pricingFilters[value as keyof typeof pricingFilters] = !pricingFilters[value as keyof typeof pricingFilters];
};

// Functions to clear filters
const clearDifficultyFilter = () => {
  Object.keys(difficultyFilters).forEach(key => {
    difficultyFilters[key as keyof typeof difficultyFilters] = false;
  });
};

const clearPricingFilter = () => {
  Object.keys(pricingFilters).forEach(key => {
    pricingFilters[key as keyof typeof pricingFilters] = false;
  });
};

// Setup intersection observer for infinite scrolling
const setupIntersectionObserver = () => {
  observer.value = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMorePages.value && !isLoadingMore.value) {
        loadMoreResources();
      }
    },
    { rootMargin: "200px" }
  );

  if (loadMoreTrigger.value) {
    observer.value.observe(loadMoreTrigger.value);
  }
};

// Load more resources when scrolling
const loadMoreResources = async () => {
  if (isLoadingMore.value || !hasMorePages.value) return;
  
  try {
    isLoadingMore.value = true;
    const nextPage = resourceStore.currentPage + 1;
    
    // Update the current page
    resourceStore.currentPage = nextPage;
    
    // Use the store's loadResources with append=true
    await resourceStore.loadResources(true);
    
    // Check if there are more pages
    hasMorePages.value = resourceStore.currentPage < resourceStore.totalPages;
  } catch (error) {
    console.error("Error loading more resources:", error);
    toast.error("Failed to load more resources");
  } finally {
    isLoadingMore.value = false;
  }
};

// Load resources on mount
onMounted(() => {
  resourceStore.loadResources();
  
  // Wait for the DOM to update before setting up the observer
  nextTick(() => {
    setupIntersectionObserver();
  });
});

// Update hasMorePages when resources are loaded
watch(
  () => resourceStore.totalPages,
  (newValue) => {
    hasMorePages.value = resourceStore.currentPage < newValue;
  },
  { immediate: true }
);

// Clean up observer on component unmount
onUnmounted(() => {
  if (observer.value && loadMoreTrigger.value) {
    observer.value.unobserve(loadMoreTrigger.value);
    observer.value.disconnect();
  }
});

// Watch for resources changes and authentication changes
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
  // Reset to first page
  resourceStore.currentPage = 1;
  resourceStore.updateFilters({ search: searchQuery.value });
  
  // Reset hasMorePages after filter change
  nextTick(() => {
    hasMorePages.value = resourceStore.currentPage < resourceStore.totalPages;
  });
};

// Handle filter changes
const handleFilterChange = (filter: string, value: string) => {
  // Reset to first page
  resourceStore.currentPage = 1;
  resourceStore.updateFilters({ [filter]: value });
  
  // Reset hasMorePages after filter change
  nextTick(() => {
    hasMorePages.value = resourceStore.currentPage < resourceStore.totalPages;
  });
};

// Set active tab
const setTab = (tab: string) => {
  selectedTab.value = tab;
  // You can add logic here to filter resources based on the selected tab
};
</script>