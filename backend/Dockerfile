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
RUN npm run build:common

# Copy backend code
COPY backend ./backend/

# Build the application
WORKDIR /app/backend
RUN npm run build

# Production stage
FROM node:18-alpine

# Install curl for healthcheck
RUN apk --no-cache add curl

WORKDIR /app

# Copy package files and workspace configuration
COPY package.json ./
COPY backend/package.json ./backend/
COPY common/package.json ./common/
COPY common/dist ./common/dist/

# Install production dependencies only
WORKDIR /app/backend
RUN npm ci --only=production --omit=dev

# Copy built application from build stage
COPY --from=build /app/backend/dist ./dist

# Create logs directory
RUN mkdir -p logs

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/index.js"]