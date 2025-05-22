FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /app

# Set memory limits for Node.js
ENV NODE_OPTIONS="--max-old-space-size=512"
# Reduce parallel operations for pnpm
ENV PNPM_NETWORK_CONCURRENCY=1
ENV PNPM_NETWORK_TIMEOUT=100000

# Copy package.json files first to optimize layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY admin/package.json ./admin/

# Fetch dependencies to leverage Docker layer caching - with lower concurrency
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch --network-concurrency=1

# Install dependencies only (without source code) - with lower concurrency
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --network-concurrency=1

# Copy all source code
COPY . .

# Build shared package first - with reduced memory usage
RUN cd shared && pnpm build

# Build remaining packages individually to avoid passing filter flags to tsc
RUN cd backend && pnpm build
RUN cd frontend && pnpm build
RUN cd admin && pnpm build

# Deploy only production dependencies for each service - sequentially
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