import { Request, Response, NextFunction } from 'express';
import { verifyToken, UserPayload } from '../utils/jwt';
import supabase from '../config/supabase';
import { UserModel } from '../models';

// Extend Express Request type to include user object
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      supabaseUser?: any;
    }
  }
}

/**
 * Middleware to protect routes that require authentication
 * Verifies JWT token from Authorization header
 */
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        status: 'error',
        error: {
          message: 'Not authenticated. Please log in.',
          code: 'NOT_AUTHENTICATED'
        }
      });
      return;
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    // First try to verify as Supabase token
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (!error && user) {
        // This is a valid Supabase token
        
        // Find the corresponding user in our database
        const dbUser = await UserModel.findOne({ supabaseId: user.id });
        
        if (!dbUser) {
          res.status(404).json({
            status: 'error',
            error: {
              message: 'User not found in database',
              code: 'USER_NOT_FOUND'
            }
          });
          return;
        }
        
        // Add user to request
        req.user = {
          id: dbUser._id.toString(),
          email: dbUser.email,
          role: dbUser.role
        };
        
        req.supabaseUser = user;
        
        next();
        return;
      }
    } catch (err) {
      // If there's an error, continue to try JWT verification
      console.error('Supabase auth error:', err);
    }
    
    // If not a valid Supabase token, try as our JWT token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      res.status(401).json({
        status: 'error',
        error: {
          message: 'Invalid or expired token. Please log in again.',
          code: 'INVALID_TOKEN'
        }
      });
      return;
    }

    // Add user object to request
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      error: {
        message: 'Authentication failed',
        code: 'AUTH_FAILED'
      }
    });
  }
};

/**
 * Middleware to restrict access to admin users only
 * Must be used after the protect middleware
 */
export const restrictTo = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      status: 'error',
      error: {
        message: 'Not authenticated. Please log in.',
        code: 'NOT_AUTHENTICATED'
      }
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      status: 'error',
      error: {
        message: 'Not authorized. Admin access required.',
        code: 'NOT_AUTHORIZED'
      }
    });
    return;
  }

  next();
}; 