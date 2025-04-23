FROM node:18-alpine AS build

# Install curl for healthcheck
RUN apk --no-cache add curl

WORKDIR /app

# Copy root package.json and workspace files
COPY package.json ./
COPY common ./common/
COPY backend/package.json ./backend/
COPY backend/tsconfig.json ./backend/

# Install dependencies using workspace feature
RUN npm install

# Build the common package first
WORKDIR /app/common
RUN npm run build

# Copy backend code
WORKDIR /app
COPY backend ./backend/

# Build the application
WORKDIR /app/backend
RUN npm run build

# Check the build output - this helps debugging
# RUN find /app -name "*.js" | sort

# Production stage
FROM node:18-alpine

# Install curl for healthcheck
RUN apk --no-cache add curl

WORKDIR /app

# Copy package files and workspace configuration
COPY package.json ./
COPY backend/package.json ./backend/
COPY common/package.json ./common/

# Create common/dist directory first
RUN mkdir -p common/dist

# Copy built common files from build stage
COPY --from=build /app/common/dist ./common/dist/

# Install production dependencies only
WORKDIR /app/backend
RUN npm install --only=production --no-fund --no-audit

# Copy built application from build stage
COPY --from=build /app/backend/dist ./dist

# Create logs directory
RUN mkdir -p logs

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]