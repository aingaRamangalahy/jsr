# JSR Backend Testing Utilities

This directory contains tools for testing the JSR backend API.

## Test Data

The `testData.ts` file contains mock data for testing the API. It includes:

- Categories
- Resource Types
- Users
- Admins
- Resources
- Comments
- Bookmarks

The data is structured to maintain referential integrity, with predefined IDs to ensure relationships between documents.

## Database Seeder

The `seeder.ts` file provides functions to:

1. Seed the database with test data
2. Clear all collections in the database
3. Drop the entire database

## CLI Tool

The `db-cli.ts` file provides a command-line interface for managing the test database.

### Usage

Run the following npm scripts to use the CLI tool:

```bash
# Seed the database with test data
npm run db:seed

# Clear all collections in the database
npm run db:clear

# Drop the entire database
npm run db:drop
```

## Postman Collection

A Postman collection is provided in the `jsr-api.postman_collection.json` file at the root of the backend directory. This collection includes requests for all API endpoints, properly organized into folders.

### Importing the Collection

1. Open Postman
2. Click "Import" in the top left
3. Select the `jsr-api.postman_collection.json` file
4. Also import the `jsr-environment.postman_environment.json` file to set up the environment

### Using the Collection

1. Make sure the JSR backend server is running
2. Select the "JSR API - Local" environment in Postman
3. Use the "Admin Login" request to get an admin JWT token (automatically saved to the environment)
4. Use other requests to test the API

The collection is organized into folders:

- General: Health check
- Auth: Admin login and GitHub OAuth
- Resources: Resource management endpoints
- Categories: Category management endpoints
- Resource Types: Resource type management endpoints
- User Interactions: Comments, bookmarks, and votes

## Testing Workflow

1. Start with a clean database: `npm run db:clear`
2. Seed the database: `npm run db:seed`
3. Start the API server: `npm run dev`
4. Use the Postman collection to test API endpoints
5. When finished, you can drop the database: `npm run db:drop` 