#!/bin/bash
set -e

# JSR DigitalOcean Deployment Script
echo "Starting JSR deployment to DigitalOcean..."

# Install Docker and Docker Compose if not already installed
echo "Installing Docker and Docker Compose (if not installed)..."
if ! command -v docker &> /dev/null; then
    echo "Docker not found, installing..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "Docker installed successfully!"
else
    echo "Docker is already installed."
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose not found, installing..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose installed successfully!"
else
    echo "Docker Compose is already installed."
fi

# Configure environment variables
echo "Setting up environment variables..."
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp env.example .env
    
    # Prompt for MongoDB Atlas URI
    read -p "Enter your MongoDB Atlas URI: " mongodb_atlas_uri
    sed -i "s|MONGODB_ATLAS_URI=.*|MONGODB_ATLAS_URI=${mongodb_atlas_uri}|g" .env
    
    echo "Please edit the remaining variables in the .env file with your production values and run this script again."
    exit 1
fi

# Verify MongoDB Atlas URI is set
if ! grep -q "MONGODB_ATLAS_URI=" .env || grep -q "MONGODB_ATLAS_URI=mongodb+srv://<username>:<password>" .env; then
    echo "MongoDB Atlas URI is not properly configured in .env file"
    read -p "Enter your MongoDB Atlas URI: " mongodb_atlas_uri
    sed -i "s|MONGODB_ATLAS_URI=.*|MONGODB_ATLAS_URI=${mongodb_atlas_uri}|g" .env
fi

# Create necessary directories
echo "Creating directories for Certbot..."
mkdir -p certbot/conf
mkdir -p certbot/www

# Set up Docker Compose for production
echo "Setting up Docker Compose for production..."
if [ ! -f docker-compose.prod.yml ]; then
    echo "Error: docker-compose.prod.yml not found!"
    exit 1
fi

# Create Nginx SSL configuration
echo "Configuring Nginx with SSL support..."
if [ ! -f nginx/nginx-ssl.conf ]; then
    echo "Error: nginx/nginx-ssl.conf not found!"
    exit 1
fi

# Export variables for template substitution
export $(grep -v '^#' .env | xargs)

# Use envsubst to replace environment variables in the Nginx SSL configuration
envsubst '${DOMAIN_NAME} ${SUPABASE_URL}' < nginx/nginx-ssl.conf > nginx/nginx.conf

# Pull Docker images first
echo "Pulling Docker images..."
docker-compose -f docker-compose.prod.yml pull

# Start the application
echo "Starting application in production mode..."
docker-compose -f docker-compose.prod.yml up -d

echo "Waiting for Nginx to start before requesting SSL certificate..."
sleep 10

# Get SSL certificates
echo "Obtaining SSL certificates with Certbot..."
docker-compose -f docker-compose.prod.yml run --rm certbot

# Reload Nginx to apply SSL certificates
echo "Reloading Nginx to apply SSL certificates..."
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

# Clean up unused Docker resources
echo "Cleaning up unused Docker resources..."
docker system prune -af

echo "Deployment completed successfully!"
echo "Your application should now be running at https://${DOMAIN_NAME}"
echo ""
echo "To see logs, run: docker-compose -f docker-compose.prod.yml logs -f"
echo "To stop the application, run: docker-compose -f docker-compose.prod.yml down"
echo ""
echo "Note: Set up a cron job to renew SSL certificates:"
echo "0 0 1 * * cd /path/to/jsr && docker-compose -f docker-compose.prod.yml run --rm certbot renew && docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload" 