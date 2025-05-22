FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files for dependency installation
COPY package.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# The shared directory will be mounted as a volume at runtime
# Don't try to copy it during build

# Copy source code
COPY . .

# Build the application
RUN pnpm install
RUN pnpm run build

# Production stage with Nginx to serve static files
FROM nginx:alpine

# Copy Nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"] 