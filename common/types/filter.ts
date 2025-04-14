export interface FilterState {
  sortBy: SortOption;
  type: string;
  skillLevel: string;
  frameworks: string[];
  category: string;
  search: string;
  page?: number;
  limit?: number;
}

export type SortOption = 'newest' | 'oldest' | 'popular' | 'rating';