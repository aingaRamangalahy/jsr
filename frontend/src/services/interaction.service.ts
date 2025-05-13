import api from './api.service';
import { 
  Resource,
  Comment, 
  Bookmark, 
  ApiResponse, 
  User,
  Vote
} from '@jsr/shared/types';

// Additional types needed for interactions
export interface CommentInput {
  content: string;
}

export interface VoteInput {
  value: 'up' | 'down' | 'none'; // 'up' for upvote, 'down' for downvote, 'none' to remove vote
}

export interface ResourceWithInteractions extends Resource {
  userVote?: 'up' | 'down' | null;
  isBookmarked?: boolean;
  commentsCount?: number;
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
  async voteResource(resourceId: string, vote: VoteInput): Promise<ApiResponse<Vote>> {
    try {
      const { data } = await api.post(`/resources/${resourceId}/vote`, vote);
      return data;
    } catch (error) {
      console.error('Error voting on resource:', error);
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
  }
}; 