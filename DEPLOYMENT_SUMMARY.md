# 🎉 House of Raw - Deployment Setup Complete!

## 📦 What I've Created For You

I've set up a complete deployment infrastructure for your House of Raw e-commerce project on Digital Ocean with CI/CD pipelines, SSL certificates, and comprehensive documentation.

### 📚 Documentation Files

1. **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete step-by-step deployment guide
   - Digital Ocean setup
   - Domain configuration
   - Backend & frontend deployment
   - Nginx configuration
   - SSL setup with Let's Encrypt
   - MongoDB configuration
   - Monitoring & troubleshooting

2. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick commands & troubleshooting
   - Common commands
   - GitHub secrets setup
   - DNS configuration
   - Troubleshooting guide
   - Backup procedures

3. **[DEPLOYMENT_README.md](DEPLOYMENT_README.md)** - Architecture & overview
   - System architecture diagram
   - File structure
   - Prerequisites
   - CI/CD workflow diagram

4. **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Complete deployment checklist
   - Pre-deployment tasks
   - Server setup steps
   - Testing procedures
   - Post-deployment verification

### 🔧 Configuration Files

1. **`.github/workflows/deploy-production.yml`** - Automatic deployment via GitHub Actions
   - Builds frontend
   - Deploys to Digital Ocean via SSH
   - Restarts backend
   - Triggers on push to main branch

2. **`.github/workflows/test.yml`** - Automated testing workflow
   - Runs on pull requests
   - Tests backend and frontend
   - Lint checks

3. **`config/nginx.conf`** - Complete Nginx configuration
   - Frontend serving
   - Backend reverse proxy
   - SSL configuration
   - Security headers
   - Gzip compression
   - Rate limiting

4. **`backend/ecosystem.config.js`** - PM2 process manager configuration
   - Auto-restart on failure
   - Memory management
   - Logging configuration
   - Environment management

5. **`backend/.env.example`** - Backend environment template
   - All required variables documented
   - Examples and instructions

6. **`frontend/.env.example`** - Frontend environment template
   - API URL configuration
   - Razorpay key setup

### 🚀 Deployment Scripts

1. **`scripts/server-setup.sh`** - Automated server setup (Linux)
   - Installs all dependencies
   - Creates deploy user
   - Configures firewall
   - Sets up directories

2. **`scripts/deploy.sh`** - Manual deployment script (Linux/Mac)
   - Builds and deploys application
   - Restarts services

3. **`scripts/deploy.bat`** - Manual deployment script (Windows)
   - Same functionality for Windows users

---

## 🚀 Quick Start Guide

### Step 1: Purchase & Setup

