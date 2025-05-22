import express, { Router } from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  getAllResources,
  updateResourceStatus,
  getFreeResources,
  getPaidResources,
  updateResource,
  updateResourcePricing,
  getUserSubmittedResources,
  prefetchResources
} from '../controllers/resource.controller';
import { protect, restrictTo } from '../middleware/auth';

const router: Router = express.Router();

// Public routes
router.get('/', getResources);
router.get('/free', getFreeResources);
router.get('/paid', getPaidResources);
router.get('/prefetch', prefetchResources);
router.get('/:id', getResourceById);

// User routes (requires authentication)
router.post('/', protect, createResource);
router.get('/user/submitted', protect, getUserSubmittedResources);

// Admin routes (requires admin role)
router.get('/admin/all', protect, restrictTo, getAllResources);
router.put('/admin/:id', protect, restrictTo, updateResource);
router.put('/admin/:id/status', protect, restrictTo, updateResourceStatus);
router.put('/admin/:id/pricing', protect, restrictTo, updateResourcePricing);


export default router; 