/**
 * JSR Type Definitions
 * This file exports all shared types used across the JSR applications
 */

// Resource Types

export type ResourceStatus = 'pending' | 'approved' | 'rejected';
export type ResourceDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type PricingType = 'free' | 'paid';

export interface Resource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string | Category;
  type: string | ResourceType;
  difficulty: ResourceDifficulty;
  tags: string[];
  status: ResourceStatus;
  createdBy: string | User;
  createdAt: Date;
  updatedAt: Date;
  pricingType: PricingType;
  price?: number;  // Required if pricingType is 'paid'
  imageUrl?: string; // Optional image URL for the resource
  providerIcon?: string; // Optional icon URL for the provider
  votes?: {
    upvotes: number;
    downvotes: number;
  };
}

// Category Types

export interface Category {
  id: string;
  name: string;
  description: string;
  iconUrl?: string; // Optional icon URL for the category
  createdAt: Date;
  updatedAt: Date;
}

// Resource Type Types

export interface ResourceType {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// User Types

export type UserRole = 'user' | 'admin';
export type AuthProvider = 'github' | 'email';

export interface User {
  id: string;
  name: string;
  email: string;
  githubId?: string;
  supabaseId?: string;
  provider?: AuthProvider;
  avatarUrl?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  password: string;  // This will be hashed, never stored or transmitted as plaintext
  createdAt: Date;
  updatedAt: Date;
}

// Interaction Types

export interface Comment {
  id: string;
  content: string;
  resourceId: string | Resource;
  userId: string | User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bookmark {
  id: string;
  resourceId: string | Resource;
  userId: string | User;
  createdAt: Date;
}

export interface Vote {
  id: string;
  resourceId: string | Resource;
  userId: string | User;
  value: 'up' | 'down';
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
} 