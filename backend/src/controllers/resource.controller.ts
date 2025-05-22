import { Request, Response } from 'express';
import { ResourceModel, VoteModel, BookmarkModel, CommentModel } from '../models';
import { PricingType, ResourceStatus } from '@jsr/shared';
import { getPreview } from '../utils/preview';

// Interface for resource with user interactions
interface ResourceWithUserInteractions {
  _id: any;
  name: string;
  description: string;
  url: string;
  category: any;
  type: any;
  difficulty: string;
  tags: string[];
  status: string;
  createdBy: any;
  createdAt: Date;
  updatedAt: Date;
  pricingType: string;
  price?: number;
  imageUrl?: string;
  providerIcon?: string;
  votes: {
    upvotes: number;
    downvotes: number;
  };
  commentCount: number;
  userInteractions?: {
    vote: any | null;
    isBookmarked: boolean;
  };
  [key: string]: any; // Allow for additional properties
}

/**
 * Helper function to build query, apply pagination, and fetch resources
 * @param baseQuery Base query object to start with
 * @param req Request object containing query parameters
 * @returns Object containing resources, pagination data, and total count
 */
const fetchResourcesWithPagination = async (
  baseQuery: Record<string, any>,
  req: Request
) => {
  // Extract query parameters
  const { category, type, difficulty, pricingType, status, search, page = 1, limit = 50 } = req.query;
  
  // Copy the base query to avoid mutating the original
  const query = { ...baseQuery };
  
  // Add filters if provided
  if (category) query.category = category;
  if (type) query.type = type;
  
  // Handle difficulty filter - could be string or array
  if (difficulty) {
    if (Array.isArray(difficulty) || (typeof difficulty === 'string' && difficulty.includes(','))) {
      // If it's an array or comma-separated string, use $in operator
      const difficultyValues = Array.isArray(difficulty) 
        ? difficulty 
        : (difficulty as string).split(',');
      
      query.difficulty = { $in: difficultyValues };
    } else {
      // Single value
      query.difficulty = difficulty;
    }
  }
  
  // Handle pricingType filter - could be string or array
  if (pricingType) {
    if (Array.isArray(pricingType) || (typeof pricingType === 'string' && pricingType.includes(','))) {
      // If it's an array or comma-separated string, use $in operator
      const pricingValues = Array.isArray(pricingType) 
        ? pricingType 
        : (pricingType as string).split(',');
        
      query.pricingType = { $in: pricingValues };
    } else {
      // Single value
      query.pricingType = pricingType;
    }
  }
  
  if (status) query.status = status;
  
  // Add search functionality
  if (search && typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.trim();
    
    // Try to use text search first (more efficient for indexed fields)
    if (searchTerm.length >= 3) {
      // For longer search terms, use text search which is more efficient 
      // but requires at least 3 characters
      query.$text = { $search: searchTerm };
    } else {
      // For shorter search terms or as a fallback, use regex search
      const searchRegex = new RegExp(searchTerm, 'i');
      
      // Search in multiple fields: name, description, tags
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }
  }
  
  // Calculate pagination
  const skip = (Number(page) - 1) * Number(limit);
  
  // Start with a base sort order
  let sortOptions: Record<string, any> = { createdAt: -1 };
  
  // If using text search, sort by score first
  if (query.$text) {
    sortOptions = { score: { $meta: "textScore" } };
  }
  
  // Execute query with pagination
  let findQuery = ResourceModel.find(query);
  
  // If using text search, include the text score
  if (query.$text) {
    findQuery = findQuery.select({ score: { $meta: "textScore" } });
  }
  
  // Execute query with population, pagination and sorting
  const resources = await findQuery
    .populate('category')
    .populate('type')
    .skip(skip)
    .limit(Number(limit))
    .sort(sortOptions);
  
  // Get total count for pagination
  const total = await ResourceModel.countDocuments(query);
  
  // Build pagination data
  const paginationData = {
    page: Number(page),
    limit: Number(limit),
    total,
    pages: Math.ceil(total / Number(limit))
  };
  
  // Convert resources to plain objects for easier manipulation
  const resourceObjects: ResourceWithUserInteractions[] = resources.map(resource => resource.toObject());
  
  // Fetch comment counts for all resources in one query
  const resourceIds = resources.map(resource => resource._id);
  const commentCounts = await CommentModel.aggregate([
    { $match: { resourceId: { $in: resourceIds } } },
    { $group: { _id: '$resourceId', count: { $sum: 1 } } }
  ]);
  
  // Create a map of resource ID to comment count for faster lookup
  const commentCountMap = new Map();
  commentCounts.forEach(item => {
    commentCountMap.set(item._id.toString(), item.count);
  });
  
  // Add comment counts to resources
  resourceObjects.forEach(resource => {
    const resourceId = resource._id.toString();
    resource.commentCount = commentCountMap.get(resourceId) || 0;
  });
  
  // If user is authenticated, include interactions data
  if (req.user && resources.length > 0) {
    const userId = req.user.id;
    const resourceIds = resources.map(resource => resource._id);
    
    // Fetch votes and bookmarks in parallel
    const [votes, bookmarks] = await Promise.all([
      VoteModel.find({ userId, resourceId: { $in: resourceIds } }),
      BookmarkModel.find({ userId, resourceId: { $in: resourceIds } })
    ]);
    
    // Map votes and bookmarks to resources
    const resourcesWithInteractions = resourceObjects.map(resourceObject => {
      const resourceId = resourceObject._id.toString();
      
      // Find user's vote for this resource
      const vote = votes.find(v => v.resourceId.toString() === resourceId);
      
      // Check if resource is bookmarked
      const isBookmarked = bookmarks.some(b => b.resourceId.toString() === resourceId);
      
      // Add interaction data
      resourceObject.userInteractions = {
        vote: vote || null,
        isBookmarked,
      };
      
      return resourceObject;
    });
    
    return { resources: resourcesWithInteractions, paginationData };
  }
  
  // For unauthenticated users, just return resources with votes and comment counts
  return { resources: resourceObjects, paginationData };
};

