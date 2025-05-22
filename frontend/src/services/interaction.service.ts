import api from './api.service';
import { 
  Resource,
  Comment, 
  Bookmark, 
  ApiResponse, 
  User,
  Vote
} from '@jsr/shared/types';
import { ResourceWithInteractions } from './resource.service';

// Additional types needed for interactions
export interface CommentInput {
  content: string;
}

export interface VoteInput {
  value: 'up' | 'down' | 'none'; // 'up' for upvote, 'down' for downvote, 'none' to remove vote
}

// Interface for the response of batch resource interactions
export interface ResourceInteractions {
  [resourceId: string]: {
    vote: Vote | null;
    isBookmarked: boolean;
    votes: {
      upvotes: number;
      downvotes: number;
    };
  };
}

// Service
export const interactionService = {
  // Comment Methods
  async getResourceComments(resourceId: string): Promise<ApiResponse<Comment[]>> {
    try {
      const { data } = await api.get(`/resources/${resourceId}/comments`);
      return data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  async addComment(resourceId: string, comment: CommentInput): Promise<ApiResponse<Comment>> {
    try {
      const { data } = await api.post(`/resources/${resourceId}/comments`, comment);
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Bookmark Methods
  async bookmarkResource(resourceId: string): Promise<ApiResponse<Bookmark>> {
    try {
      const { data } = await api.post(`/resources/${resourceId}/bookmark`);
      return data;
    } catch (error) {
      console.error('Error bookmarking resource:', error);
      throw error;
    }
  },

  async removeBookmark(resourceId: string): Promise<ApiResponse<void>> {
    try {
      const { data } = await api.delete(`/resources/${resourceId}/bookmark`);
      return data;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  },

  async getUserBookmarks(): Promise<ApiResponse<Bookmark[]>> {
    try {
      const { data } = await api.get('/bookmarks');
      return data;
    } catch (error) {
      console.error('Error fetching user bookmarks:', error);
      throw error;
    }
  },

  // Vote Methods
  async voteResource(resourceId: string, vote: VoteInput): Promise<ApiResponse<{
    vote: Vote | null;
    votes: { upvotes: number; downvotes: number };
  }>> {
    try {
      const { data } = await api.post(`/resources/${resourceId}/vote`, vote);
      return data;
    } catch (error) {
      console.error('Error voting on resource:', error);
      throw error;
    }
  },
  
  async getUserVote(resourceId: string): Promise<ApiResponse<{vote: Vote | null, votes: {upvotes: number, downvotes: number}}>> {
    try {
      const { data } = await api.get(`/resources/${resourceId}/vote`);
      return data;
    } catch (error) {
      console.error('Error getting user vote:', error);
      throw error;
    }
  },

  // Helper method to check if user has bookmarked a resource
  async hasBookmarked(resourceId: string): Promise<boolean> {
    try {
      const response = await this.getUserBookmarks();
      if (response.status === 'success' && response.data) {
        return response.data.some((bookmark: Bookmark) => {
          const bookmarkResourceId = typeof bookmark.resourceId === 'string' 
            ? bookmark.resourceId 
            : bookmark.resourceId.id;
          return bookmarkResourceId === resourceId;
        });
      }
      return false;
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }
  },

  // New batch method to get interactions for multiple resources
  async getResourcesInteractions(resourceIds: string[]): Promise<ApiResponse<ResourceInteractions>> {
    try {
      const { data } = await api.post('/resources/interactions', { resourceIds });
      return data;
    } catch (error) {
      console.error('Error fetching resource interactions:', error);
      throw error;
    }
  },

  // Extract user interactions from ResourceWithInteractions objects
  extractInteractionsFromResources(resources: ResourceWithInteractions[]): ResourceInteractions {
    const interactionsMap: ResourceInteractions = {};
    
    resources.forEach(resource => {
      if (resource.id && resource.userInteractions) {
        interactionsMap[resource.id] = {
          vote: resource.userInteractions.vote,
          isBookmarked: resource.userInteractions.isBookmarked,
          votes: resource.votes || { upvotes: 0, downvotes: 0 }
        };
      }
    });
    
    return interactionsMap;
  }
}; 