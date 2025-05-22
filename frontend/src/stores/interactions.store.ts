import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { interactionService, ResourceInteractions } from '@/services/interaction.service';
import { useAuthStore } from './auth.store';
import type { Vote } from '@jsr/shared/types';

export const useInteractionsStore = defineStore('interactions', () => {
  // State
  const interactionsMap = ref<ResourceInteractions>({});
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const authStore = useAuthStore();
  
  // Get interaction for a single resource
  const getResourceInteraction = (resourceId: string) => {
    return interactionsMap.value[resourceId] || null;
  };
  
  // Get user vote for a resource
  const getUserVote = (resourceId: string) => {
    const interaction = getResourceInteraction(resourceId);
    return interaction?.vote?.value || null;
  };
  
  // Get bookmark status for a resource
  const isBookmarked = (resourceId: string) => {
    const interaction = getResourceInteraction(resourceId);
    return interaction?.isBookmarked || false;
  };
  
  // Get vote counts for a resource
  const getVoteCounts = (resourceId: string) => {
    const interaction = getResourceInteraction(resourceId);
    return interaction?.votes || { upvotes: 0, downvotes: 0 };
  };
  
  // Fetch interactions for multiple resources
  const fetchResourceInteractions = async (resourceIds: string[]) => {
    if (!authStore.isAuthenticated || resourceIds.length === 0) return;
    
    // Filter out resource IDs that we already have interaction data for
    const missingResourceIds = resourceIds.filter(id => 
      !interactionsMap.value[id] && id && typeof id === 'string'
    );
    
    // Skip API call if we already have all the required interaction data
    if (missingResourceIds.length === 0) return;
    
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await interactionService.getResourcesInteractions(missingResourceIds);
      
      if (response.status === 'success' && response.data) {
        // Merge new data with existing data
        interactionsMap.value = { 
          ...interactionsMap.value,
          ...response.data 
        };
      }
    } catch (err) {
      console.error('Failed to fetch resource interactions:', err);
      error.value = 'Failed to load resource interactions';
    } finally {
      isLoading.value = false;
    }
  };
  
  // Update vote locally after voting
  const updateVote = (resourceId: string, vote: Vote | null, votes: { upvotes: number, downvotes: number }) => {
    if (!interactionsMap.value[resourceId]) {
      interactionsMap.value[resourceId] = {
        vote: vote,
        isBookmarked: false,
        votes: votes
      };
    } else {
      interactionsMap.value[resourceId].vote = vote;
      interactionsMap.value[resourceId].votes = votes;
    }
  };
  
  // Update bookmark status locally after bookmarking/unbookmarking
  const updateBookmarkStatus = (resourceId: string, status: boolean) => {
    if (!interactionsMap.value[resourceId]) {
      interactionsMap.value[resourceId] = {
        vote: null,
        isBookmarked: status,
        votes: { upvotes: 0, downvotes: 0 }
      };
    } else {
      interactionsMap.value[resourceId].isBookmarked = status;
    }
  };
  
  // Update multiple resource interactions at once
  const updateInteractionsMap = (newInteractions: ResourceInteractions) => {
    interactionsMap.value = { 
      ...interactionsMap.value,
      ...newInteractions 
    };
  };
  
  // Clear all interactions (e.g., on logout)
  const clearInteractions = () => {
    interactionsMap.value = {};
  };
  
  return {
    interactionsMap,
    isLoading,
    error,
    getResourceInteraction,
    getUserVote,
    isBookmarked,
    getVoteCounts,
    fetchResourceInteractions,
    updateVote,
    updateBookmarkStatus,
    updateInteractionsMap,
    clearInteractions
  };
}); 