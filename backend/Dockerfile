FROM node:18-alpine AS build

# Install curl for healthcheck
RUN apk --no-cache add curl

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Set up symlink for @common path alias
RUN mkdir -p node_modules/@common && \ cp -r common/* node_modules/@common/

# Copy source code
COPY . .

# Build the application
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

# Copy common directory for runtime
COPY --from=build /app/common ./common

# Create logs directory
RUN mkdir -p logs

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/index.js"]