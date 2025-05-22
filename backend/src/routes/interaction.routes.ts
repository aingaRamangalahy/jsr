import express, { Router } from 'express';
import {
  addComment,
  getResourceComments,
  bookmarkResource,
  removeBookmark,
  getUserBookmarks,
  voteResource,
  getUserVote,
  getResourceInteractions
} from '../controllers/interaction.controller';
import { protect } from '../middleware/auth';

const router: Router = express.Router();

// Comment routes
router.get('/resources/:resourceId/comments', getResourceComments);
router.post('/resources/:resourceId/comments', protect, addComment);

// Bookmark routes
router.post('/resources/:resourceId/bookmark', protect, bookmarkResource);
router.delete('/resources/:resourceId/bookmark', protect, removeBookmark);
router.get('/bookmarks', protect, getUserBookmarks);

// Vote routes
router.post('/resources/:resourceId/vote', protect, voteResource);
router.get('/resources/:resourceId/vote', protect, getUserVote);

// Batch operations
router.post('/resources/interactions', protect, getResourceInteractions);

export default router; 