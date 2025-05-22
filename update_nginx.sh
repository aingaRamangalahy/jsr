#!/bin/bash
# Nginx configuration update script

# Copy configuration file
if [ -f nginx-host-config.conf ]; then
  cp nginx-host-config.conf /etc/nginx/sites-available/jsresources
else
  echo "Error: nginx-host-config.conf file not found"
  exit 1
fi

# Create symlink if it doesn't exist
if [ ! -f /etc/nginx/sites-enabled/jsresources ]; then
  ln -s /etc/nginx/sites-available/jsresources /etc/nginx/sites-enabled/
fi

# Remove default site if it exists
if [ -f /etc/nginx/sites-enabled/default ]; then
  rm /etc/nginx/sites-enabled/default
fi

# Check if admin.jsresources.dev is already in the certificate
if ! certbot certificates | grep -q "admin.jsresources.dev"; then
  echo "Adding admin.jsresources.dev to the certificate..."
  # Use --expand flag to add new domains to existing certificate
  certbot --nginx --expand --non-interactive --agree-tos -d jsresources.dev -d api.jsresources.dev -d admin.jsresources.dev
else
  echo "All domains already in certificate, no need to update"
fi

# Reload Nginx to apply changes
systemctl reload nginx
echo "Nginx configuration updated successfully!" 