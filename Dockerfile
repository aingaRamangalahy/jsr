FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY pnpm-lock.yaml ./
# First fetch dependencies to leverage Docker layer caching
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch

# Copy source code
COPY . .

# Install dependencies and build all packages
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build

# Deploy only production dependencies for each service
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