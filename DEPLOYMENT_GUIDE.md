# 🚀 House of Raw - Digital Ocean Deployment Guide

Complete guide to deploy your e-commerce platform on Digital Ocean with CI/CD pipelines.

## 📋 Architecture Overview

- **Domain:** houseofraw.tech
- **Server:** Digital Ocean Droplet (Ubuntu 22.04)
- **Frontend:** https://houseofraw.tech (React + Vite)
- **Backend API:** https://api.houseofraw.tech (Node.js + Express)
- **Database:** MongoDB Atlas
- **Web Server:** Nginx (reverse proxy)
- **SSL:** Let's Encrypt (Free)
- **CI/CD:** GitHub Actions
- **Process Manager:** PM2

---

## 🖥️ Step 1: Digital Ocean Droplet Setup

### 1.1 Create Droplet

1. Log in to [Digital Ocean](https://cloud.digitalocean.com)
2. Click **Create** → **Droplets**
3. Configure:
   - **Image:** Ubuntu 22.04 LTS x64
   - **Plan:** Basic Shared CPU
     - $12/month (2GB RAM, 1 CPU) - Recommended for production
     - $6/month (1GB RAM) - Minimum for testing
   - **Datacenter:** Choose closest to your target users
   - **Authentication:** SSH keys (recommended) or Password
   - **Hostname:** houseofraw-server
4. Click **Create Droplet**

### 1.2 Initial Server Configuration

Connect to your server:

```bash
ssh root@your-droplet-ip
```

Update system and install essentials:

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install certbot for SSL
apt install -y certbot python3-certbot-nginx

# Install Git
apt install -y git

# Install build essentials
apt install -y build-essential
```

### 1.3 Create Deploy User (Security Best Practice)

```bash
# Create deploy user
adduser deploy
usermod -aG sudo deploy

# Setup SSH for deploy user (optional but recommended)
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Switch to deploy user
su - deploy
```

---

## 🌐 Step 2: Domain Configuration

### 2.1 Configure DNS Records

Go to your domain registrar (where you bought houseofraw.tech) and add these DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | your-droplet-ip | 3600 |
| A | www | your-droplet-ip | 3600 |
| A | api | your-droplet-ip | 3600 |
| CNAME | www | @ | 3600 |

### 2.2 Verify DNS Propagation

```bash
# Check from your local machine
nslookup houseofraw.tech
nslookup www.houseofraw.tech
nslookup api.houseofraw.tech

# Or use online tools
# https://dnschecker.org
```

⏰ **Note:** DNS propagation can take 5-60 minutes.

---

## 📂 Step 3: Deploy Application Files

### 3.1 Setup Application Directory

```bash
# Create app directory
sudo mkdir -p /var/www/houseofraw
sudo chown -R deploy:deploy /var/www/houseofraw
cd /var/www/houseofraw
```

### 3.2 Clone Repository (First Time)

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/houseOfRaw.git .

# Or if using SSH
git clone git@github.com:YOUR_USERNAME/houseOfRaw.git .
```

### 3.3 Setup Backend

```bash
cd /var/www/houseofraw/backend

# Install dependencies
npm install --production

# Create environment file
nano .env
```

**Backend `.env` Configuration:**

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/houseofraw?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-immediately
JWT_EXPIRE=7d

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay Configuration (for payments)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Frontend URL
CLIENT_URL=https://houseofraw.tech
FRONTEND_URL=https://houseofraw.tech

# CORS Origins
ALLOWED_ORIGINS=https://houseofraw.tech,https://www.houseofraw.tech

# Email Configuration (if using)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@houseofraw.tech

# Admin Configuration
ADMIN_EMAIL=admin@houseofraw.tech
```

**Save and exit:** Press `CTRL+X`, then `Y`, then `Enter`

### 3.4 Start Backend with PM2

```bash
cd /var/www/houseofraw/backend

# Start application with PM2
pm2 start server.js --name houseofraw-api --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Copy and run the command shown
```

**Verify backend is running:**

```bash
pm2 status
pm2 logs houseofraw-api
curl http://localhost:5000
```

### 3.5 Build Frontend

```bash
cd /var/www/houseofraw/frontend

# Install dependencies
npm install

# Create frontend environment file
nano .env.production
```

**Frontend `.env.production` Configuration:**

```env
VITE_API_URL=https://api.houseofraw.tech
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
VITE_APP_NAME=House of Raw
```

**Build for production:**

```bash
npm run build
```

This creates an optimized `dist/` folder.

---

## ⚙️ Step 4: Nginx Configuration

### 4.1 Create Nginx Config

```bash
sudo nano /etc/nginx/sites-available/houseofraw
```

**Nginx Configuration:**

```nginx
# Frontend - houseofraw.tech
server {
    listen 80;
    listen [::]:80;
    server_name houseofraw.tech www.houseofraw.tech;

    root /var/www/houseofraw/frontend/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # Static assets - cache for 1 year
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service Worker - no cache
    location /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # React Router - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security - block common exploits
    location ~ /\. {
        deny all;
    }
}

# Backend API - api.houseofraw.tech
server {
    listen 80;
    listen [::]:80;
    server_name api.houseofraw.tech;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

    # Request size limit
    client_max_body_size 10M;

    # Proxy to Node.js backend
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://localhost:5000;
    }
}
```

### 4.2 Enable Site and Test

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/houseofraw /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx on boot
sudo systemctl enable nginx
```

