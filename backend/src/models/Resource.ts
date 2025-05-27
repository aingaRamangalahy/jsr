import mongoose, { Document, Schema } from 'mongoose';
import { 
  Resource as SharedResource, 
  ResourceStatus, 
  ResourceDifficulty, 
  PricingType 
} from '@jsr/shared';

// Create a type omitting id from SharedResource since Mongoose Document has id
export type ResourceWithoutId = Omit<SharedResource, 'id' | 'category' | 'type' | 'createdBy'>;

// Create interface extending the modified Resource type with Document
export interface ResourceDocument extends ResourceWithoutId, Document {
  category: mongoose.Types.ObjectId | string;
  type: mongoose.Types.ObjectId | string;
  createdBy: mongoose.Types.ObjectId | string;
}

// Create Mongoose schema
const resourceSchema = new Schema<ResourceDocument>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
    match: [/^(https?:\/\/)?((?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+([a-z0-9]{2,63}))(:[0-9]{1,5})?(\/[^\s#?]*)?(\?[^\s#]*)?(#[^\s]*)?$/, 'Please provide a valid URL']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResourceType',
    required: [true, 'Resource type is required']
  },
  difficulty: {
    type: String,
    enum: {
      values: ['beginner', 'intermediate', 'advanced'] as ResourceDifficulty[],
      message: 'Difficulty must be either: beginner, intermediate, or advanced'
    },
    required: [true, 'Difficulty is required']
  },
  tags: {
    type: [String],
    validate: {
      validator: function(tags: string[]) {
        return tags.length <= 10;
      },
      message: 'Resources cannot have more than 10 tags'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected'] as ResourceStatus[],
      message: 'Status must be either: pending, approved, or rejected'
    },
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Resource must have a creator']
  },
  pricingType: {
    type: String,
    enum: {
      values: ['free', 'paid'] as PricingType[],
      message: 'Pricing type must be either: free or paid'
    },
    required: [true, 'Pricing type is required']
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    required: function(this: ResourceDocument) {
      return this.pricingType === 'paid';
    },
    validate: {
      validator: function(this: ResourceDocument, price: number) {
        return this.pricingType !== 'paid' || (price !== undefined && price > 0);
      },
      message: 'Paid resources must have a price greater than 0'
    }
  },
  imageUrl: {
    type: String,
    trim: true,
    match: [/^(https?:\/\/)?((?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+([a-z0-9]{2,63}))(:[0-9]{1,5})?(\/[^\s#?]*)?(\?[^\s#]*)?(#[^\s]*)?$/, 'Please provide a valid image URL']
  },
  providerIcon: {
    type: String,
    trim: true,
    match: [/^(https?:\/\/)?((?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+([a-z0-9]{2,63}))(:[0-9]{1,5})?(\/[^\s#?]*)?(\?[^\s#]*)?(#[^\s]*)?$/, 'Please provide a valid icon URL']
  },
  votes: {
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for vote count
resourceSchema.virtual('voteCount').get(function(this: ResourceDocument) {
  const votes = this.votes || { upvotes: 0, downvotes: 0 };
  return votes.upvotes - votes.downvotes;
});

// Create index for searching
resourceSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Create and export model
const ResourceModel = mongoose.model<ResourceDocument>('Resource', resourceSchema);

export default ResourceModel; 