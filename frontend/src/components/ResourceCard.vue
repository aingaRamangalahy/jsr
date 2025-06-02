<template>
  <Card
    class="h-full min-w-[300px] w-full relative flex flex-col transition-all hover:shadow-md group overflow-hidden pt-0"
  >
    <!-- Resource Image (if available) -->
    <div class="w-full h-40 overflow-hidden relative cursor-pointer rounded-t-lg" @click="navigateToDetail">
      <img 
        :src="props.resource.imageUrl || '/images/resource-placeholder.svg'" 
        :alt="props.resource.name" 
        class="w-full h-full object-cover object-center"
      />
      <!-- Image Overlay -->
      <div class="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300"></div>
    </div>

    <!-- Resource Type Badge (positioned top-right) -->
    <Badge
      :class="{
        'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 absolute top-2 right-2 z-5':
          props.resource.pricingType === 'free',
        'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 absolute top-2 right-2 z-5':
          props.resource.pricingType === 'paid',
      }"
    >
      {{
        props.resource.pricingType === "free"
          ? "Free"
          : formatPrice(props.resource.price || 0)
      }}
    </Badge>

    <CardHeader class="pb-0 pt-0 space-y-2 cursor-pointer" @click="navigateToDetail">
      <!-- Resource Title with Provider Icon (if available) -->
      <div class="flex items-center gap-2">
        <img 
          v-if="props.resource.providerIcon" 
          :src="props.resource.providerIcon" 
          :alt="'Provider icon'" 
          class="w-5 h-5 object-contain"
        />
        <CardTitle
          class="text-xl leading-tight font-bold group-hover:text-primary transition-colors line-clamp-2"
        >
          {{ props.resource.name }}
        </CardTitle>
      </div>
    </CardHeader>

    <!-- Resource Description -->
    <CardContent class="flex-grow py-3 cursor-pointer" @click="navigateToDetail">
      <p class="text-muted-foreground line-clamp-3">
        {{ truncateText(props.resource.description || '', 120) }}
      </p>

      <!-- Tags (similar to hashtags on daily.dev) -->
      <div class="flex flex-wrap gap-2 mt-4">
        <Badge variant="outline" class="text-xs">#{{
          getCategoryName(props.resource.category || '')
        }}</Badge>
        <Badge variant="outline" class="text-xs">#{{
          props.resource.difficulty || 'unknown'
        }}</Badge>
        <Badge variant="outline" class="text-xs">#{{
          props.resource.pricingType || 'unknown'
        }}</Badge>
      </div>
    </CardContent>

    <!-- Footer with Actions -->
    <CardFooter
      class="pt-3 border-t flex justify-between items-center space-x-1 flex-wrap sm:flex-nowrap"
      v-if="!props.resource.isPreview"
    >
      <!-- Upvote/Downvote Section -->
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          class="h-8 px-3 rounded-full flex items-center gap-1 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 hover:text-green-500 dark:hover:bg-gray-700/50 transition-colors"
          :class="{ 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 text-green-500': userVote === 'up' }"
          @click="authStore.isAuthenticated ? handleVote('up') : authState.openAuthModal()"
          :title="!authStore.isAuthenticated ? 'Sign in to vote' : ''"
        >
          <ThumbsUpIcon
            class="h-4 w-4"
            :class="{ 'text-green-500 fill-current': userVote === 'up' }"
          />
          <span class="text-sm font-medium min-w-[20px] text-center">{{ upvotesCount }}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="h-8 w-8 p-0 rounded-full hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          :class="{ 'text-red-500 bg-red-50 dark:bg-red-900/20': userVote === 'down' }"
          @click="authStore.isAuthenticated ? handleVote('down') : authState.openAuthModal()"
          :title="!authStore.isAuthenticated ? 'Sign in to vote' : ''"
        >
          <ThumbsDownIcon
            class="h-4 w-4"
            :class="{ 'text-red-500 fill-current': userVote === 'down' }"
          />
        </Button>
      </div>

      <!-- Action Buttons Group -->
      <div class="flex items-center">
        <!-- Comments Button -->
        <Button
          variant="ghost"
          size="sm"
          class="h-8 p-0 flex items-center gap-1 rounded-full mr-1"
          @click="navigateToDetail"
        >
          <MessageSquareIcon class="h-4 w-4" />
          <span class="text-xs">{{ commentsCount }}</span>
        </Button>

        <!-- Copy Link Button -->
        <Button
          variant="ghost"
          size="sm"
          class="h-8 w-8 p-0 rounded-full mr-1"
          @click="copyLink"
        >
          <LinkIcon class="h-4 w-4" />
        </Button>

        <!-- Bookmark Button -->
        <Button 
          variant="ghost" 
          size="sm" 
          class="h-8 w-8 p-0 rounded-full hover:text-primary hover:bg-primary/10"
          :class="{ 'text-primary bg-primary/10': isBookmarked }"
          @click="authStore.isAuthenticated ? toggleBookmark() : authState.openAuthModal()"
          :title="!authStore.isAuthenticated ? 'Sign in to bookmark' : ''"
        >
          <BookmarkIcon 
            class="h-4 w-4" 
            :class="{ 'fill-current': isBookmarked }"
          />
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { truncateText, formatPrice } from "@/lib/utils";
import { onMounted, ref, computed, watch } from "vue";
import { toast } from "vue-sonner";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useInteractionsStore } from "@/stores/interactions.store";
import { interactionService } from "@/services/interaction.service";
import { ResourceWithInteractions } from '@/services/resource.service';
import { useAuth } from '@/composables/useAuth';
import {
  ExternalLinkIcon,
  BookmarkIcon,
  ShareIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  MessageSquareIcon,
  LinkIcon,
} from "lucide-vue-next";
import type { Category } from "@jsr/shared/types";
import type { Resource } from "@/types";