**Test the setup:**

```bash
# Should show your frontend
curl -I http://houseofraw.tech

# Should show your backend
curl http://api.houseofraw.tech
```

---

## 🔒 Step 5: SSL Certificate Setup (HTTPS)

### 5.1 Install SSL Certificates

```bash
# For frontend domain
sudo certbot --nginx -d houseofraw.tech -d www.houseofraw.tech

# For backend API domain
sudo certbot --nginx -d api.houseofraw.tech
```

**Follow the prompts:**
1. Enter email address
2. Agree to Terms of Service: `Y`
3. Share email with EFF: `Y` or `N`
4. Choose option `2` (Redirect HTTP to HTTPS)

### 5.2 Verify SSL

Visit:
- ✅ https://houseofraw.tech
- ✅ https://www.houseofraw.tech
- ✅ https://api.houseofraw.tech

### 5.3 Auto-Renewal Setup

Certbot automatically sets up renewal. Test it:

```bash
# Test renewal
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot.timer
```

SSL certificates auto-renew every 60 days.

---

## 🔄 Step 6: CI/CD with GitHub Actions

### 6.1 Generate SSH Key for Deployment

On your **Digital Ocean server**:

```bash
# As deploy user
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github-actions
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github-actions  # Copy this private key
```

### 6.2 Add Secrets to GitHub

Go to your GitHub repository:
1. **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**

Add these secrets:

| Secret Name | Value |
|------------|--------|
| `DEPLOY_HOST` | Your droplet IP address |
| `DEPLOY_USER` | `deploy` |
| `DEPLOY_KEY` | Private key from step 6.1 |
| `DEPLOY_PATH` | `/var/www/houseofraw` |

### 6.3 Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to Digital Ocean

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy Application
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: |
            frontend/package-lock.json
            backend/package-lock.json

      - name: Build Frontend
        run: |
          cd frontend
          npm ci
          npm run build
        env:
          VITE_API_URL: https://api.houseofraw.tech
          VITE_RAZORPAY_KEY_ID: ${{ secrets.RAZORPAY_KEY_ID }}

      - name: Deploy to Server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd ${{ secrets.DEPLOY_PATH }}
            
            # Pull latest code
            git pull origin main
            
            # Deploy Backend
            cd backend
            npm install --production
            pm2 restart houseofraw-api || pm2 start server.js --name houseofraw-api
            
            # Deploy Frontend
            cd ../frontend
            npm install
            npm run build
            
            # Restart Nginx (optional)
            sudo systemctl reload nginx
            
            # Show status
            pm2 status

      - name: Notify Deployment
        if: always()
        run: |
          if [ ${{ job.status }} == 'success' ]; then
            echo "✅ Deployment successful!"
          else
            echo "❌ Deployment failed!"
          fi
