<template>
  <Card
    class="h-full min-w-[300px] w-full relative flex flex-col transition-all hover:shadow-md group overflow-hidden"
  >
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

    <CardHeader class="pb-0 space-y-2 cursor-pointer" @click="navigateToDetail">
      <!-- Resource Title -->
      <CardTitle
        class="text-xl leading-tight font-bold group-hover:text-primary transition-colors line-clamp-2"
      >
        {{ props.resource.name }}
      </CardTitle>
    </CardHeader>

    <!-- Resource Description -->
    <CardContent class="flex-grow py-3 cursor-pointer" @click="navigateToDetail">
      <p class="text-muted-foreground line-clamp-3">
        {{ truncateText(props.resource.description, 120) }}
      </p>

      <!-- Tags (similar to hashtags on daily.dev) -->
      <div class="flex flex-wrap gap-2 mt-4">
        <Badge variant="outline" class="text-xs">#{{
          getCategoryName(props.resource.category)
        }}</Badge>
        <Badge variant="outline" class="text-xs">#{{
          props.resource.difficulty
        }}</Badge>
        <Badge variant="outline" class="text-xs">#{{
          props.resource.pricingType
        }}</Badge>
      </div>
    </CardContent>

    <!-- Footer with Actions -->
    <CardFooter
      class="pt-3 border-t flex justify-between items-center space-x-1 flex-wrap sm:flex-nowrap"
    >
      <!-- Upvote/Downvote Section -->
      <div class="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          class="h-8 w-8 p-0 rounded-full hover:text-green-500"
          @click="handleVote('up')"
          :disabled="isVoting"
        >
          <ThumbsUpIcon
            class="h-4 w-4"
            :class="{ 'text-green-500 fill-current': userVote === 'up' }"
          />
          <span class="sr-only">Upvote</span>
        </Button>
        <span class="text-sm font-medium">{{ votesCount }}</span>
        <Button
          variant="ghost"
          size="sm"
          class="h-8 w-8 p-0 rounded-full hover:text-red-500"
          @click="handleVote('down')"
          :disabled="isVoting"
        >
          <ThumbsDownIcon
            class="h-4 w-4"
            :class="{ 'text-red-500 fill-current': userVote === 'down' }"
          />
          <span class="sr-only">Downvote</span>
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
          <span class="sr-only">Comments</span>
        </Button>

        <!-- Copy Link Button -->
        <Button
          variant="ghost"
          size="sm"
          class="h-8 w-8 p-0 rounded-full mr-1"
          @click="copyLink"
        >
          <LinkIcon class="h-4 w-4" />
          <span class="sr-only">Copy Link</span>
        </Button>

        <!-- Bookmark Button -->
        <Button 
          variant="ghost" 
          size="sm" 
          class="h-8 w-8 p-0 rounded-full"
          @click="toggleBookmark"
          :disabled="isBookmarking"
        >
          <BookmarkIcon 
            class="h-4 w-4" 
            :class="{ 'fill-current': isBookmarked }"
          />
          <span class="sr-only">Bookmark</span>
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
import { onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { interactionService, ResourceWithInteractions } from "@/services/interaction.service";
import {
  ExternalLinkIcon,
  BookmarkIcon,
  ShareIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  MessageSquareIcon,
  LinkIcon,
} from "lucide-vue-next";
import { Resource, Category } from "@jsr/shared/types";

interface Props {
  resource: Resource | ResourceWithInteractions;
}

const props = defineProps<Props>();
const router = useRouter();
const authStore = useAuthStore();

// State
const votesCount = ref(props.resource.votes?.upvotes || 0);
const commentsCount = ref((props.resource as ResourceWithInteractions).commentsCount || 0);
const userVote = ref((props.resource as ResourceWithInteractions).userVote || null);
const isBookmarked = ref((props.resource as ResourceWithInteractions).isBookmarked || false);
const isVoting = ref(false);
const isBookmarking = ref(false);

// Helper functions
const getCategoryName = (category: string | Category): string => {
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
    
    // If user is clicking the same vote type they already selected, it's a vote removal
    if (userVote.value === type) {
      // Handle vote removal logic
      await interactionService.voteResource(props.resource.id, { value: 'none' });
      
      // Update local state - adjust vote count and clear user vote
      if (type === 'up') {
        votesCount.value--;
      } else {
        votesCount.value++;
      }
      
      userVote.value = null;
    } else {
      // Handle new vote or vote change
      await interactionService.voteResource(props.resource.id, { value: type });
      
      // Update local state
      if (type === 'up') {
        // If changing from downvote to upvote, add 2 (+1 removing downvote, +1 adding upvote)
        votesCount.value += userVote.value === 'down' ? 2 : 1;
      } else {
        // If changing from upvote to downvote, subtract 2 (-1 removing upvote, -1 adding downvote)
        votesCount.value -= userVote.value === 'up' ? 2 : 1;
      }
      
      userVote.value = type;
    }
    
    toast.success(`Vote ${userVote.value ? 'updated' : 'removed'}`);
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
    
    if (isBookmarked.value) {
      await interactionService.removeBookmark(props.resource.id);
      isBookmarked.value = false;
      toast.success("Bookmark removed");
    } else {
      await interactionService.bookmarkResource(props.resource.id);
      isBookmarked.value = true;
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

// Check bookmark status
const checkBookmarkStatus = async () => {
  if (!authStore.isAuthenticated) return;
  
  try {
    isBookmarked.value = await interactionService.hasBookmarked(props.resource.id);
  } catch (error) {
    console.error("Error checking bookmark status:", error);
  }
};

onMounted(async () => {
  await checkBookmarkStatus();
});

// Add explicit default export
defineOptions({
  name: 'ResourceCard'
});
</script>
