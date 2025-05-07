import bcrypt from 'bcryptjs';

/**
 * Hash a plain text password
 * @param password Plain text password
 * @returns Promise resolving to hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hashed password
 * @param password Plain text password
 * @param hashedPassword Hashed password from database
 * @returns Promise resolving to boolean indicating if passwords match
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
}; 