FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files for dependency installation
COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./

# The shared directory will be mounted as a volume at runtime
# Don't try to copy it during build

# Copy source code
COPY . .

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

# The shared directory will be mounted at runtime

# Install only production dependencies
RUN pnpm install --prod

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose API port
EXPOSE 3000

# Start the server
CMD ["node", "dist/app.js"] 