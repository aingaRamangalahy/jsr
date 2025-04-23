# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy root package.json and workspace files
COPY package.json ./
COPY common ./common/
COPY frontend/package.json ./frontend/

# Install dependencies using workspace feature
RUN npm install
RUN npm run build:common

# Copy frontend code
COPY frontend ./frontend/

# Build the application
WORKDIR /app/frontend
RUN npm run build

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