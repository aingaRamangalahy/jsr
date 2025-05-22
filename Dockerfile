FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /app

# Copy package.json files first to optimize layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY admin/package.json ./admin/

# Fetch dependencies to leverage Docker layer caching
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch

# Install dependencies only (without source code) - this allows Docker to cache this layer
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Build shared package first
RUN cd shared && pnpm build

# Build all remaining packages
RUN pnpm run -r --filter=!shared build

# Deploy only production dependencies for each service
# Include shared package in each deployment
RUN pnpm deploy --filter=backend --prod /prod/backend
RUN pnpm deploy --filter=frontend --prod /prod/frontend
RUN pnpm deploy --filter=admin --prod /prod/admin

# Backend stage
FROM base AS backend
COPY --from=build /prod/backend /app
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/app.js"]

# Frontend stage
FROM nginx:alpine AS frontend
COPY --from=build /prod/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Admin stage
FROM nginx:alpine AS admin
COPY --from=build /prod/admin/dist /usr/share/nginx/html
COPY admin/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 