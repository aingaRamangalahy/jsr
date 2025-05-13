import { Request, Response } from 'express';
import { ResourceModel } from '../models';
import { PricingType, ResourceStatus } from '@jsr/shared';

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
  const { category, type, difficulty, pricingType, status, page = 1, limit = 50 } = req.query;
  
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
  
  // Calculate pagination
  const skip = (Number(page) - 1) * Number(limit);
  
  // Execute query with pagination
  const resources = await ResourceModel.find(query)
    .populate('category')
    .populate('type')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });
  
  // Get total count for pagination
  const total = await ResourceModel.countDocuments(query);
  
  // Build pagination data
  const paginationData = {
    page: Number(page),
    limit: Number(limit),
    total,
    pages: Math.ceil(total / Number(limit))
  };
  
  return { resources, paginationData };
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
    
    // Send response
    res.status(200).json({
      status: 'success',
      data: resource
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
      pricingType, price
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

