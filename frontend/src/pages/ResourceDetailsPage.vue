<template>
  <div class="container py-8">
    <div v-if="loading" class="text-center py-8">
      Loading resource...
    </div>
    <div v-else-if="error" class="text-center py-8 text-destructive">
      {{ error }}
    </div>
    <div v-else-if="resource" class="max-w-4xl mx-auto">
      <!-- Resource Header -->
      <div class="mb-8">
        <div class="flex justify-between items-start gap-4 mb-4">
          <h1 class="text-3xl font-bold">{{ resource.name }}</h1>
          <Badge :variant="resource.pricingType">
            {{ resource.pricingType === 'free' ? 'Free' : `$${resource.price?.toFixed(2)}` }}
          </Badge>
        </div>
        <div class="flex gap-4 text-muted-foreground">
          <span>{{ typeof resource.category === 'object' ? resource.category.name : resource.category }}</span>
          <span>•</span>
          <span>{{ resource.difficulty }}</span>
        </div>
      </div>

      <Separator class="my-6" />

      <!-- Resource Details -->
      <Card class="mb-8">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-muted-foreground">{{ resource.description }}</p>
        </CardContent>
      </Card>

      <!-- Actions -->
      <div class="flex gap-4 mb-8">
        <Button @click="openResource" class="flex-1">
          Open Resource
        </Button>
        <Button 
          @click="handleBookmark" 
          variant="outline" 
          class="flex-1"
          :disabled="!authStore.isAuthenticated"
        >
          {{ isBookmarked ? 'Remove Bookmark' : 'Bookmark' }}
        </Button>
      </div>

      <!-- Voting -->
      <div class="flex gap-4 mb-8">
        <Button 
          @click="handleVote('upvote')" 
          variant="outline"
          :class="{ 'bg-primary text-primary-foreground': userVote?.value === 'up' }"
          :disabled="!authStore.isAuthenticated"
        >
          Upvote
        </Button>
        <Button 
          @click="handleVote('downvote')" 
          variant="outline"
          :class="{ 'bg-destructive text-destructive-foreground': userVote?.value === 'down' }"
          :disabled="!authStore.isAuthenticated"
        >
          Downvote
        </Button>
      </div>

      <!-- Comments Section -->
      <Card class="mb-8">
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <!-- Comment Form -->
          <div v-if="authStore.isAuthenticated" class="mb-6">
            <Textarea
              v-model="newComment"
              placeholder="Write a comment..."
              :disabled="submittingComment"
              class="mb-2"
            />
            <Button 
              @click="submitComment" 
              :disabled="submittingComment"
              class="w-full"
            >
              {{ submittingComment ? 'Posting...' : 'Post Comment' }}
            </Button>
          </div>
          <div v-else class="text-center text-muted-foreground mb-6">
            Please login to comment
          </div>

          <!-- Comments List -->
          <div v-if="comments.length > 0" class="space-y-4">
            <div v-for="comment in comments" :key="comment.id" class="flex gap-4">
              <Avatar>
                <AvatarImage :src="getUserInfo(comment.userId)?.avatar || ''" />
                <AvatarFallback>{{ getUserInfo(comment.userId)?.name?.[0] || '?' }}</AvatarFallback>
              </Avatar>
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium">{{ getUserInfo(comment.userId)?.name }}</p>
                    <p class="text-sm text-muted-foreground">{{ new Date(comment.createdAt).toLocaleDateString() }}</p>
                  </div>
                  <Button 
                    v-if="isCurrentUser(comment.userId)"
                    variant="ghost" 
                    size="sm"
                    @click="deleteComment(comment.id)"
                  >
                    Delete
                  </Button>
                </div>
                <p class="mt-2">{{ comment.content }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        </CardContent>
      </Card>

      <!-- Additional Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl class="space-y-2">
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Category</dt>
                <dd>{{ typeof resource.category === 'object' ? resource.category.name : resource.category }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Difficulty</dt>
                <dd>{{ resource.difficulty }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Type</dt>
                <dd>{{ typeof resource.type === 'object' ? resource.type.name : resource.type }}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2">
              <Badge 
                v-for="tag in resource.tags" 
                :key="tag" 
                variant="secondary"
              >
                {{ tag }}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { resourceService } from '@/services/resource.service'
import { interactionService, CommentInput, VoteInput } from '@/services/interaction.service'
import type { Resource, Comment, Category, User } from '@jsr/shared/types'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'

// Custom Vote interface to match the structure in interaction service
interface Vote {
  id: string;
  resourceId: string | Resource;
  userId: string | User;
  value: 'up' | 'down';
  createdAt: Date;
  updatedAt: Date;
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const resource = ref<Resource | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const comments = ref<Comment[]>([])
const userVote = ref<Vote | null>(null)
const isBookmarked = ref(false)
const newComment = ref('')
const submittingComment = ref(false)

const loadResource = async () => {
  try {
    loading.value = true
    error.value = null
    const { data } = await resourceService.getResourceById(route.params.id as string)
    resource.value = data
    if (authStore.isAuthenticated) {
      await Promise.all([
        loadComments(),
        loadUserInteractions()
      ])
    }
  } catch (err) {
    console.log("error", err)
    error.value = 'Failed to load resource'
    toast.error('Failed to load resource')
  } finally {
    loading.value = false
  }
}

const loadComments = async () => {
  try {
    const { status, data } = await interactionService.getResourceComments(route.params.id as string)
    if (status === 'success' && data) {
      comments.value = data
    }
  } catch (err) {
    toast.error('Failed to load comments')
  }
}

const loadUserInteractions = async () => {
  try {
    // Check if user has bookmarked this resource
    isBookmarked.value = await interactionService.hasBookmarked(route.params.id as string)
    
    // TODO: Implement getResourceVote in interaction service
    // For now, we'll leave userVote as null
  } catch (err) {
    toast.error('Failed to load user interactions')
  }
}

const openResource = () => {
  if (resource.value?.url) {
    window.open(resource.value.url, '_blank')
  }
}

const handleVote = async (voteType: 'upvote' | 'downvote') => {
  if (!authStore.isAuthenticated) {
    toast.error('Please login to vote')
    return
  }

  try {
    const voteValue: VoteInput = {
      value: voteType === 'upvote' ? 'up' : 'down'
    }
    
    // If user already voted the same way, toggle it off
    if (userVote.value?.value === voteValue.value) {
      voteValue.value = 'none'
    }
    
    const response = await interactionService.voteResource(resource.value!.id, voteValue)
    if (response.status === 'success' && response.data) {
      userVote.value = voteValue.value === 'none' ? null : response.data
    }
  } catch (err) {
    toast.error('Failed to vote')
  }
}

const handleBookmark = async () => {
  if (!authStore.isAuthenticated) {
    toast.error('Please login to bookmark resources')
    return
  }

  try {
    if (isBookmarked.value) {
      await interactionService.removeBookmark(resource.value!.id)
      isBookmarked.value = false
      toast.success('Resource removed from bookmarks')
    } else {
      await interactionService.bookmarkResource(resource.value!.id)
      isBookmarked.value = true
      toast.success('Resource bookmarked successfully')
    }
  } catch (err) {
    toast.error('Failed to bookmark resource')
  }
}

const submitComment = async () => {
  if (!authStore.isAuthenticated) {
    toast.error('Please login to comment')
    return
  }

  if (!newComment.value.trim()) {
    toast.error('Comment cannot be empty')
    return
  }

  try {
    submittingComment.value = true
    const commentInput: CommentInput = {
      content: newComment.value
    }
    
    const response = await interactionService.addComment(resource.value!.id, commentInput)
    if (response.status === 'success' && response.data) {
      await loadComments() // Reload comments to get up-to-date list with user data
      newComment.value = ''
      toast.success('Comment added successfully')
    }
  } catch (err) {
    toast.error('Failed to add comment')
  } finally {
    submittingComment.value = false
  }
}

const deleteComment = async (commentId: string) => {
  try {
    // Simulate removing comment locally since the API endpoint is not yet implemented
    comments.value = comments.value.filter(c => c.id !== commentId)
    toast.success('Comment deleted successfully')
  } catch (err) {
    toast.error('Failed to delete comment')
  }
}

// Helper function to get user info from userId
interface SimpleUser {
  id: string;
  name?: string;
  avatar?: string;
}

const getUserInfo = (userId: string | User): SimpleUser | undefined => {
  if (typeof userId === 'object') {
    return {
      id: userId.id,
      name: userId.name,
      // We don't have avatar in the User type, so we'll return undefined for it
    }
  }
  // TODO: Implement user lookup service if needed
  return {
    id: userId,
    name: 'User',
  }
}

// Helper function to check if the comment is by the current user
const isCurrentUser = (userId: string | User): boolean => {
  const commentUserId = typeof userId === 'object' ? userId.id : userId
  return commentUserId === authStore.user?.id
}

onMounted(() => {
  loadResource()
})
</script> 