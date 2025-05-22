import { Types } from 'mongoose';
import { 
  ResourceDifficulty, 
  PricingType, 
  ResourceStatus, 
  UserRole 
} from '@jsr/shared';

// Predefined IDs to ensure relationships between documents
const userIds = Array(5).fill(null).map(() => new Types.ObjectId());
const adminIds = Array(3).fill(null).map(() => new Types.ObjectId());
const categoryIds = Array(5).fill(null).map(() => new Types.ObjectId());
const resourceTypeIds = Array(4).fill(null).map(() => new Types.ObjectId());
const resourceIds = Array(10).fill(null).map(() => new Types.ObjectId());

// Mock Categories
export const categories = [
  { _id: categoryIds[0], name: 'JavaScript Fundamentals', description: 'Core JavaScript concepts and features' },
  { _id: categoryIds[1], name: 'Frontend Frameworks', description: 'Popular JavaScript frontend frameworks' },
  { _id: categoryIds[2], name: 'Backend Development', description: 'Server-side JavaScript technologies' },
  { _id: categoryIds[3], name: 'Testing', description: 'JavaScript testing tools and methodologies' },
  { _id: categoryIds[4], name: 'DevOps', description: 'JavaScript in DevOps and deployment' },
];

// Mock Resource Types
export const resourceTypes = [
  { _id: resourceTypeIds[0], name: 'Article', description: 'Written content explaining concepts' },
  { _id: resourceTypeIds[1], name: 'Video', description: 'Video tutorials and courses' },
  { _id: resourceTypeIds[2], name: 'Documentation', description: 'Official and unofficial docs' },
  { _id: resourceTypeIds[3], name: 'Tool', description: 'Development tools and utilities' },
];

// Mock Users
export const users = [
  { 
    _id: userIds[0], 
    name: 'John Doe', 
    email: 'john@example.com', 
    githubId: 'johndoe', 
    role: 'user' as UserRole 
  },
  { 
    _id: userIds[1], 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    githubId: 'janesmith', 
    role: 'user' as UserRole 
  },
  { 
    _id: userIds[2], 
    name: 'Alex Johnson', 
    email: 'alex@example.com', 
    githubId: 'alexj', 
    role: 'user' as UserRole 
  },
  { 
    _id: userIds[3], 
    name: 'Sara Wilson', 
    email: 'sara@example.com', 
    githubId: 'saraw', 
    role: 'user' as UserRole 
  },
  { 
    _id: userIds[4], 
    name: 'Michael Brown', 
    email: 'michael@example.com', 
    githubId: 'michaelb', 
    role: 'admin' as UserRole 
  },
];

// Mock Admins (passwords will be hashed during seeding)
export const admins = [
  { _id: adminIds[0], name: 'Admin One', email: 'admin1@jsr.com', password: 'Password123!' },
  { _id: adminIds[1], name: 'Admin Two', email: 'admin2@jsr.com', password: 'Password123!' },
  { _id: adminIds[2], name: 'Super Admin', email: 'super@jsr.com', password: 'Password123!' },
];

