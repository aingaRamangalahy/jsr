import { Request, Response } from 'express';
import { CategoryModel } from '../models';

/**
 * Get all categories
 */
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await CategoryModel.find().sort({ name: 1 });
    
    res.status(200).json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to fetch categories',
        code: 'CATEGORY_FETCH_ERROR'
      }
    });
  }
};

/**
 * Get category by ID
 */
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const category = await CategoryModel.findById(id);
    
    if (!category) {
      res.status(404).json({
        status: 'error',
        error: {
          message: 'Category not found',
          code: 'CATEGORY_NOT_FOUND'
        }
      });
      return;
    }
    
    res.status(200).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to fetch category',
        code: 'CATEGORY_FETCH_ERROR'
      }
    });
  }
};

/**
 * Create a new category (admin only)
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, iconUrl } = req.body;
    
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
    const existingCategory = await CategoryModel.findOne({ name });
    
    if (existingCategory) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'A category with this name already exists',
          code: 'DUPLICATE_CATEGORY'
        }
      });
      return;
    }
    
    // Create new category
    const category = await CategoryModel.create({
      name,
      description,
      iconUrl
    });
    
    res.status(201).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to create category',
        code: 'CATEGORY_CREATE_ERROR'
      }
    });
  }
};

/**
 * Update a category (admin only)
 */
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, iconUrl } = req.body;
    
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
      const existingCategory = await CategoryModel.findOne({ name, _id: { $ne: id } });
      
      if (existingCategory) {
        res.status(400).json({
          status: 'error',
          error: {
            message: 'A category with this name already exists',
            code: 'DUPLICATE_CATEGORY'
          }
        });
        return;
      }
    }
    
    // Find and update category
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { name, description, iconUrl },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      res.status(404).json({
        status: 'error',
        error: {
          message: 'Category not found',
          code: 'CATEGORY_NOT_FOUND'
        }
      });
      return;
    }
    
    res.status(200).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to update category',
        code: 'CATEGORY_UPDATE_ERROR'
      }
    });
  }
};

/**
 * Delete a category (admin only)
 */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Find and delete category
    const category = await CategoryModel.findByIdAndDelete(id);
    
    if (!category) {
      res.status(404).json({
        status: 'error',
        error: {
          message: 'Category not found',
          code: 'CATEGORY_NOT_FOUND'
        }
      });
      return;
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Failed to delete category',
        code: 'CATEGORY_DELETE_ERROR'
      }
    });
  }
}; 