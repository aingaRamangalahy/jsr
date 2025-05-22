import { Request, Response } from 'express';
import { AdminModel, UserModel } from '../models';
import { generateToken } from '../utils/jwt';
import supabase from '../config/supabase';

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
 * Sync a Supabase user with our database
 * Creates or updates a user based on Supabase authentication
 */
export const syncSupabaseUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, email, name, avatar, provider, providerId } = req.body;

    if (!id || !email) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'ID and email are required',
          code: 'MISSING_FIELDS'
        }
      });
      return;
    }

    // Verify with Supabase that this user exists
    try {
      const { data: { user }, error } = await supabase.auth.admin.getUserById(id);
      
      if (error || !user) {
        console.error('Supabase verification error:', error);
        res.status(401).json({
          status: 'error',
          error: {
            message: 'Invalid Supabase user ID',
            code: 'INVALID_SUPABASE_USER'
          }
        });
        return;
      }
    } catch (err) {
      console.error('Supabase verification error:', err);
      res.status(500).json({
        status: 'error',
        error: {
          message: 'Could not verify user with Supabase',
          code: 'SUPABASE_VERIFICATION_ERROR'
        }
      });
      return;
    }

    // Try to find existing user by supabaseId
    let user = await UserModel.findOne({ supabaseId: id });

    // If not found by supabaseId, try to find by email
    if (!user) {
      user = await UserModel.findOne({ email });
    }

    // If user exists, update their information
    if (user) {
      user.name = name || user.name;
      user.email = email;
      user.supabaseId = id;
      
      // Set provider-specific fields
      if (provider === 'github' && providerId) {
        user.githubId = providerId;
        user.provider = 'github';
      }
      
      user.avatarUrl = avatar || user.avatarUrl;
      await user.save();
    } else {
      // Create a new user
      const userData: any = {
        name,
        email,
        supabaseId: id,
        avatarUrl: avatar,
        role: 'user',
      };
      
      // Set provider-specific fields
      if (provider === 'github' && providerId) {
        userData.githubId = providerId;
        userData.provider = 'github';
      }
      
      user = await UserModel.create(userData);
    }

    // Send response with user data
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Sync user error:', error);
    
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
 * Verify a Supabase token
 */
export const verifySupabaseToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({
        status: 'error',
        error: {
          message: 'Token is required',
          code: 'MISSING_TOKEN'
        }
      });
      return;
    }

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({
        status: 'error',
        error: {
          message: 'Invalid or expired token',
          code: 'INVALID_TOKEN'
        }
      });
      return;
    }

    // Find user in our database
    const user = await UserModel.findOne({ supabaseId: data.user.id });

    if (!user) {
      res.status(404).json({
        status: 'error',
        error: {
          message: 'User not found in database',
          code: 'USER_NOT_FOUND'
        }
      });
      return;
    }

    // Send response with user data
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Verify token error:', error);
    
    res.status(500).json({
      status: 'error',
      error: {
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      }
    });
  }
};