/**
 * Get all approved resources with optional filtering
 */
export const getResources = async (req: Request, res: Response): Promise<void> => {
  try {
    // Start with approved resources only for public endpoint
    const baseQuery = { status: 'approved' };
    
    // Fetch resources using helper
    const { resources, paginationData } = await fetchResourcesWithPagination(baseQuery, req);
    
    // Send response
    res.status(200).json({
      status: 'success',
      data: resources,
      pagination: paginationData
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to fetch resources',
        code: 'RESOURCE_FETCH_ERROR'
      }
    });
  }
};

/**
 * Get a single resource by ID
 */
export const getResourceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Find resource by ID
    const resource = await ResourceModel.findById(id)
      .populate('category')
      .populate('type')
      .populate('createdBy', 'name');
    
    // Check if resource exists and is approved (for non-admin users)
    if (!resource || (resource.status !== 'approved' && (!req.user || req.user.role !== 'admin'))) {
      res.status(404).json({
        status: 'error',
        error: {
          message: 'Resource not found or not available',
          code: 'RESOURCE_NOT_FOUND'
        }
      });
      return;
    }
    
    // Convert to plain object for manipulation
    const resourceObject: ResourceWithUserInteractions = resource.toObject();
    
    // Get comment count
    const commentCount = await CommentModel.countDocuments({ resourceId: id });
    resourceObject.commentCount = commentCount;
    
    // If user is authenticated, include interaction data
    if (req.user) {
      const userId = req.user.id;
      const resourceId = resource._id;
      
      // Fetch votes and bookmarks in parallel
      const [vote, bookmark] = await Promise.all([
        VoteModel.findOne({ userId, resourceId }),
        BookmarkModel.findOne({ userId, resourceId })
      ]);
      
      // Add interaction data
      resourceObject.userInteractions = {
        vote: vote || null,
        isBookmarked: !!bookmark
      };
      
      // Send response with interactions
      res.status(200).json({
        status: 'success',
        data: resourceObject
      });
      return;
    }
    
    // Send response without interactions for unauthenticated users
    res.status(200).json({
      status: 'success',
      data: resourceObject
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to fetch resource',
        code: 'RESOURCE_FETCH_ERROR'
      }
    });
  }
};

/**
 * Create a new resource (authenticated users)
 */
export const createResource = async (req: Request, res: Response): Promise<void> => {
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
    
    // Extract resource data from request body
    const {
      name, description, url, category, type, difficulty, tags,
      pricingType, price, imageUrl, providerIcon
    } = req.body;
    
    // Validate required fields
    if (!name || !description || !url || !category || !type || !difficulty || !pricingType) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'Missing required fields',
          code: 'MISSING_FIELDS'
        }
      });
      return;
    }
    
    // Validate price for paid resources
    if (pricingType === 'paid' && (!price || price <= 0)) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'Paid resources must have a price greater than 0',
          code: 'INVALID_PRICE'
        }
      });
      return;
    }
    
    // Create new resource
    const resource = await ResourceModel.create({
      name,
      description,
      url,
      category,
      type,
      difficulty,
      imageUrl,
      providerIcon,
      tags: tags || [],
      status: 'pending', // All new resources start as pending
      createdBy: req.user.id,
      pricingType,
      price: pricingType === 'paid' ? price : undefined,
      votes: { upvotes: 0, downvotes: 0 }
    });
    
    // Send response
    res.status(201).json({
      status: 'success',
      data: resource,
      message: 'Resource submitted successfully and is pending approval'
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to create resource',
        code: 'RESOURCE_CREATE_ERROR'
      }
    });
  }
};

/**
 * Get all resources (admin only)
 */
export const getAllResources = async (req: Request, res: Response): Promise<void> => {
  try {
    // Empty base query to get all resources
    const baseQuery = {};
    
    // Fetch resources using helper
    const { resources, paginationData } = await fetchResourcesWithPagination(baseQuery, req);
    
    // Send response
    res.status(200).json({
      status: 'success',
      data: resources,
      pagination: paginationData
    });
  } catch (error) {
    console.error('Error fetching all resources:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to fetch resources',
        code: 'RESOURCE_FETCH_ERROR'
      }
    });
  }
};

