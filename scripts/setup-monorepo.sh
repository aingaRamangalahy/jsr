#!/bin/bash
set -e

# Setup monorepo structure and ensure shared directory exists
echo "Setting up monorepo structure for JSResources..."

# Create shared directory if it doesn't exist
echo "Checking shared directory..."
if [ ! -d "shared" ]; then
  echo "Creating shared directory..."
  mkdir -p shared
  mkdir -p shared/types
  mkdir -p shared/components/ui
  mkdir -p shared/components/custom
fi

# Create shared package.json if it doesn't exist
if [ ! -f "shared/package.json" ]; then
  echo "Creating shared package.json..."
  cat > shared/package.json << EOF
{
  "name": "@jsr/shared",
  "version": "0.1.0",
  "description": "Shared components and types for JSR applications",
  "private": true,
  "main": "index.ts",
  "types": "index.ts"
}
EOF
fi

# Create shared types if they don't exist
if [ ! -f "shared/types/index.ts" ]; then
  echo "Creating shared types..."
  cat > shared/types/index.ts << EOF
// Basic types for JSR project

export interface Resource {
  id?: string;
  name: string;
  description: string;
  url: string;
  category: string | Category;
  type: string | ResourceType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdBy?: string | User;
  pricingType: 'free' | 'paid';
  price?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  id?: string;
  name: string;
  description: string;
}

export interface ResourceType {
  id?: string;
  name: string;
  description: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  githubId?: string;
  role: 'user' | 'admin';
}

export interface Admin {
  id?: string;
  name: string;
  email: string;
  password: string;
}

export interface Comment {
  id?: string;
  content: string;
  resourceId: string | Resource;
  userId: string | User;
  createdAt?: Date;
}

export interface Bookmark {
  id?: string;
  resourceId: string | Resource;
  userId: string | User;
  createdAt?: Date;
}
EOF
fi

# Create root pnpm-workspace.yaml if it doesn't exist
if [ ! -f "pnpm-workspace.yaml" ]; then
  echo "Creating pnpm-workspace.yaml..."
  cat > pnpm-workspace.yaml << EOF
packages:
  - 'backend'
  - 'frontend'
  - 'admin'
  - 'shared'
EOF
fi

echo "Monorepo structure setup complete!"
echo "You can now run the containers with: docker-compose -f docker-compose.prod.yml up -d" 