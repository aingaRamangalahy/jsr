import mongoose from 'mongoose';
import { Resource } from '@jsr/common';

const resourceSchema = new mongoose.Schema<Resource>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please enter a valid URL',
      ],
    },
    type: {
      type: String,
      required: [true, 'Resource type is required'],
      enum: {
        values: ['website', 'book', 'youtube', 'twitter', 'course'],
        message: '{VALUE} is not supported as a resource type',
      },
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300x200?text=JS',
      trim: true,
    },
    skillLevel: {
      type: String,
      required: [true, 'Skill level is required'],
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: '{VALUE} is not supported as a skill level',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    framework: String,
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    votes: {
      type: Number,
      default: 0,
      min: [0, 'Votes cannot be negative'],
    },
    dateAdded: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add text index for search functionality
resourceSchema.index(
  { title: 'text', description: 'text', tags: 'text' },
  { weights: { title: 3, tags: 2, description: 1 } }
);

export default mongoose.model<Resource>('Resource', resourceSchema);