// Mock Resources
export const resources = [
  {
    _id: resourceIds[0],
    name: 'JavaScript: The Good Parts',
    description: 'A book about the good parts of JavaScript, showing how to avoid the bad parts',
    url: 'https://example.com/js-good-parts',
    category: categoryIds[0],
    type: resourceTypeIds[0],
    difficulty: 'intermediate' as ResourceDifficulty,
    pricingType: 'paid' as PricingType,
    price: 29.99,
    tags: ['javascript', 'programming', 'best practices'],
    status: 'approved' as ResourceStatus,
    createdBy: userIds[0],
    votes: {
      upvotes: 120,
      downvotes: 10
    }
  },
  {
    _id: resourceIds[1],
    name: 'Vue.js 3 Crash Course',
    description: 'Learn Vue.js 3 with the Composition API in this comprehensive crash course',
    url: 'https://example.com/vue3-course',
    category: categoryIds[1],
    type: resourceTypeIds[1],
    difficulty: 'beginner' as ResourceDifficulty,
    pricingType: 'free' as PricingType,
    tags: ['vuejs', 'frontend', 'composition api'],
    status: 'approved' as ResourceStatus,
    createdBy: userIds[1],
    votes: {
      upvotes: 85,
      downvotes: 5
    }
  },
  {
    _id: resourceIds[2],
    name: 'Node.js Design Patterns',
    description: 'Implement proven design patterns in Node.js applications',
    url: 'https://example.com/node-patterns',
    category: categoryIds[2],
    type: resourceTypeIds[0],
    difficulty: 'advanced' as ResourceDifficulty,
    pricingType: 'paid' as PricingType,
    price: 49.99,
    tags: ['nodejs', 'design patterns', 'backend'],
    status: 'approved' as ResourceStatus,
    createdBy: userIds[0],
    votes: {
      upvotes: 65,
      downvotes: 8
    }
  },
  // Adding more resources to have a good dataset
  {
    _id: resourceIds[3],
    name: 'Jest Testing Framework Documentation',
    description: 'Official documentation for the Jest JavaScript testing framework',
    url: 'https://jestjs.io/docs/getting-started',
    category: categoryIds[3],
    type: resourceTypeIds[2],
    difficulty: 'intermediate' as ResourceDifficulty,
    pricingType: 'free' as PricingType,
    tags: ['testing', 'jest', 'unit testing'],
    status: 'approved' as ResourceStatus,
    createdBy: userIds[2],
    votes: {
      upvotes: 45,
      downvotes: 2
    }
  },
  {
    _id: resourceIds[4],
    name: 'GitHub Actions for JavaScript Developers',
    description: 'Learn how to automate JavaScript workflows with GitHub Actions',
    url: 'https://example.com/github-actions-js',
    category: categoryIds[4],
    type: resourceTypeIds[1],
    difficulty: 'intermediate' as ResourceDifficulty,
    pricingType: 'free' as PricingType,
    tags: ['github', 'ci/cd', 'devops'],
    status: 'approved' as ResourceStatus,
    createdBy: userIds[3],
    votes: {
      upvotes: 30,
      downvotes: 1
    }
  },
  // Add more resources
  {
    _id: resourceIds[5],
    name: 'TypeScript Handbook',
    description: 'The official TypeScript documentation and guide',
    url: 'https://www.typescriptlang.org/docs/',
    category: categoryIds[0],
    type: resourceTypeIds[2],
    difficulty: 'intermediate' as ResourceDifficulty,
    pricingType: 'free' as PricingType,
    tags: ['typescript', 'static typing', 'javascript'],
    status: 'approved' as ResourceStatus,
    createdBy: userIds[4],
    votes: {
      upvotes: 95,
      downvotes: 3
    }
  },
  {
    _id: resourceIds[6],
    name: 'React Performance Optimization',
    description: 'Learn advanced techniques for optimizing React application performance',
    url: 'https://example.com/react-performance',
    category: categoryIds[1],
    type: resourceTypeIds[0],
    difficulty: 'advanced' as ResourceDifficulty,
    pricingType: 'paid' as PricingType,
    price: 39.99,
    tags: ['react', 'performance', 'optimization'],
    status: 'approved' as ResourceStatus,
    createdBy: userIds[1],
    votes: {
      upvotes: 72,
      downvotes: 4
    }
  },
  {
    _id: resourceIds[7],
    name: 'Express.js API Development',
    description: 'Building RESTful APIs with Express.js and Node.js',
    url: 'https://example.com/express-api',
    category: categoryIds[2],
    type: resourceTypeIds[1],
    difficulty: 'intermediate' as ResourceDifficulty,
    pricingType: 'free' as PricingType,
    tags: ['express', 'api', 'rest', 'nodejs'],
    status: 'pending' as ResourceStatus,
    createdBy: userIds[2],
    votes: {
      upvotes: 58,
      downvotes: 6
    }
  },
  {
    _id: resourceIds[8],
    name: 'JavaScript Testing Best Practices',
    description: 'A comprehensive guide to testing JavaScript applications',
    url: 'https://example.com/js-testing',
    category: categoryIds[3],
    type: resourceTypeIds[0],
    difficulty: 'advanced' as ResourceDifficulty,
    pricingType: 'free' as PricingType,
    tags: ['testing', 'tdd', 'best practices'],
    status: 'rejected' as ResourceStatus,
    createdBy: userIds[3],
    votes: {
      upvotes: 42,
      downvotes: 3
    }
  },
  {
    _id: resourceIds[9],
    name: 'Docker for JavaScript Applications',
    description: 'Containerize your JavaScript applications with Docker',
    url: 'https://example.com/docker-js',
    category: categoryIds[4],
    type: resourceTypeIds[1],
    difficulty: 'intermediate' as ResourceDifficulty,
    pricingType: 'paid' as PricingType,
    price: 29.99,
    tags: ['docker', 'containers', 'devops'],
    status: 'approved' as ResourceStatus,
    createdBy: userIds[4],
    votes: {
      upvotes: 35,
      downvotes: 2
    }
  }
];

// Mock Comments
export const comments = [
  {
    resourceId: resourceIds[0],
    userId: userIds[0],
    content: 'This book completely changed how I write JavaScript. Highly recommended!',
    createdAt: new Date('2022-01-10'),
  },
  {
    resourceId: resourceIds[0],
    userId: userIds[1],
    content: 'A classic that still holds up today. Great for intermediate developers.',
    createdAt: new Date('2022-02-15'),
  },
  {
    resourceId: resourceIds[1],
    userId: userIds[2],
    content: 'This crash course helped me understand the Composition API quickly.',
    createdAt: new Date('2022-03-01'),
  },
  {
    resourceId: resourceIds[2],
    userId: userIds[3],
    content: 'Advanced but worth it. The patterns have improved my Node.js architecture.',
    createdAt: new Date('2022-01-20'),
  },
  {
    resourceId: resourceIds[3],
    userId: userIds[4],
    content: 'Best documentation for Jest I\'ve found. Clear examples and explanations.',
    createdAt: new Date('2022-02-05'),
  },
];

// Mock Bookmarks
export const bookmarks = [
  {
    userId: userIds[0],
    resourceId: resourceIds[0],
    createdAt: new Date('2022-01-15'),
  },
  {
    userId: userIds[0],
    resourceId: resourceIds[2],
    createdAt: new Date('2022-01-16'),
  },
  {
    userId: userIds[1],
    resourceId: resourceIds[1],
    createdAt: new Date('2022-02-10'),
  },
  {
    userId: userIds[2],
    resourceId: resourceIds[3],
    createdAt: new Date('2022-02-20'),
  },
  {
    userId: userIds[3],
    resourceId: resourceIds[4],
    createdAt: new Date('2022-03-05'),
  },
];

// This function returns all data packaged
export const getAllTestData = () => ({
  categories,
  resourceTypes,
  users,
  admins,
  resources,
  comments,
  bookmarks
}); 