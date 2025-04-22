export interface Resource {
  id?: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  image: string;
  skillLevel: SkillLevel;
  tags: string[];
  framework: FrameworkFilters;
  rating?: number;
  votes?: number;
  dateAdded?: string;
}

export type FrameworkFilters = 'react' | 'angular' | 'vue' | 'svelte' | 'nextjs' | 'nuxtjs' | 'gatsby' | 'ember' | 'backbone' | 'solidjs' | string;
export type ResourceType = 'website' | 'book' | 'youtube' | 'twitter' | 'course' | 'podcast' | 'must-read';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ResourceCreateDTO {
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  image?: string;
  skillLevel: SkillLevel;
  tags: string[];
  frameworks?: string[];
}

export interface ResourceUpdateDTO extends Partial<ResourceCreateDTO> { }

export interface LinkMetadata {
  url?: string;
  title?: string;
  description?: string;
  images?: string[];
  favicon?: string;
  // author?: string;
  // siteName?: string;
  // type?: string;
  // publishedTime?: string;
}