1. **Buy Domain**: Purchase `houseofraw.tech` from any domain registrar
2. **Create Droplet**: 
   - Go to [Digital Ocean](https://digitalocean.com)
   - Create Ubuntu 22.04 droplet (minimum 2GB RAM)
   - Note your droplet IP address

### Step 2: Configure DNS

Add these DNS records in your domain registrar:

```
Type    Name    Value               TTL
A       @       your-droplet-ip     3600
A       www     your-droplet-ip     3600
A       api     your-droplet-ip     3600
```

Wait 5-60 minutes for DNS propagation.

### Step 3: Setup Server

```bash
# SSH to your droplet
ssh root@your-droplet-ip

# Download and run setup script
wget https://raw.githubusercontent.com/YOUR_USERNAME/houseOfRaw/main/scripts/server-setup.sh
sudo bash server-setup.sh
```

This installs Node.js, PM2, Nginx, Certbot, and creates the deploy user.

### Step 4: Deploy Application

```bash
# Switch to deploy user
su - deploy

# Clone repository
cd /var/www/houseofraw
git clone https://github.com/YOUR_USERNAME/houseOfRaw.git .

# Setup backend
cd backend
cp .env.example .env
nano .env  # Fill in your values
npm install --production
pm2 start server.js --name houseofraw-api
pm2 save
pm2 startup  # Run the command it shows

# Build frontend
cd ../frontend
npm install
npm run build
```

### Step 5: Configure Nginx

```bash
# Copy Nginx configuration
sudo cp /var/www/houseofraw/config/nginx.conf /etc/nginx/sites-available/houseofraw

# Enable site
sudo ln -s /etc/nginx/sites-available/houseofraw /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Setup SSL (Free)

```bash
# For frontend
sudo certbot --nginx -d houseofraw.tech -d www.houseofraw.tech

# For backend API
sudo certbot --nginx -d api.houseofraw.tech
```

Choose option 2 (Redirect HTTP to HTTPS).

### Step 7: Setup CI/CD

1. **Generate SSH key on server:**
   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github-actions
   cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys
   cat ~/.ssh/github-actions  # Copy this private key
   ```

2. **Add GitHub Secrets:**
   - Go to GitHub → Your Repo → Settings → Secrets → Actions
   - Add these secrets:
     - `DEPLOY_HOST`: Your droplet IP
     - `DEPLOY_USER`: `deploy`
     - `DEPLOY_KEY`: Private key from step 1
     - `DEPLOY_PATH`: `/var/www/houseofraw`
     - `RAZORPAY_KEY_ID`: Your Razorpay key

3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Setup CI/CD"
   git push origin main
   ```

Now every push to main branch automatically deploys! 🎉

---

## 🌐 Your URLs

After deployment:

- **Frontend**: https://houseofraw.tech
- **Backend API**: https://api.houseofraw.tech
- **Admin Panel**: https://houseofraw.tech/admin

---

## 🔑 Required Accounts & Keys

Before deploying, get these accounts/keys:

### 1. MongoDB Atlas (Free)
- Go to [mongodb.com/atlas](https://mongodb.com/atlas)
- Create free cluster
- Create database user
- Get connection string
- Add droplet IP to whitelist

### 2. Cloudinary (Free)
- Go to [cloudinary.com](https://cloudinary.com)
- Sign up for free account
- Get: Cloud Name, API Key, API Secret
- Used for image uploads

### 3. Razorpay (Payment Gateway)
- Go to [razorpay.com](https://razorpay.com)
- Sign up and verify account
- Get: Key ID and Key Secret
- Use test mode for development

---

## 📋 Environment Variables Needed

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...  # From MongoDB Atlas
JWT_SECRET=your-random-secret  # Generate: openssl rand -base64 32
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
CLIENT_URL=https://houseofraw.tech
ALLOWED_ORIGINS=https://houseofraw.tech,https://www.houseofraw.tech
```

### Frontend (.env.production)
```env
VITE_API_URL=https://api.houseofraw.tech
VITE_RAZORPAY_KEY_ID=...
VITE_APP_NAME=House of Raw
```

---

## 🛠️ Common Commands

### On Server

```bash
# SSH to server
ssh deploy@your-droplet-ip

# Check backend status
pm2 status
pm2 logs houseofraw-api

# Restart backend
pm2 restart houseofraw-api

# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# View logs
pm2 logs houseofraw-api
sudo tail -f /var/log/nginx/error.log

# Update application
cd /var/www/houseofraw
git pull origin main
cd backend && npm install --production
pm2 restart houseofraw-api
cd ../frontend && npm run build
```

### On Local Machine

```bash
# Deploy via GitHub Actions (automatic)
git add .
git commit -m "Your changes"
git push origin main

# Or deploy manually
./scripts/deploy.sh  # Linux/Mac
scripts\deploy.bat   # Windows
```

---

## 🔒 SSL Certificate (Free & Automatic)

Your SSL certificates from Let's Encrypt:
- ✅ Free forever
- ✅ Auto-renews every 60 days
- ✅ Trusted by all browsers
- ✅ A+ rating on SSL Labs

Check renewal:
```bash
sudo certbot renew --dry-run
```

---

## 📊 What's Included

### ✅ Features
- Automatic HTTPS (SSL)
- Automatic deployments (CI/CD)
- Process management (PM2)
- Auto-restart on crash
- Log management
- Security headers
- Rate limiting
- Gzip compression
- Static file caching
- CORS protection
- Firewall (UFW)

### ✅ Monitoring
- PM2 monitoring
- Nginx logs
- Application logs
- Server resource monitoring

### ✅ Security
- SSL/TLS encryption
- Security headers
- Rate limiting
- Firewall configured
- SSH key authentication
- Environment variables secured

---

## 📖 Documentation Guide

**Read in this order:**

1. Start here: [DEPLOYMENT_README.md](DEPLOYMENT_README.md) - Overview
2. Follow this: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Step-by-step
3. Check off: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Don't miss anything
4. Reference: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Commands & troubleshooting

---

## 🆘 Need Help?

### Issue: Site not loading
```bash
sudo systemctl restart nginx
pm2 restart houseofraw-api
```

### Issue: API not responding
```bash
pm2 logs houseofraw-api
pm2 restart houseofraw-api
```

### Issue: SSL problems
```bash
sudo certbot certificates
sudo certbot renew --force-renewal
```

### Check logs:
```bash
# Backend logs
pm2 logs houseofraw-api

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# System logs
journalctl -xe
```

---

## 💰 Estimated Costs

- **Domain**: $10-15/year (one-time purchase)
- **Digital Ocean Droplet**: $12/month (2GB RAM recommended)
- **MongoDB Atlas**: FREE (512MB tier)
- **Cloudinary**: FREE (25GB storage, 25GB bandwidth)
- **SSL Certificate**: FREE (Let's Encrypt)
- **Razorpay**: FREE (transaction fees only)

**Total: ~$144/year for hosting + domain** 💸

---

## 🎯 Next Steps

1. ✅ Review [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. ✅ Purchase domain `houseofraw.tech`
3. ✅ Create Digital Ocean droplet
4. ✅ Configure DNS records
5. ✅ Run server setup script
6. ✅ Deploy application
7. ✅ Setup SSL certificates
8. ✅ Configure CI/CD
9. ✅ Test all features
10. ✅ Go live! 🚀

---

## 📞 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                 houseofraw.tech (Domain)                │
│                   ↓ (DNS A Records)                     │
│              Digital Ocean Droplet                       │
│            Ubuntu 22.04 (2GB RAM)                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Nginx (Port 80/443)                     │  │
│  │  - Reverse Proxy                                  │  │
│  │  - SSL Termination (Let's Encrypt)               │  │
│  │  - Static Files                                   │  │
│  └────────┬───────────────────────┬──────────────────┘  │
│           ↓                       ↓                      │
│  ┌────────────────┐      ┌─────────────────────────┐    │
│  │   Frontend     │      │   Backend API           │    │
│  │   React+Vite   │      │   Node.js + Express     │    │
│  │   /dist/       │      │   Port 5000 (PM2)       │    │
│  └────────────────┘      └──────────┬──────────────┘    │
└──────────────────────────────────────┼───────────────────┘
                                       ↓
                    ┌──────────────────────────────┐
                    │  MongoDB Atlas (Cloud)       │
                    │  Cloudinary (Images)         │
                    │  Razorpay (Payments)         │
                    └──────────────────────────────┘
```

---

## 🎉 You're Ready to Deploy!

All the documentation and scripts are ready. Follow the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) step by step, and you'll have your e-commerce platform live on `houseofraw.tech` with:

- ✅ HTTPS encryption
- ✅ Automatic deployments
- ✅ Professional setup
- ✅ Production-ready

**Good luck with your deployment! 🚀**

---

**Created:** January 2026  
**Project:** House of Raw E-commerce Platform  
**Domain:** houseofraw.tech  
**Documentation Version:** 1.0
