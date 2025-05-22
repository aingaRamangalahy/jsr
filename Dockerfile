FROM node:20-slim AS base
# Enable pnpm
RUN corepack enable

# Stage for installing dependencies
FROM base AS deps
WORKDIR /app

# Copy only package files for caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY admin/package.json ./admin/

# Install dependencies with optimized caching
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm fetch --frozen-lockfile && \
    pnpm install --frozen-lockfile

# Build stage
FROM deps AS build
WORKDIR /app

# Copy all source files
COPY . .

# Build shared package first
RUN cd shared && pnpm build

# Build each service separately
RUN cd backend && pnpm build
RUN cd frontend && pnpm build
RUN cd admin && pnpm build

# Create optimized production deployment packages
RUN pnpm deploy --filter=backend --prod /prod/backend
RUN pnpm deploy --filter=frontend --prod /prod/frontend
RUN pnpm deploy --filter=admin --prod /prod/admin

# Backend stage
FROM base AS backend
WORKDIR /app
COPY --from=build /prod/backend /app
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/app.js"]

# Frontend stage
FROM nginx:alpine AS frontend
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Admin stage
FROM nginx:alpine AS admin
COPY --from=build /app/admin/dist /usr/share/nginx/html
COPY admin/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 