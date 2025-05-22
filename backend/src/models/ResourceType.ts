import mongoose, { Document, Schema } from 'mongoose';
import { ResourceType as SharedResourceType } from '@jsr/shared';

// Create a type omitting id from SharedResourceType since Mongoose Document has id
export type ResourceTypeWithoutId = Omit<SharedResourceType, 'id'>;

// Create interface extending the modified ResourceType with Document
export interface ResourceTypeDocument extends ResourceTypeWithoutId, Document {}

// Create Mongoose schema
const resourceTypeSchema = new Schema<ResourceTypeDocument>({
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create and export model
const ResourceTypeModel = mongoose.model<ResourceTypeDocument>('ResourceType', resourceTypeSchema);

export default ResourceTypeModel; 