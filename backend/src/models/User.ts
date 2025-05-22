import mongoose, { Document, Schema } from 'mongoose';
import { User as SharedUser, UserRole, AuthProvider } from '@jsr/shared';

// Create a type omitting id from SharedUser since Mongoose Document also has id
export type UserWithoutId = Omit<SharedUser, 'id'>;

// Create interface extending the modified User type with Document
export interface UserDocument extends UserWithoutId, Document {
  supabaseId?: string;
  provider?: AuthProvider;
  avatarUrl?: string;
}

// Create Mongoose schema
const userSchema = new Schema<UserDocument>({
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
  githubId: {
    type: String,
    unique: true,
    sparse: true // Allows null values to not be considered in the unique index
  },
  supabaseId: {
    type: String,
    unique: true,
    sparse: true
  },
  provider: {
    type: String,
    enum: ['github', 'email']
  },
  avatarUrl: {
    type: String
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'] as UserRole[],
      message: 'Role must be either: user or admin'
    },
    default: 'user'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create and export model
const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel; 