/**
 * JSR Constants
 * This file exports all shared constants used across the JSR applications
 */

// Resource Constants
export const RESOURCE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export const RESOURCE_DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
} as const;

export const PRICING_TYPE = {
  FREE: 'free',
  PAID: 'paid'
} as const;

// User Constants
export const USER_ROLE = {
  USER: 'user',
  ADMIN: 'admin'
} as const;

// API Constants
export const API_ENDPOINTS = {
  RESOURCES: '/api/v1/resources',
  CATEGORIES: '/api/v1/categories',
  RESOURCE_TYPES: '/api/v1/resource-types',
  USERS: '/api/v1/users',
  ADMIN: {
    LOGIN: '/api/v1/admin/login',
    RESOURCES: '/api/v1/admin/resources'
  },
  AUTH: {
    GITHUB: '/api/v1/auth/github'
  }
} as const;

// Pagination Constants
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100; 