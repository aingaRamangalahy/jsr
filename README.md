# JSResources (JSR)

A comprehensive platform for curating and discovering JavaScript resources.

## Deployment Guide

### MongoDB Atlas Setup (For Production)

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. Create a new cluster (the free tier is sufficient to start)

3. Set up a database user with read/write permissions

4. Configure network access (IP whitelist):
   - For development: Add your current IP address
   - For production: Add your VPS/server IP address or use 0.0.0.0/0 for public access (less secure)

5. Get your connection string by clicking "Connect" > "Connect your application"
   - Replace `<username>`, `<password>`, and `<database>` with your actual values
   - This will be used as the `MONGODB_ATLAS_URI` environment variable

### Local Development with Docker

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/yourusername/jsr.git
   cd jsr
   ```

2. Create a `.env` file based on the provided example:
   ```bash
   cp env.example .env
   ```

3. Update the environment variables in the `.env` file with your own values.
   - For local development, you can use the built-in MongoDB container
   - For testing with Atlas, configure the `MONGODB_ATLAS_URI` variable

4. Start the development environment using Docker Compose:
   ```bash
   docker-compose up -d
   ```

5. Access the application:
   - Frontend: http://localhost:80
   - Admin Dashboard: http://localhost:80/admin
   - API: http://localhost:80/api
   - API Documentation: http://localhost:80/api-docs

### Production Deployment on DigitalOcean

1. Create a DigitalOcean Droplet with Ubuntu 22.04.

2. SSH into your Droplet:
   ```bash
   ssh root@your_server_ip
   ```

3. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/yourusername/jsr.git
   cd jsr
   ```

4. Update the environment variables:
   ```bash
   cp env.example .env
   nano .env
   ```
   
   Make sure to configure your MongoDB Atlas URI correctly:
   ```
   MONGODB_ATLAS_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   ```

5. Make the deployment script executable:
   ```bash
   chmod +x scripts/deploy-digitalocean.sh
   ```

6. Run the deployment script:
   ```bash
   ./scripts/deploy-digitalocean.sh
   ```

7. The script will:
   - Install Docker and Docker Compose if needed
   - Configure Nginx for SSL
   - Set up Let's Encrypt SSL certificates
   - Start all services in production mode

8. Access your production application at https://yourdomain.com

### GitHub Actions Deployment

The repository includes a GitHub Actions workflow that automatically deploys the application to your VPS when code is pushed to the master branch.

To use this workflow:

1. Add the following secrets to your GitHub repository:
   - `VPS_SSH_KEY`: Your private SSH key for accessing the server
   - `VPS_USER`: The username for SSH access (e.g., root)
   - `VPS_HOST`: The IP address or hostname of your VPS
   - `MONGODB_ATLAS_URI`: Your MongoDB Atlas connection string

2. Ensure your server is set up to accept the SSH key used in the GitHub Actions workflow.

3. Push to the master branch to trigger the deployment.

### SSL Certificate Renewal

The deployment script adds a reminder to set up a cron job for automatic SSL certificate renewal. To create this cron job, run:

```bash
crontab -e
```

Then add the following line:

```
0 0 1 * * cd /path/to/jsr && docker-compose -f docker-compose.prod.yml run --rm certbot renew && docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

This will renew your SSL certificates on the first day of each month. 