import express from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  preFetchResourceUrl,
} from './resource.controller';

const router = express.Router();

// @route   GET /api/resources
// @desc    Get all resources with filtering
// @access  Public
router.get('/', getResources);

// @route   GET /api/resources/prefetch
// @desc    Get all resources with filtering
// @access  Protected
router.get('/prefetch', preFetchResourceUrl);

// @route   GET /api/resources/:id
// @desc    Get single resource by ID
// @access  Public
router.get('/:id', getResourceById);

// @route   POST /api/resources
// @desc    Create new resource
// @access  Public
router.post('/', createResource);

// @route   PUT /api/resources/:id
// @desc    Update resource
// @access  Public
router.put('/:id', updateResource);

// @route   DELETE /api/resources/:id
// @desc    Delete resource
// @access  Public
router.delete('/:id', deleteResource);

export default router;
