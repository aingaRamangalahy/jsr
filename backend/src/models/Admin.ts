import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin as SharedAdmin } from '@jsr/shared';

// Create a type omitting id from SharedAdmin since Mongoose Document has id
export type AdminWithoutId = Omit<SharedAdmin, 'id'>;

// Create interface extending the modified Admin type with Document
// Also add a method to validate password
export interface AdminDocument extends AdminWithoutId, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create Mongoose schema
const adminSchema = new Schema<AdminDocument>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in query results by default
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    // @ts-ignore: Password is selected with +password in queries when needed
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Create and export model
const AdminModel = mongoose.model<AdminDocument>('Admin', adminSchema);

export default AdminModel; 