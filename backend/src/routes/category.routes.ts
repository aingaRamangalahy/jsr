import express, { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller';
import { protect, restrictTo } from '../middleware/auth';

const router: Router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin routes (requires admin role)
router.post('/', protect, restrictTo, createCategory);
router.put('/:id', protect, restrictTo, updateCategory);
router.delete('/:id', protect, restrictTo, deleteCategory);

export default router; 