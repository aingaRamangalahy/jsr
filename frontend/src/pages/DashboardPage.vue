<template>
  <div class="container mx-auto p-4 space-y-8">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Your Dashboard</h1>
        <p class="text-muted-foreground">Manage your resources and activity</p>
      </div>
      <div v-if="user" class="flex items-center space-x-3">
        <img 
          :src="userAvatar" 
          alt="User avatar" 
          class="w-10 h-10 rounded-full"
          v-if="userAvatar"
        />
        <div>
          <p class="font-medium">{{ userDisplayName }}</p>
          <p class="text-sm text-muted-foreground">{{ user.email }}</p>
        </div>
      </div>
    </div>

    <!-- Dashboard Tabs -->
    <Tabs v-model="activeTab" default-value="bookmarks" class="w-full">
      <TabsList class="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="bookmarks" class="py-3 text-base">Bookmarked Resources</TabsTrigger>
        <TabsTrigger value="submitted" class="py-3 text-base">Submitted Resources</TabsTrigger>
      </TabsList>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-md bg-red-50 p-4 my-8">
        <div class="flex">
          <div class="flex-shrink-0">
            <!-- Error icon -->
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error loading data</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bookmarks Tab Content -->
      <TabsContent value="bookmarks" class="space-y-6 w-full">
        <!-- Pricing Filters -->
        <div class="flex items-center space-x-4 bg-card p-4 rounded-lg border shadow-sm">
          <span class="text-sm font-medium">Filter:</span>
          <Button 
            @click="pricingFilter = 'all'"
            :variant="pricingFilter === 'all' ? 'default' : 'outline'"
            size="sm"
          >
            All
          </Button>
          <Button 
            @click="pricingFilter = 'free'"
            :variant="pricingFilter === 'free' ? 'default' : 'outline'"
            size="sm"
          >
            Free
          </Button>
          <Button 
            @click="pricingFilter = 'paid'"
            :variant="pricingFilter === 'paid' ? 'default' : 'outline'"
            size="sm"
          >
            Paid
          </Button>
        </div>

        <!-- Bookmarked Resources Grid -->
        <div v-if="filteredBookmarks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ResourceCard 
            v-for="bookmark in filteredBookmarks" 
            :key="bookmark.id" 
            :resource="getResourceFromBookmark(bookmark)"
          />
        </div>
        
        <!-- Empty Bookmarks State -->
        <div v-else class="text-center py-16 bg-muted/50 rounded-lg">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium">No bookmarks found</h3>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ 
              pricingFilter === 'all' 
                ? 'You haven\'t bookmarked any resources yet.' 
                : `You haven't bookmarked any ${pricingFilter} resources yet.`
            }}
          </p>
          <div class="mt-6">
            <Button asChild>
              <router-link to="/resources">Browse Resources</router-link>
            </Button>
          </div>
        </div>
      </TabsContent>

      <!-- Submitted Resources Tab Content -->
      <TabsContent value="submitted" class="space-y-6 w-full">
        <!-- Status Filters -->
        <div class="flex items-center space-x-4 bg-card p-4 rounded-lg border shadow-sm">
          <span class="text-sm font-medium">Filter:</span>
          <Button 
            @click="statusFilter = 'all'"
            :variant="statusFilter === 'all' ? 'default' : 'outline'"
            size="sm"
          >
            All
          </Button>
          <Button 
            @click="statusFilter = 'pending'"
            :variant="statusFilter === 'pending' ? 'default' : 'outline'"
            size="sm"
            class="bg-yellow-500 hover:bg-yellow-600"
          >
            Pending
          </Button>
          <Button 
            @click="statusFilter = 'approved'"
            :variant="statusFilter === 'approved' ? 'default' : 'outline'"
            size="sm"
            class="bg-green-500 hover:bg-green-600"
          >
            Approved
          </Button>
          <Button 
            @click="statusFilter = 'rejected'"
            :variant="statusFilter === 'rejected' ? 'default' : 'outline'"
            size="sm"
            class="bg-red-500 hover:bg-red-600"
          >
            Rejected
          </Button>
        </div>

        <!-- Submitted Resources Grid -->
        <div v-if="filteredSubmissions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="resource in filteredSubmissions" :key="resource.id" class="relative">
            <div 
              class="absolute top-2 right-2 z-10 px-2 py-1 text-xs font-medium rounded-full"
              :class="{
                'bg-yellow-100 text-yellow-800': resource.status === 'pending',
                'bg-green-100 text-green-800': resource.status === 'approved',
                'bg-red-100 text-red-800': resource.status === 'rejected'
              }"
            >
              {{ resource.status }}
            </div>
            <ResourceCard :resource="resource" />
          </div>
        </div>
        
        <!-- Empty Submissions State -->
        <div v-else class="text-center py-16 bg-muted/50 rounded-lg">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium">No resources found</h3>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ 
              statusFilter === 'all' 
                ? 'You haven\'t submitted any resources yet.' 
                : `You don't have any ${statusFilter} resources.`
            }}
          </p>
          <div class="mt-6">
            <Button asChild>
              <router-link to="/submit">Submit New Resource</router-link>
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { interactionService } from '@/services/interaction.service';
import { ResourceStatus, PricingType, Resource, Bookmark } from '@jsr/shared/types';
import { toast } from 'vue-sonner';
import { resourceService } from '@/services/resource.service';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ResourceCard from '@/components/ResourceCard.vue';

