import express, { Router } from 'express';
import {
  getResourceTypes,
  getResourceTypeById,
  createResourceType,
  updateResourceType,
  deleteResourceType
} from '../controllers/resourceType.controller';
import { protect, restrictTo } from '../middleware/auth';

const router: Router = express.Router();

// Public routes
router.get('/', getResourceTypes);
router.get('/:id', getResourceTypeById);

// Admin routes (requires admin role)
router.post('/', protect, restrictTo, createResourceType);
router.put('/:id', protect, restrictTo, updateResourceType);
router.delete('/:id', protect, restrictTo, deleteResourceType);

export default router; 