import mongoose, { Document, Schema } from 'mongoose';
import { Category as SharedCategory } from '@jsr/shared';

// Create a type omitting id from SharedCategory since Mongoose Document has id
export type CategoryWithoutId = Omit<SharedCategory, 'id'>;

// Create interface extending the modified Category type with Document
export interface CategoryDocument extends CategoryWithoutId, Document {}

// Create Mongoose schema
const categorySchema = new Schema<CategoryDocument>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  iconUrl: {
    type: String,
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create and export model
const CategoryModel = mongoose.model<CategoryDocument>('Category', categorySchema);

export default CategoryModel; 