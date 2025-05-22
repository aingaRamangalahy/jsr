FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files for dependency installation
COPY package.json ./
COPY tsconfig.json ./

# Copy source code (includes the shared directory we prepared)
COPY . .

# For local development with pnpm workspaces, replace workspace: dependency with local path
RUN sed -i 's/"@jsr\/shared": "workspace:\*"/"@jsr\/shared": "file:src\/shared"/g' package.json

# Build the application
RUN pnpm install
RUN pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json ./

# Copy the built application from builder stage
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN sed -i 's/"@jsr\/shared": "workspace:\*"/"@jsr\/shared": "file:dist\/shared"/g' package.json
RUN pnpm install --prod

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose API port
EXPOSE 3000

# Start the server
CMD ["node", "dist/app.js"] 