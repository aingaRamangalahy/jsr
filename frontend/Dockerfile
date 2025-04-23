# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy root package.json and workspace files
COPY package.json ./
COPY common ./common/
COPY frontend/package.json ./frontend/

# Install dependencies using workspace feature
RUN npm install

# Build the common package first
WORKDIR /app/common
RUN npm run build

# Copy frontend code
WORKDIR /app
COPY frontend ./frontend/

# Build the frontend application with type-checking disabled for production
WORKDIR /app/frontend
# Use build-only instead of build to skip type checking
RUN npm run build-only

# Production stage
FROM nginx:alpine

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]