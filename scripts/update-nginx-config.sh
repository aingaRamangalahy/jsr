#!/bin/bash
set -e

# Update Nginx configuration and set up SSL for admin.jsresources.dev
echo "Updating Nginx configuration for JSResources..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root or with sudo"
  exit 1
fi

# Backup existing configuration
echo "Backing up existing Nginx configuration..."
cp /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.bak

# Copy new configuration
echo "Copying new configuration..."
cp nginx-host-config.conf /etc/nginx/sites-available/jsresources

# Create symbolic link if it doesn't exist
if [ ! -f /etc/nginx/sites-enabled/jsresources ]; then
  ln -s /etc/nginx/sites-available/jsresources /etc/nginx/sites-enabled/
fi

# Remove default config if it exists
if [ -f /etc/nginx/sites-enabled/default ]; then
  rm /etc/nginx/sites-enabled/default
fi

# Request SSL certificate for admin subdomain if needed
echo "Checking SSL certificate for admin.jsresources.dev..."
if ! certbot certificates | grep -q "admin.jsresources.dev"; then
  echo "Adding admin.jsresources.dev to SSL certificate..."
  certbot --nginx -d jsresources.dev -d api.jsresources.dev -d admin.jsresources.dev
else
  echo "Certificate already covers admin.jsresources.dev"
fi

# Test Nginx configuration
echo "Testing Nginx configuration..."
nginx -t

# Reload Nginx
echo "Reloading Nginx..."
systemctl reload nginx

echo "Nginx configuration updated successfully!"
echo "Your sites should be accessible at:"
echo "- https://jsresources.dev (frontend)"
echo "- https://api.jsresources.dev (backend API)"
echo "- https://admin.jsresources.dev (admin dashboard)" 