```

### 6.4 Alternative: Separate Build & Deploy

Create `.github/workflows/deploy-production.yml`:

```yaml
name: Production Deployment

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-frontend:
    name: Build Frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Build
        working-directory: ./frontend
        run: |
          npm ci
          npm run build
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: frontend-build
          path: frontend/dist

  deploy:
    name: Deploy to Production
    needs: build-frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Download frontend build
        uses: actions/download-artifact@v3
        with:
          name: frontend-build
          path: frontend/dist

      - name: Deploy via SSH
        uses: appleboy/scp-action@v0.1.4
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          source: "frontend/dist/*"
          target: ${{ secrets.DEPLOY_PATH }}
          strip_components: 2

      - name: Restart Backend
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd ${{ secrets.DEPLOY_PATH }}/backend
            git pull origin main
            npm install --production
            pm2 restart houseofraw-api
            pm2 status
```

### 6.5 Test CI/CD Pipeline

```bash
# On your local machine
git add .
git commit -m "Setup CI/CD deployment"
git push origin main

# Check GitHub Actions tab in your repository
# Monitor the deployment progress
```

---

## 💾 Step 7: MongoDB Configuration

Since you're likely using MongoDB Atlas (based on your config files):

### 7.1 MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Network Access** → **Add IP Address**
   - Add your Digital Ocean droplet IP
   - Or add `0.0.0.0/0` (allow from anywhere - less secure)
3. **Database Access** → Create database user
4. Get connection string
5. Update `MONGODB_URI` in `/var/www/houseofraw/backend/.env`

### 7.2 Alternative: MongoDB on Same Server

If you want MongoDB on the same droplet:

```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
sudo systemctl status mongod
```

Update `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/houseofraw
```

---

## 🔥 Step 8: Firewall Configuration

```bash
# Enable UFW firewall
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Check status
sudo ufw status
```

---

## 📊 Step 9: Monitoring & Logging

### 9.1 PM2 Monitoring

```bash
# View logs
pm2 logs houseofraw-api

# Monitor in real-time
pm2 monit

# View status
pm2 status

# Restart if needed
pm2 restart houseofraw-api

# View detailed info
pm2 info houseofraw-api
```

### 9.2 Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log

# Specific domain logs (if configured)
sudo tail -f /var/log/nginx/houseofraw-access.log
sudo tail -f /var/log/nginx/houseofraw-error.log
```

### 9.3 System Monitoring

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top
# or
htop  # Install: sudo apt install htop

# Check running processes
ps aux | grep node
```

### 9.4 Setup PM2 Monitoring Dashboard (Optional)

```bash
# Link PM2 to monitoring service
pm2 link <secret-key> <public-key>

# Or use PM2 Plus
# Visit: https://app.pm2.io
```

---

## 🔄 Step 10: Update Workflow (Future Deployments)

### Option A: Automatic (via CI/CD)

Just push to main branch:

```bash
# On your local machine
git add .
git commit -m "Your update message"
git push origin main

# GitHub Actions will automatically deploy
```

### Option B: Manual Deployment

```bash
# SSH to server
ssh deploy@your-droplet-ip

cd /var/www/houseofraw

# Pull latest code
git pull origin main

# Update Backend
cd backend
npm install --production
pm2 restart houseofraw-api

# Update Frontend
cd ../frontend
npm install
npm run build

# Verify
pm2 status
curl https://api.houseofraw.tech
curl https://houseofraw.tech
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend loads: https://houseofraw.tech
- [ ] WWW redirect works: https://www.houseofraw.tech
- [ ] Backend API responds: https://api.houseofraw.tech
- [ ] SSL certificates show green padlock 🔒
- [ ] User registration works
- [ ] User login works
- [ ] Product listing displays
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Payment gateway (Razorpay) works
- [ ] Admin panel accessible
- [ ] Image uploads work (Cloudinary)
- [ ] Mobile responsive
- [ ] Browser console shows no errors

