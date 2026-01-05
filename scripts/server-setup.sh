#!/bin/bash

# ================================================================
# House of Raw - Server Setup Script
# ================================================================
# This script sets up a fresh Ubuntu 22.04 server for deployment
# Run this script on your Digital Ocean droplet after first login
# 
# Usage: sudo bash server-setup.sh

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOY_USER="deploy"
APP_DIR="/var/www/houseofraw"
DOMAIN="houseofraw.tech"
API_DOMAIN="api.houseofraw.tech"
NODE_VERSION="20"

echo -e "${GREEN}"
echo "================================================================"
echo "   House of Raw - Server Setup Script"
echo "================================================================"
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Error: This script must be run as root (use sudo)${NC}"
    exit 1
fi

print_section() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# ================================================================
# 1. System Update
# ================================================================
print_section "Step 1: Updating System"
apt update && apt upgrade -y
print_success "System updated"

# ================================================================
# 2. Install Node.js
# ================================================================
print_section "Step 2: Installing Node.js ${NODE_VERSION}.x"
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt install -y nodejs
node_version=$(node --version)
npm_version=$(npm --version)
print_success "Node.js ${node_version} and npm ${npm_version} installed"

# ================================================================
# 3. Install PM2
# ================================================================
print_section "Step 3: Installing PM2"
npm install -g pm2
pm2_version=$(pm2 --version)
print_success "PM2 ${pm2_version} installed"

# ================================================================
# 4. Install Nginx
# ================================================================
print_section "Step 4: Installing Nginx"
apt install -y nginx
systemctl enable nginx
systemctl start nginx
nginx_version=$(nginx -v 2>&1 | awk '{print $3}')
print_success "Nginx ${nginx_version} installed and started"

# ================================================================
# 5. Install Certbot (SSL)
# ================================================================
print_section "Step 5: Installing Certbot"
apt install -y certbot python3-certbot-nginx
certbot_version=$(certbot --version 2>&1 | awk '{print $2}')
print_success "Certbot ${certbot_version} installed"

# ================================================================
# 6. Install Git
# ================================================================
print_section "Step 6: Installing Git"
apt install -y git
git_version=$(git --version | awk '{print $3}')
print_success "Git ${git_version} installed"

# ================================================================
# 7. Install Build Essentials
# ================================================================
print_section "Step 7: Installing Build Essentials"
apt install -y build-essential
print_success "Build essentials installed"

# ================================================================
# 8. Create Deploy User
# ================================================================
print_section "Step 8: Creating Deploy User"
if id "$DEPLOY_USER" &>/dev/null; then
    print_success "User $DEPLOY_USER already exists"
else
    adduser --disabled-password --gecos "" $DEPLOY_USER
    usermod -aG sudo $DEPLOY_USER
    print_success "User $DEPLOY_USER created"
fi

# Setup SSH for deploy user
if [ -d "/root/.ssh" ]; then
    mkdir -p /home/$DEPLOY_USER/.ssh
    cp /root/.ssh/authorized_keys /home/$DEPLOY_USER/.ssh/ 2>/dev/null || true
    chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
    chmod 700 /home/$DEPLOY_USER/.ssh
    chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys 2>/dev/null || true
    print_success "SSH keys copied to deploy user"
fi

# Allow deploy user to reload nginx without password
echo "$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/sbin/nginx, /bin/systemctl reload nginx, /bin/systemctl restart nginx, /bin/systemctl status nginx" >> /etc/sudoers.d/deploy-nginx
chmod 0440 /etc/sudoers.d/deploy-nginx
print_success "Sudo permissions configured for deploy user"

# ================================================================
# 9. Create Application Directory
# ================================================================
print_section "Step 9: Creating Application Directory"
mkdir -p $APP_DIR
mkdir -p $APP_DIR/logs
chown -R $DEPLOY_USER:$DEPLOY_USER $APP_DIR
print_success "Application directory created at $APP_DIR"

# ================================================================
# 10. Configure Firewall (UFW)
# ================================================================
print_section "Step 10: Configuring Firewall"
apt install -y ufw
ufw --force enable
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
print_success "Firewall configured and enabled"

# ================================================================
# 11. Install Utilities
# ================================================================
print_section "Step 11: Installing Utilities"
apt install -y htop curl wget vim nano unzip
print_success "Utilities installed"

# ================================================================
# 12. Optional: Install MongoDB (Local)
# ================================================================
print_section "Step 12: MongoDB Installation (Optional)"
read -p "Do you want to install MongoDB locally? (y/n): " install_mongo
if [[ $install_mongo == "y" || $install_mongo == "Y" ]]; then
    wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    apt update
    apt install -y mongodb-org
    systemctl enable mongod
    systemctl start mongod
    print_success "MongoDB installed and started"
else
    echo "Skipping MongoDB installation (will use MongoDB Atlas)"
fi

# ================================================================
# 13. Security Hardening
# ================================================================
print_section "Step 13: Security Hardening"

# Disable root SSH login (optional)
# sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# systemctl restart sshd

# Set timezone
timedatectl set-timezone UTC
print_success "Timezone set to UTC"

# ================================================================
# Summary
# ================================================================
echo -e "\n${GREEN}"
echo "================================================================"
echo "   Server Setup Complete!"
echo "================================================================"
echo -e "${NC}"
echo ""
echo "Next Steps:"
echo ""
echo "1. Clone your repository:"
echo "   su - $DEPLOY_USER"
echo "   cd $APP_DIR"
echo "   git clone https://github.com/YOUR_USERNAME/houseOfRaw.git ."
echo ""
echo "2. Setup backend:"
echo "   cd backend"
echo "   nano .env  # Add your environment variables"
echo "   npm install --production"
echo "   pm2 start server.js --name houseofraw-api"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "3. Build frontend:"
echo "   cd ../frontend"
echo "   npm install"
echo "   npm run build"
echo ""
echo "4. Configure Nginx:"
echo "   sudo nano /etc/nginx/sites-available/houseofraw"
echo "   # Copy the configuration from config/nginx.conf"
echo "   sudo ln -s /etc/nginx/sites-available/houseofraw /etc/nginx/sites-enabled/"
echo "   sudo nginx -t"
echo "   sudo systemctl reload nginx"
echo ""
echo "5. Setup SSL certificates:"
echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "   sudo certbot --nginx -d $API_DOMAIN"
echo ""
echo -e "${BLUE}Server is ready for deployment!${NC}"
echo ""
