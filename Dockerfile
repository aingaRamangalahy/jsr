FROM node:20-slim AS base
# Enable pnpm with proper environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Build stage - combines deps and build into one stage
FROM base AS build
WORKDIR /app

# Accept build arguments for frontend environment variables
ARG VITE_API_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Copy package manager files and workspace package.json files first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY admin/package.json ./admin/

# Install dependencies
# This layer is cached as long as the package files don't change
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# Now copy the rest of the source code
COPY . .

# Build all packages, with fallbacks for TypeScript errors
# Build shared package first since others depend on it
RUN cd shared && pnpm build
# Then build the application packages
RUN cd backend && pnpm build
# For frontend build, inject VITE_ env vars directly into the command's environment
RUN VITE_API_URL=${VITE_API_URL} \
    VITE_SUPABASE_URL=${VITE_SUPABASE_URL} \
    VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY} \
    sh -c 'cd frontend && pnpm build'
RUN echo "Listing /app/frontend contents after build:" && ls -la /app/frontend
RUN cd admin && pnpm build

# Create optimized production deployment packages
RUN pnpm deploy --filter=backend --prod /prod/backend
RUN echo "Listing /prod contents after backend deploy:" && ls -la /prod && ls -la /prod/backend
RUN pnpm deploy --filter=frontend --prod /prod/frontend
RUN echo "Listing /prod contents after frontend deploy:" && ls -la /prod && ls -la /prod/frontend
RUN pnpm deploy --filter=admin --prod /prod/admin
RUN echo "Listing /prod contents after admin deploy:" && ls -la /prod && ls -la /prod/admin
RUN echo "Final listing of /app and /prod in build stage:" && ls -la /app && ls -la /prod

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