---

## 🛠️ Common Issues & Solutions

### Issue 1: Site Not Loading

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Issue 2: API Not Responding

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs houseofraw-api

# Restart backend
pm2 restart houseofraw-api
```

### Issue 3: SSL Certificate Error

```bash
# Renew certificates manually
sudo certbot renew --force-renewal

# Check certificate expiry
sudo certbot certificates
```

### Issue 4: MongoDB Connection Failed

```bash
# Check .env file
cat /var/www/houseofraw/backend/.env | grep MONGODB_URI

# Test connection
# In Node.js console or create test script
```

### Issue 5: 502 Bad Gateway

```bash
# Backend might be down
pm2 restart houseofraw-api

# Check if backend is listening on correct port
netstat -tlnp | grep 5000

# Check backend logs
pm2 logs houseofraw-api --lines 100
```

### Issue 6: CORS Errors

Update backend `.env`:
```env
ALLOWED_ORIGINS=https://houseofraw.tech,https://www.houseofraw.tech
CLIENT_URL=https://houseofraw.tech
```

Restart backend:
```bash
pm2 restart houseofraw-api
```

---

## 🔐 Security Best Practices

1. **Keep System Updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Use Strong Passwords**
   - Database passwords
   - JWT secrets
   - API keys

3. **Environment Variables**
   - Never commit `.env` to Git
   - Use different secrets for production

4. **Firewall**
   - Only open necessary ports
   - Use UFW or Digital Ocean firewall

5. **SSH Security**
   - Disable root login
   - Use SSH keys instead of passwords
   - Change default SSH port (optional)

6. **Regular Backups**
   ```bash
   # Backup MongoDB
   mongodump --uri="your-mongodb-uri" --out=/backup/$(date +%Y%m%d)
   
   # Backup files
   tar -czf /backup/houseofraw-$(date +%Y%m%d).tar.gz /var/www/houseofraw
   ```

7. **Rate Limiting**
   - Already configured in Nginx
   - Consider adding rate limiting in backend

---

## 📈 Performance Optimization

### Enable HTTP/2

Edit Nginx config:
```nginx
listen 443 ssl http2;
```

### Enable Brotli Compression (Better than Gzip)

```bash
# Install
sudo apt install nginx-module-brotli

# Add to Nginx config
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml+rss text/javascript;
```

### CDN Setup (Optional)

Consider using:
- Cloudflare (Free tier available)
- Digital Ocean Spaces CDN
- Amazon CloudFront

### Database Indexing

Ensure proper indexes in MongoDB for:
- Product searches
- User lookups
- Order queries

---

## 📞 Support & Maintenance

### Useful Commands Reference

```bash
# Server status
systemctl status nginx
pm2 status

# View logs
pm2 logs houseofraw-api
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart houseofraw-api
sudo systemctl restart nginx

# Check resources
df -h        # Disk space
free -h      # Memory
top          # CPU & processes

# Update application
cd /var/www/houseofraw
git pull
pm2 restart houseofraw-api
```

---

## 🎉 Congratulations!

Your **House of Raw** e-commerce platform is now live at:
- 🌐 **Frontend:** https://houseofraw.tech
- 🔌 **API:** https://api.houseofraw.tech

**Next Steps:**
1. Test all features thoroughly
2. Set up monitoring and alerts
3. Configure regular backups
4. Optimize performance based on real usage
5. Set up analytics (Google Analytics, etc.)

---

## 📚 Additional Resources

- [Digital Ocean Documentation](https://docs.digitalocean.com)
- [PM2 Documentation](https://pm2.keymetrics.io/docs)
- [Nginx Documentation](https://nginx.org/en/docs)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Need Help?** Contact your system administrator or refer to the troubleshooting section above.
