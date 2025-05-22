// Test importing from shared package using path aliases

import { Resource, RESOURCE_STATUS, API_ENDPOINTS } from '@jsr/shared';

// Example usage of shared types
const exampleResource: Resource = {
  id: '1',
  name: 'Node.js Documentation',
  description: 'Official Node.js documentation',
  url: 'https://nodejs.org/docs',
  category: '1',
  type: '1',
  difficulty: 'beginner',
  tags: ['node', 'javascript', 'backend'],
  status: RESOURCE_STATUS.APPROVED,
  createdBy: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  pricingType: 'free'
};

// Example usage of shared constants
const resourcesEndpoint = API_ENDPOINTS.RESOURCES;

console.log('Shared types and constants imported successfully in backend!');
console.log('Example resource:', exampleResource);
console.log('Resources endpoint:', resourcesEndpoint); 