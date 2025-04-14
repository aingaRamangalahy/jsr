export interface Resource {
  id?: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  image: string;
  skillLevel: SkillLevel;
  tags: string[];
  frameworks?: string[];
  rating: number;
  votes: number;
  dateAdded: string;
}

export type ResourceType = 'website' | 'book' | 'youtube' | 'twitter' | 'course';

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

export interface ResourceUpdateDTO extends Partial<ResourceCreateDTO> {}