/**
 * Update resource status (admin only)
 */
export const updateResourceStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'Invalid status. Must be one of: pending, approved, rejected',
          code: 'INVALID_STATUS'
        }
      });
      return;
    }
    
    // Find and update resource
    const resource = await ResourceModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    // Check if resource exists
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
    
    // Send response
    res.status(200).json({
      status: 'success',
      data: resource,
      message: `Resource status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating resource status:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to update resource status',
        code: 'RESOURCE_UPDATE_ERROR'
      }
    });
  }
};

/**
 * Get free resources
 */
export const getFreeResources = async (req: Request, res: Response): Promise<void> => {
  try {
    // Base query for free resources
    const baseQuery = { 
      status: 'approved' as ResourceStatus, 
      pricingType: 'free' as PricingType 
    };
    
    // Fetch resources using helper
    const { resources, paginationData } = await fetchResourcesWithPagination(baseQuery, req);
    
    // Send response
    res.status(200).json({
      status: 'success',
      data: resources,
      pagination: paginationData
    });
  } catch (error) {
    console.error('Error fetching free resources:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to fetch free resources',
        code: 'RESOURCE_FETCH_ERROR'
      }
    });
  }
};

/**
 * Get paid resources
 */
export const getPaidResources = async (req: Request, res: Response): Promise<void> => {
  try {
    // Base query for paid resources
    const baseQuery = { 
      status: 'approved' as ResourceStatus, 
      pricingType: 'paid' as PricingType 
    };
    
    // Fetch resources using helper
    const { resources, paginationData } = await fetchResourcesWithPagination(baseQuery, req);
    
    // Send response
    res.status(200).json({
      status: 'success',
      data: resources,
      pagination: paginationData
    });
  } catch (error) {
    console.error('Error fetching paid resources:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to fetch paid resources',
        code: 'RESOURCE_FETCH_ERROR'
      }
    });
  }
};

/**
 * Update resource pricing (admin only)
 */
export const updateResourcePricing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { pricingType, price } = req.body;

    // Validate pricing type
    if (!pricingType || !['free', 'paid'].includes(pricingType)) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'Invalid pricing type. Must be one of: free, paid',
          code: 'INVALID_PRICING_TYPE'
        }
      });
      return;
    }

    // Validate price for paid resources
    if (pricingType === 'paid' && (!price || price <= 0)) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'Paid resources must have a price greater than 0',
          code: 'INVALID_PRICE'
        }
      });
      return;
    }

    // Find and update resource
    const resource = await ResourceModel.findByIdAndUpdate(
      id,
      { pricingType, price },
      { new: true, runValidators: true }
    );

    // Check if resource exists
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

    // Send response
    res.status(200).json({
      status: 'success',
      data: resource,
      message: 'Resource pricing updated successfully'
    });
  } catch (error) {
    console.error('Error updating resource pricing:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to update resource pricing',
        code: 'RESOURCE_UPDATE_ERROR'
      }
    }); 
  }
};

/**
 * Update resource (admin only)
 */
export const updateResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
  
    // Find and update resource
    const resource = await ResourceModel.findByIdAndUpdate(
      id, 
      { ...req.body },
      { new: true, runValidators: true }
    );

    // Check if resource exists
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

    // Send response
    res.status(200).json({  
      status: 'success',
      data: resource,
      message: 'Resource updated successfully'
    });
  } catch (error) {
    console.error('Error updating resource:', error); 

    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to update resource',
        code: 'RESOURCE_UPDATE_ERROR'
      } 
    });
  }
};

/**
 * Get resources submitted by the current user (requires authentication)
 */
export const getUserSubmittedResources = async (req: Request, res: Response): Promise<void> => {
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
    
    // Base query to filter by current user
    const baseQuery = { createdBy: req.user.id };
    
    // Fetch resources using helper
    const { resources, paginationData } = await fetchResourcesWithPagination(baseQuery, req);
    
    // Send response
    res.status(200).json({
      status: 'success',
      data: resources,
      pagination: paginationData
    });
  } catch (error) {
    console.error('Error fetching user submitted resources:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to fetch user submitted resources',
        code: 'RESOURCE_FETCH_ERROR'
      }
    });
  }
};

/**
 * Prefetch resources (not only for admin)
 */
export const prefetchResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'URL parameter is required',
          code: 'MISSING_URL'
        }
      });
      return;
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'Invalid URL format',
          code: 'INVALID_URL'
        }
      });
      return;
    }
    
    // Fetch link metadata from the URL
    const linkMetadata = await getPreview(url);
    
    // Send the metadata as response
    res.status(200).json({
      status: 'success',
      data: {
        url: linkMetadata.url,
        name: linkMetadata.title || '',
        description: linkMetadata.description || '',
        imageUrl: linkMetadata.images.length > 0 ? linkMetadata.images[0] : '',
        providerIcon: linkMetadata.favicon || ''
      }
    });
  } catch (error: any) { // Type assertion for error
    console.error('Error prefetching resources:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: error.message || 'Failed to prefetch resource metadata',
        code: 'PREFETCH_ERROR'
      }
    });
  }
};
