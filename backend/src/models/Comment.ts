import mongoose, { Document, Schema } from 'mongoose';
import { Comment as SharedComment } from '@jsr/shared';

// Create a type omitting id from SharedComment since Mongoose Document has id
export type CommentWithoutId = Omit<SharedComment, 'id' | 'resourceId' | 'userId'>;

// Create interface extending the modified Comment type with Document
export interface CommentDocument extends CommentWithoutId, Document {
  resourceId: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
}

// Create Mongoose schema
const commentSchema = new Schema<CommentDocument>({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: [true, 'Resource ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for efficient retrieval of resource comments
commentSchema.index({ resourceId: 1, createdAt: -1 });

// Create and export model
const CommentModel = mongoose.model<CommentDocument>('Comment', commentSchema);

export default CommentModel; 