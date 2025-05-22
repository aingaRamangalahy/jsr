import mongoose, { Document, Schema } from 'mongoose';
import { Vote as SharedVote } from '@jsr/shared';

// Create a type omitting id from SharedVote since Mongoose Document has id
export type VoteWithoutId = Omit<SharedVote, 'id' | 'resourceId' | 'userId'>;

// Create interface extending the modified Vote type with Document
export interface VoteDocument extends VoteWithoutId, Document {
  resourceId: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
}

// Create Mongoose schema
const voteSchema = new Schema<VoteDocument>({
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: [true, 'Resource ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  value: {
    type: String,
    enum: {
      values: ['up', 'down'],
      message: 'Vote value must be either: up or down'
    },
    required: [true, 'Vote value is required']
  }
}, {
  timestamps: true
});

// Create a compound index to ensure a user can only vote once per resource
voteSchema.index({ resourceId: 1, userId: 1 }, { unique: true });

// Create and export model
const VoteModel = mongoose.model<VoteDocument>('Vote', voteSchema);

export default VoteModel; 