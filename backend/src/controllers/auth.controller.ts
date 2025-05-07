import { Request, Response } from 'express';
import { AdminModel } from '../models';
import { generateToken } from '../utils/jwt';

/**
 * Admin login controller
 * Authenticates an admin using email and password
 */
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'Email and password are required',
          code: 'MISSING_FIELDS'
        }
      });
      return;
    }

    // Find admin by email, include password field explicitly
    const admin = await AdminModel.findOne({ email }).select('+password');

    // Check if admin exists and password is correct
    if (!admin || !(await admin.comparePassword(password))) {
      res.status(401).json({
        status: 'error',
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        }
      });
      return;
    }

    // Generate JWT token
    const token = generateToken({
      id: admin._id.toString(),
      email: admin.email,
      role: 'admin'
    });

    // Send response
    res.status(200).json({
      status: 'success',
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email
        }
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      }
    });
  }
};

/**
 * GitHub OAuth callback
 * This is a placeholder - actual implementation will depend on GitHub OAuth configuration
 */
export const githubCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    // This is a placeholder for GitHub OAuth implementation
    // In a real implementation, this would:
    // 1. Receive the code from GitHub
    // 2. Exchange it for an access token
    // 3. Use the access token to get user data from GitHub
    // 4. Create or update the user in our database
    // 5. Generate a JWT token for the user
    
    res.status(200).json({
      status: 'success',
      message: 'GitHub OAuth callback - to be implemented'
    });
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Internal server error with GitHub authentication',
        code: 'GITHUB_AUTH_ERROR'
      }
    });
  }
}; 