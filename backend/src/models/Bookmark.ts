import mongoose, { Document, Schema } from 'mongoose';
import { Bookmark as SharedBookmark } from '@jsr/shared';

// Create a type omitting id from SharedBookmark since Mongoose Document has id
export type BookmarkWithoutId = Omit<SharedBookmark, 'id' | 'resourceId' | 'userId'>;

// Create interface extending the modified Bookmark type with Document
export interface BookmarkDocument extends BookmarkWithoutId, Document {
  resourceId: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
}

// Create Mongoose schema
const bookmarkSchema = new Schema<BookmarkDocument>({
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

// Create a compound unique index to prevent duplicate bookmarks
bookmarkSchema.index({ resourceId: 1, userId: 1 }, { unique: true });

// Create and export model
const BookmarkModel = mongoose.model<BookmarkDocument>('Bookmark', bookmarkSchema);

export default BookmarkModel; 