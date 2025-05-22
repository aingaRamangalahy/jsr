import type { Resource as BaseResource } from '@jsr/shared/types';

// Extend the Resource interface to include commentCount
export interface Resource extends BaseResource {
  commentCount?: number;
}

// Re-export all types from shared
export * from '@jsr/shared/types'; 