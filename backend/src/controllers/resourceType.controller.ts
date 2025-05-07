import { Request, Response } from 'express';
import { ResourceTypeModel } from '../models';

/**
 * Get all resource types
 */
export const getResourceTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const resourceTypes = await ResourceTypeModel.find().sort({ name: 1 });
    
    res.status(200).json({
      status: 'success',
      data: resourceTypes
    });
  } catch (error) {
    console.error('Error fetching resource types:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to fetch resource types',
        code: 'RESOURCE_TYPE_FETCH_ERROR'
      }
    });
  }
};

/**
 * Get resource type by ID
 */
export const getResourceTypeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const resourceType = await ResourceTypeModel.findById(id);
    
    if (!resourceType) {
      res.status(404).json({
        status: 'error',
        error: {
          message: 'Resource type not found',
          code: 'RESOURCE_TYPE_NOT_FOUND'
        }
      });
      return;
    }
    
    res.status(200).json({
      status: 'success',
      data: resourceType
    });
  } catch (error) {
    console.error('Error fetching resource type:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to fetch resource type',
        code: 'RESOURCE_TYPE_FETCH_ERROR'
      }
    });
  }
};

/**
 * Create a new resource type (admin only)
 */
export const createResourceType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    
    // Validate required fields
    if (!name || !description) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'Name and description are required',
          code: 'MISSING_FIELDS'
        }
      });
      return;
    }
    
    // Check for duplicate name
    const existingResourceType = await ResourceTypeModel.findOne({ name });
    
    if (existingResourceType) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'A resource type with this name already exists',
          code: 'DUPLICATE_RESOURCE_TYPE'
        }
      });
      return;
    }
    
    // Create new resource type
    const resourceType = await ResourceTypeModel.create({
      name,
      description
    });
    
    res.status(201).json({
      status: 'success',
      data: resourceType
    });
  } catch (error) {
    console.error('Error creating resource type:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to create resource type',
        code: 'RESOURCE_TYPE_CREATE_ERROR'
      }
    });
  }
};

/**
 * Update a resource type (admin only)
 */
export const updateResourceType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    // Validate required fields
    if (!name && !description) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'At least one field (name or description) must be provided',
          code: 'MISSING_FIELDS'
        }
      });
      return;
    }
    
    // Check for duplicate name if updating name
    if (name) {
      const existingResourceType = await ResourceTypeModel.findOne({ name, _id: { $ne: id } });
      
      if (existingResourceType) {
        res.status(400).json({
          status: 'error',
          error: {
            message: 'A resource type with this name already exists',
            code: 'DUPLICATE_RESOURCE_TYPE'
          }
        });
        return;
      }
    }
    
    // Find and update resource type
    const resourceType = await ResourceTypeModel.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );
    
    if (!resourceType) {
      res.status(404).json({
        status: 'error',
        error: {
          message: 'Resource type not found',
          code: 'RESOURCE_TYPE_NOT_FOUND'
        }
      });
      return;
    }
    
    res.status(200).json({
      status: 'success',
      data: resourceType
    });
  } catch (error) {
    console.error('Error updating resource type:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to update resource type',
        code: 'RESOURCE_TYPE_UPDATE_ERROR'
      }
    });
  }
};

/**
 * Delete a resource type (admin only)
 */
export const deleteResourceType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Find and delete resource type
    const resourceType = await ResourceTypeModel.findByIdAndDelete(id);
    
    if (!resourceType) {
      res.status(404).json({
        status: 'error',
        error: {
          message: 'Resource type not found',
          code: 'RESOURCE_TYPE_NOT_FOUND'
        }
      });
      return;
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Resource type deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resource type:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to delete resource type',
        code: 'RESOURCE_TYPE_DELETE_ERROR'
      }
    });
  }
}; 