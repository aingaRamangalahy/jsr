import express, { Router } from 'express';
import { 
  adminLogin, 
  syncSupabaseUser,
  verifySupabaseToken
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth';

const router: Router = express.Router();

// Admin authentication routes
router.post('/admin/login', adminLogin);

// Supabase auth routes
router.post('/sync', syncSupabaseUser);
router.post('/verify', verifySupabaseToken);

// Get current user
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: req.user
  });
});

export default router; 