// Auth store for user info
const authStore = useAuthStore();
const user = computed(() => authStore.user);
const userDisplayName = computed(() => authStore.userDisplayName);
const userAvatar = computed(() => authStore.userAvatar);

// State
const loading = ref(true);
const error = ref<string | null>(null);
const activeTab = ref<string>('bookmarks');
const pricingFilter = ref<'all' | PricingType>('all');
const statusFilter = ref<'all' | ResourceStatus>('all');

// Data
const bookmarks = ref<Bookmark[]>([]);
const submittedResources = ref<Resource[]>([]);

// Helper method to extract resource from bookmark
const getResourceFromBookmark = (bookmark: Bookmark): Resource => {
  return bookmark.resourceId as Resource;
};

// Computed
const filteredBookmarks = computed(() => {
  if (pricingFilter.value === 'all') {
    return bookmarks.value;
  }
  
  return bookmarks.value.filter((bookmark) => {
    const resource = getResourceFromBookmark(bookmark);
    return resource.pricingType === pricingFilter.value;
  });
});

const filteredSubmissions = computed(() => {
  if (statusFilter.value === 'all') {
    return submittedResources.value;
  }
  
  return submittedResources.value.filter(
    (resource) => resource.status === statusFilter.value
  );
});

// Methods
const fetchBookmarks = async () => {
  try {
    const response = await interactionService.getUserBookmarks();
    if (response.status === 'success' && response.data) {
      bookmarks.value = response.data;
    }
  } catch (err: any) {
    console.error('Error fetching bookmarks:', err);
    toast.error('Failed to load bookmarks');
    error.value = err.message || 'Failed to load bookmarks';
  }
};

const fetchSubmittedResources = async () => {
  try {
    const response = await resourceService.getSubmittedResources(statusFilter.value === 'all' ? undefined : statusFilter.value);
    if (response.status === 'success' && response.data) {
      submittedResources.value = response.data;
    }
  } catch (err: any) {
    console.error('Error fetching submitted resources:', err);
    toast.error('Failed to load your submitted resources');
    error.value = err.message || 'Failed to load your submitted resources';
  }
};

const fetchDashboardData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    await Promise.all([
      fetchBookmarks(),
      fetchSubmittedResources()
    ]);
  } catch (err: any) {
    console.error('Error fetching dashboard data:', err);
    error.value = err.message || 'Failed to load dashboard data';
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await fetchDashboardData();
  }
});
</script>