interface Props {
  resource: (Partial<Resource> | ResourceWithInteractions) & { 
    isPreview?: boolean;
    commentCount?: number;
  };
}

const props = defineProps<Props>();
const router = useRouter();
const authStore = useAuthStore();
const interactionsStore = useInteractionsStore();
const authState = useAuth();

// Safe resource ID accessor
const resourceId = computed(() => props.resource?.id || '');

// Check if resource has embedded userInteractions data
const hasEmbeddedInteractions = computed(() => 
  resourceId.value && 'userInteractions' in props.resource && props.resource.userInteractions !== undefined
);

// Computed values with fallbacks for when store data isn't available
const votesCount = computed(() => {
  if (!resourceId.value) {
    const upvotes = props.resource.votes?.upvotes || 0;
    const downvotes = props.resource.votes?.downvotes || 0;
    return upvotes - downvotes;
  }
  
  // Check the interactions store for authenticated users
  const counts = interactionsStore.getVoteCounts(resourceId.value);
  return counts.upvotes - counts.downvotes;
});

const upvotesCount = computed(() => {
  // If user is not authenticated, get directly from resource
  if (!authStore.isAuthenticated) {
    return props.resource.votes?.upvotes || 0;
  }
  
  if (!resourceId.value) {
    return props.resource.votes?.upvotes || 0;
  }
  
  // First check the interactions store
  return interactionsStore.getVoteCounts(resourceId.value).upvotes;
});

const userVote = computed(() => {
  if (!resourceId.value) return null;
  
  // First check embedded interactions if available
  if (hasEmbeddedInteractions.value) {
    const resource = props.resource as ResourceWithInteractions;
    return resource.userInteractions?.vote?.value || null;
  }
  
  // Fall back to the interactions store
  return interactionsStore.getUserVote(resourceId.value);
});

const isBookmarked = computed(() => {
  if (!resourceId.value) return false;
  
  // First check embedded interactions if available
  if (hasEmbeddedInteractions.value) {
    const resource = props.resource as ResourceWithInteractions;
    return resource.userInteractions?.isBookmarked || false;
  }
  
  // Fall back to the interactions store
  return interactionsStore.isBookmarked(resourceId.value);
});

// Local reactive state for UI
const commentsCount = computed(() => {
  if (!resourceId.value) {
    return props.resource.commentCount || 0;
  }
  
  return props.resource.commentCount || 0;
});
const isVoting = ref(false);
const isBookmarking = ref(false);

// Helper functions
const getCategoryName = (category: string | Category): string => {
  if (!category) return 'unknown';
  if (typeof category === 'string') {
    return category;
  }
  return category.name;
};

// Handle voting
const handleVote = async (type: "up" | "down") => {
  if (!authStore.isAuthenticated) {
    toast.error("Please sign in to vote");
    return;
  }

  try {
    isVoting.value = true;
    
    if (!resourceId.value) {
      toast.error("Resource ID is required");
      return;
    }
    
    // Determine vote value - 'none' if clicking the same vote type (toggle off)
    const voteValue = userVote.value === type ? 'none' : type;
    const response = await interactionService.voteResource(resourceId.value, { value: voteValue });
    
    if (response.status === 'success' && response.data) {
      // The types from the API response are different from what the TypeScript interface expects
      // So we're using a type assertion here
      const voteData = response.data.vote;
      const votesCount = response.data.votes;
      
      // Update the interaction store
      interactionsStore.updateVote(
        resourceId.value,
        voteValue === 'none' ? null : voteData,
        votesCount
      );
      
      toast.success(voteValue === 'none' ? 'Vote removed' : 'Vote recorded');
    }
  } catch (error) {
    toast.error("Failed to register vote");
    console.error("Voting error:", error);
  } finally {
    isVoting.value = false;
  }
};

// Toggle bookmark
const toggleBookmark = async () => {
  if (!authStore.isAuthenticated) {
    toast.error("Please sign in to bookmark resources");
    return;
  }

  try {
    isBookmarking.value = true;
    
    if (!resourceId.value) {
      toast.error("Resource ID is required");
      return;
    }
    
    if (isBookmarked.value) {
      await interactionService.removeBookmark(resourceId.value);
      interactionsStore.updateBookmarkStatus(resourceId.value, false);
      toast.success("Bookmark removed");
    } else {
      await interactionService.bookmarkResource(resourceId.value);
      interactionsStore.updateBookmarkStatus(resourceId.value, true);
      toast.success("Resource bookmarked");
    }
  } catch (error) {
    toast.error("Failed to update bookmark");
    console.error("Bookmark error:", error);
  } finally {
    isBookmarking.value = false;
  }
};

const copyLink = () => {
  if (!props.resource.url) {
    toast.error("Resource URL is not available");
    return;
  }
  
  navigator.clipboard
    .writeText(props.resource.url)
    .then(() => {
      toast.success("Link copied to clipboard");
    })
    .catch(() => {
      toast.error("Failed to copy link");
    });
};

const navigateToDetail = () => {
  router.push(`/resources/${props.resource.id}`);
};

</script>

<script lang="ts">
export default {
  name: 'ResourceCard'
}
</script>
