FROM node:18-alpine AS build

# Install curl for healthcheck
RUN apk --no-cache add curl

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code (including scripts)
COPY . .

# Set up common module symlink
COPY ../common ./common/

# Build the application (including prebuild script that copies common files)
RUN npm run build

# Production stage
FROM node:18-alpine

# Install curl for healthcheck
RUN apk --no-cache add curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Create logs directory
RUN mkdir -p logs

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/index.js"]