import express, { Router } from 'express';
import { adminLogin, githubCallback } from '../controllers/auth.controller';

const router: Router = express.Router();

// Admin authentication routes
router.post('/admin/login', adminLogin);

// GitHub OAuth routes
router.get('/github', (req, res) => {
  // Redirect to GitHub for authentication
  // This is a placeholder for actual GitHub OAuth implementation
  res.status(200).json({
    status: 'success',
    message: 'GitHub OAuth route - to be implemented',
    redirectUrl: 'https://github.com/login/oauth/authorize?client_id=YOUR_GITHUB_CLIENT_ID&scope=user:email'
  });
});

router.get('/github/callback', githubCallback);

export default router; 