import { Request, Response } from 'express';
import { CommentModel, BookmarkModel, ResourceModel, VoteModel } from '../models';
import mongoose from 'mongoose';

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
    const { value } = req.body;
    const userId = req.user.id;
    
    // Validate vote type (now including 'none' to remove votes)
    if (!value || !['up', 'down', 'none'].includes(value)) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'Vote type must be either up, down, or none',
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
    
    // Find existing vote
    const existingVote = await VoteModel.findOne({
      resourceId,
      userId
    });
    
    // Initialize vote data and vote update
    let vote = null;
    let voteUpdate = {};
    
    try {
      // If removing vote ('none')
      if (value === 'none') {
        if (existingVote) {
          // Decrement the appropriate vote counter
          const updateField = existingVote.value === 'up' ? 'votes.upvotes' : 'votes.downvotes';
          voteUpdate = { $inc: { [updateField]: -1 } };
          
          // Delete the vote
          await VoteModel.findByIdAndDelete(existingVote._id);
        } else {
          // No vote to remove
          res.status(400).json({
            status: 'error',
            error: {
              message: 'No vote to remove',
              code: 'NO_VOTE_TO_REMOVE'
            }
          });
          return;
        }
      } 
      // If adding or changing vote
      else {
        if (existingVote) {
          // If same vote type, no change needed
          if (existingVote.value === value) {
            res.status(200).json({
              status: 'success',
              data: {
                vote: existingVote,
                votes: resource.votes
              },
              message: `Vote already recorded`
            });
            return;
          }
          
          // Changing vote type (up to down or down to up)
          // First decrement the old vote counter
          const oldUpdateField = existingVote.value === 'up' ? 'votes.upvotes' : 'votes.downvotes';
          
          // Then increment the new vote counter
          const newUpdateField = value === 'up' ? 'votes.upvotes' : 'votes.downvotes';
          
          voteUpdate = { 
            $inc: { 
              [oldUpdateField]: -1,
              [newUpdateField]: 1 
            } 
          };
          
          // Update the vote
          vote = await VoteModel.findByIdAndUpdate(
            existingVote._id,
            { value },
            { new: true }
          );
        } else {
          // New vote
          // Increment the appropriate vote counter
          const updateField = value === 'up' ? 'votes.upvotes' : 'votes.downvotes';
          voteUpdate = { $inc: { [updateField]: 1 } };
          
          // Create a new vote
          vote = await VoteModel.create({
            resourceId,
            userId,
            value
          });
        }
      }
      
      // Update resource vote counts
      const updatedResource = await ResourceModel.findByIdAndUpdate(
        resourceId,
        voteUpdate,
        { new: true }
      );
      
      res.status(200).json({
        status: 'success',
        data: {
          vote,
          votes: updatedResource?.votes
        },
        message: value === 'none' 
          ? 'Vote removed successfully' 
          : `Resource ${value} voted successfully`
      });
    } catch (error) {
      console.error('Error processing vote:', error);
      throw error;
    }
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

/**
 * Get a user's vote for a specific resource
 */
export const getUserVote = async (req: Request, res: Response): Promise<void> => {
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
    const userId = req.user.id;
    
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
    
    // Find user's vote for this resource
    const vote = await VoteModel.findOne({
      resourceId,
      userId
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        vote,
        votes: resource.votes
      }
    });
  } catch (error) {
    console.error('Error getting user vote:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to get user vote',
        code: 'GET_VOTE_ERROR'
      }
    });
  }
};

/**
 * Get interactions for multiple resources in a single request
 * This reduces API calls when displaying multiple resources
 */
export const getResourceInteractions = async (req: Request, res: Response): Promise<void> => {
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
    
    const { resourceIds } = req.body;
    
    // Validate input
    if (!resourceIds || !Array.isArray(resourceIds) || resourceIds.length === 0) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'Resource IDs array is required',
          code: 'MISSING_RESOURCE_IDS'
        }
      });
      return;
    }
    
    // Set a reasonable limit on batch size
    if (resourceIds.length > 50) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'Too many resource IDs, maximum is 50',
          code: 'TOO_MANY_RESOURCE_IDS'
        }
      });
      return;
    }
    
    const userId = req.user.id;
    
    // Perform a single query for all user votes
    const votes = await VoteModel.find({
      userId,
      resourceId: { $in: resourceIds }
    });
    
    // Perform a single query for all user bookmarks
    const bookmarks = await BookmarkModel.find({
      userId,
      resourceId: { $in: resourceIds }
    });
    
    // Get vote counts for all resources
    const resources = await ResourceModel.find(
      { _id: { $in: resourceIds } },
      { votes: 1 } // Only fetch the votes field
    );
    
    // Build a map of resource interactions
    const interactionsMap = resourceIds.reduce((map, resourceId) => {
      // Find the user's vote for this resource
      const vote = votes.find(v => v.resourceId.toString() === resourceId);
      
      // Check if the resource is bookmarked
      const isBookmarked = bookmarks.some(b => b.resourceId.toString() === resourceId);
      
      // Get vote counts
      const resource = resources.find(r => r._id && r._id.toString() === resourceId);
      const voteCounts = resource?.votes || { upvotes: 0, downvotes: 0 };
      
      // Add to map
      map[resourceId] = {
        vote: vote || null,
        isBookmarked,
        votes: voteCounts
      };
      
      return map;
    }, {});
    
    res.status(200).json({
      status: 'success',
      data: interactionsMap
    });
  } catch (error) {
    console.error('Error fetching resource interactions:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to fetch resource interactions',
        code: 'FETCH_INTERACTIONS_ERROR'
      }
    });
  }
}; 