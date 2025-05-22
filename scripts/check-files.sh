#!/bin/bash
set -e

# Check if required files exist before starting Docker build
echo "Checking for required files..."

# Check backend files
echo "Checking backend files..."
if [ ! -d "backend" ]; then
  echo "ERROR: backend directory not found!"
  exit 1
fi

if [ ! -f "backend/package.json" ]; then
  echo "ERROR: backend/package.json not found!"
  exit 1
fi

if [ ! -f "backend/tsconfig.json" ]; then
  echo "ERROR: backend/tsconfig.json not found!"
  exit 1
fi

# Check frontend files
echo "Checking frontend files..."
if [ ! -d "frontend" ]; then
  echo "ERROR: frontend directory not found!"
  exit 1
fi

if [ ! -f "frontend/package.json" ]; then
  echo "ERROR: frontend/package.json not found!"
  exit 1
fi

if [ ! -f "frontend/tsconfig.json" ]; then
  echo "ERROR: frontend/tsconfig.json not found!"
  exit 1
fi

if [ ! -f "frontend/vite.config.ts" ]; then
  echo "ERROR: frontend/vite.config.ts not found!"
  exit 1
fi

# Check frontend Nginx config
if [ ! -f "frontend/nginx.conf" ]; then
  echo "WARNING: frontend/nginx.conf not found, creating default config..."
  mkdir -p frontend
  cat > frontend/nginx.conf << EOF
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable compression for JS, CSS, HTML, JSON, etc.
    gzip on;
    gzip_min_length 1000;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Assets, media
    location ~* \.(?:jpg|jpeg|gif|png|ico|svg|webp)$ {
        expires 1M;
        access_log off;
        add_header Cache-Control "public";
    }

    # CSS, JS, Fonts
    location ~* \.(?:css|js|woff|woff2|ttf|otf|eot)$ {
        expires 1y;
        access_log off;
        add_header Cache-Control "public";
    }

    # Handle Single Page Application routes
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
fi

# Check admin files
echo "Checking admin files..."
if [ ! -d "admin" ]; then
  echo "ERROR: admin directory not found!"
  exit 1
fi

if [ ! -f "admin/package.json" ]; then
  echo "ERROR: admin/package.json not found!"
  exit 1
fi

if [ ! -f "admin/tsconfig.json" ]; then
  echo "ERROR: admin/tsconfig.json not found!"
  exit 1
fi

if [ ! -f "admin/vite.config.ts" ]; then
  echo "ERROR: admin/vite.config.ts not found!"
  exit 1
fi

# Check admin Nginx config
if [ ! -f "admin/nginx.conf" ]; then
  echo "WARNING: admin/nginx.conf not found, creating default config..."
  mkdir -p admin
  cat > admin/nginx.conf << EOF
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable compression for JS, CSS, HTML, JSON, etc.
    gzip on;
    gzip_min_length 1000;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Assets, media
    location ~* \.(?:jpg|jpeg|gif|png|ico|svg|webp)$ {
        expires 1M;
        access_log off;
        add_header Cache-Control "public";
    }

    # CSS, JS, Fonts
    location ~* \.(?:css|js|woff|woff2|ttf|otf|eot)$ {
        expires 1y;
        access_log off;
        add_header Cache-Control "public";
    }

    # Handle Single Page Application routes
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
fi

echo "All required files are present or have been created!"
echo "You can now run Docker Compose: docker-compose -f docker-compose.prod.yml up -d" 