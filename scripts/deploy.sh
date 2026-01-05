#!/bin/bash

# =================================================
# House of Raw - Deployment Script
# =================================================
# This script deploys the application to Digital Ocean
# Run this script from your local machine after setting up SSH access

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVER_USER="deploy"
SERVER_HOST="your-droplet-ip"  # Change this
DEPLOY_PATH="/var/www/houseofraw"
BRANCH="main"

echo -e "${GREEN}🚀 Starting deployment to Digital Ocean...${NC}\n"

# Function to print section headers
print_section() {
    echo -e "\n${YELLOW}=== $1 ===${NC}"
}

# Check if SSH connection works
print_section "Checking SSH Connection"
if ssh -o ConnectTimeout=5 ${SERVER_USER}@${SERVER_HOST} "echo 'SSH connection successful'" &>/dev/null; then
    echo -e "${GREEN}✅ SSH connection successful${NC}"
else
    echo -e "${RED}❌ SSH connection failed. Check your credentials.${NC}"
    exit 1
fi

# Build frontend locally
print_section "Building Frontend Locally"
cd frontend
npm install
npm run build
echo -e "${GREEN}✅ Frontend built successfully${NC}"
cd ..

# Deploy to server
print_section "Deploying to Server"
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
    set -e
    
    echo "📂 Navigating to deployment directory..."
    cd /var/www/houseofraw
    
    echo "🔄 Pulling latest code..."
    git fetch origin
    git checkout main
    git pull origin main
    
    echo "🔧 Deploying Backend..."
    cd backend
    npm install --production
    pm2 restart houseofraw-api || pm2 start server.js --name houseofraw-api --env production
    
    echo "🎨 Deploying Frontend..."
    cd ../frontend
    npm install
    npm run build
    
    echo "🔄 Reloading Nginx..."
    sudo systemctl reload nginx
    
    echo "📊 Checking PM2 Status..."
    pm2 status
    
    echo "✅ Deployment completed successfully!"
ENDSSH

print_section "Verifying Deployment"
echo "Checking frontend..."
curl -I https://houseofraw.tech 2>/dev/null | head -n 1

echo "Checking backend API..."
curl -I https://api.houseofraw.tech 2>/dev/null | head -n 1

echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Frontend: https://houseofraw.tech${NC}"
echo -e "${GREEN}🔌 Backend API: https://api.houseofraw.tech${NC}"
