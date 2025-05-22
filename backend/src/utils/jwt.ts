import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_development_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// User payload for JWT
export interface UserPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

/**
 * Generate a JWT token for a user
 * @param payload User payload to include in the token
 * @returns JWT token string
 */
export const generateToken = (payload: UserPayload): string => {
  return jwt.sign(
    payload, 
    JWT_SECRET as jwt.Secret, 
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Verify a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): UserPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as jwt.Secret) as UserPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}; 