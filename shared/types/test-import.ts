// This is a test file to verify our shared types are properly exported

import {
  Resource,
  Category,
  User,
  RESOURCE_STATUS,
  API_ENDPOINTS
} from '../';

// Example usage of shared types
const exampleResource: Resource = {
  id: '1',
  name: 'Vue 3 Documentation',
  description: 'Official Vue 3 documentation',
  url: 'https://v3.vuejs.org',
  category: '1',
  type: '1',
  difficulty: 'beginner',
  tags: ['vue', 'javascript', 'framework'],
  status: RESOURCE_STATUS.APPROVED,
  createdBy: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  pricingType: 'free'
};

// Example usage of shared constants
const resourcesEndpoint = API_ENDPOINTS.RESOURCES;

console.log('Shared types and constants imported successfully!');
console.log('Example resource:', exampleResource);
console.log('Resources endpoint:', resourcesEndpoint); 