import { Request, Response } from 'express';
import { CommentModel, BookmarkModel, ResourceModel } from '../models';

/**
 * Add a comment to a resource
 */
export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        error: {
          message: 'Not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      });
      return;
    }
    
    const { resourceId } = req.params;
    const { content } = req.body;
    
    // Validate content
    if (!content) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'Comment content is required',
          code: 'MISSING_CONTENT'
        }
      });
      return;
    }
    
    // Check if resource exists
    const resource = await ResourceModel.findById(resourceId);
    
    if (!resource) {
      res.status(404).json({
        status: 'error',
        error: {
          message: 'Resource not found',
          code: 'RESOURCE_NOT_FOUND'
        }
      });
      return;
    }
    
    // Create comment
    const comment = await CommentModel.create({
      content,
      resourceId,
      userId: req.user.id
    });
    
    // Populate user data
    await comment.populate('userId', 'name');
    
    res.status(201).json({
      status: 'success',
      data: comment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to add comment',
        code: 'COMMENT_CREATE_ERROR'
      }
    });
  }
};

/**
 * Get comments for a specific resource
 */
export const getResourceComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resourceId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Check if resource exists
    const resource = await ResourceModel.findById(resourceId);
    
    if (!resource) {
      res.status(404).json({
        status: 'error',
        error: {
          message: 'Resource not found',
          code: 'RESOURCE_NOT_FOUND'
        }
      });
      return;
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Get comments with pagination
    const comments = await CommentModel.find({ resourceId })
      .populate('userId', 'name')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await CommentModel.countDocuments({ resourceId });
    
    res.status(200).json({
      status: 'success',
      data: comments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to fetch comments',
        code: 'COMMENT_FETCH_ERROR'
      }
    });
  }
};

/**
 * Bookmark a resource
 */
export const bookmarkResource = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        error: {
          message: 'Not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      });
      return;
    }
    
    const { resourceId } = req.params;
    
    // Check if resource exists
    const resource = await ResourceModel.findById(resourceId);
    
    if (!resource) {
      res.status(404).json({
        status: 'error',
        error: {
          message: 'Resource not found',
          code: 'RESOURCE_NOT_FOUND'
        }
      });
      return;
    }
    
    // Check if bookmark already exists
    const existingBookmark = await BookmarkModel.findOne({
      resourceId,
      userId: req.user.id
    });
    
    if (existingBookmark) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'Resource already bookmarked',
          code: 'ALREADY_BOOKMARKED'
        }
      });
      return;
    }
    
    // Create bookmark
    const bookmark = await BookmarkModel.create({
      resourceId,
      userId: req.user.id
    });
    
    res.status(201).json({
      status: 'success',
      data: bookmark
    });
  } catch (error) {
    console.error('Error bookmarking resource:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to bookmark resource',
        code: 'BOOKMARK_CREATE_ERROR'
      }
    });
  }
};

/**
 * Remove a bookmark
 */
export const removeBookmark = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        error: {
          message: 'Not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      });
      return;
    }
    
    const { resourceId } = req.params;
    
    // Find and delete bookmark
    const bookmark = await BookmarkModel.findOneAndDelete({
      resourceId,
      userId: req.user.id
    });
    
    if (!bookmark) {
      res.status(404).json({
        status: 'error',
        error: {
          message: 'Bookmark not found',
          code: 'BOOKMARK_NOT_FOUND'
        }
      });
      return;
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Bookmark removed successfully'
    });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to remove bookmark',
        code: 'BOOKMARK_DELETE_ERROR'
      }
    });
  }
};

/**
 * Get user's bookmarks
 */
export const getUserBookmarks = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        error: {
          message: 'Not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      });
      return;
    }
    
    const { pricingType } = req.query;
    const { page = 1, limit = 10 } = req.query;
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Get bookmarks with pagination
    let bookmarks;
    let total;
    
    if (pricingType) {
      // If filtering by pricing type
      const resources = await ResourceModel.find({
        pricingType: pricingType as string,
        status: 'approved'
      }).select('_id');
      
      const resourceIds = resources.map(r => r._id);
      
      bookmarks = await BookmarkModel.find({
        userId: req.user.id,
        resourceId: { $in: resourceIds }
      })
        .populate({
          path: 'resourceId',
          populate: [
            { path: 'category' },
            { path: 'type' }
          ]
        })
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });
      
      total = await BookmarkModel.countDocuments({
        userId: req.user.id,
        resourceId: { $in: resourceIds }
      });
    } else {
      // All bookmarks
      bookmarks = await BookmarkModel.find({ userId: req.user.id })
        .populate({
          path: 'resourceId',
          populate: [
            { path: 'category' },
            { path: 'type' }
          ]
        })
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });
      
      total = await BookmarkModel.countDocuments({ userId: req.user.id });
    }
    
    res.status(200).json({
      status: 'success',
      data: bookmarks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to fetch bookmarks',
        code: 'BOOKMARK_FETCH_ERROR'
      }
    });
  }
};

/**
 * Vote on a resource (upvote or downvote)
 */
export const voteResource = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        error: {
          message: 'Not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      });
      return;
    }
    
    const { resourceId } = req.params;
    const { voteType } = req.body;
    
    // Validate vote type
    if (!voteType || !['upvote', 'downvote'].includes(voteType)) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'Vote type must be either upvote or downvote',
          code: 'INVALID_VOTE_TYPE'
        }
      });
      return;
    }
    
    // Check if resource exists
    const resource = await ResourceModel.findById(resourceId);
    
    if (!resource) {
      res.status(404).json({
        status: 'error',
        error: {
          message: 'Resource not found',
          code: 'RESOURCE_NOT_FOUND'
        }
      });
      return;
    }
    
    // Update votes
    // For a real application, we would track individual user votes
    // Here we're just incrementing the counters
    const updateField = voteType === 'upvote' ? 'votes.upvotes' : 'votes.downvotes';
    
    const updatedResource = await ResourceModel.findByIdAndUpdate(
      resourceId,
      { $inc: { [updateField]: 1 } },
      { new: true }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        votes: updatedResource?.votes
      },
      message: `Resource ${voteType}d successfully`
    });
  } catch (error) {
    console.error('Error voting on resource:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to vote on resource',
        code: 'VOTE_ERROR'
      }
    });
  }
}; 