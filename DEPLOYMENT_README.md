# 🌐 House of Raw - Deployment Documentation

Complete deployment documentation for the House of Raw e-commerce platform.

## 📚 Documentation Files

This repository contains comprehensive deployment guides:

### 1. **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Main Deployment Guide
Complete step-by-step guide for deploying to Digital Ocean with SSL, CI/CD, and monitoring.

**Contents:**
- Digital Ocean droplet setup
- Domain configuration
- Backend & frontend deployment
- Nginx configuration
- SSL certificate setup (Let's Encrypt)
- CI/CD with GitHub Actions
- MongoDB setup
- Security & monitoring

### 2. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick Reference Guide
Quick commands and troubleshooting guide for daily operations.

**Contents:**
- Common commands reference
- GitHub secrets setup
- DNS configuration
- Troubleshooting commands
- Monitoring commands
- Backup procedures

---

## 🚀 Quick Start

### For First-Time Deployment:

1. **Read the full guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. **Setup server:** Run `scripts/server-setup.sh` on your Digital Ocean droplet
3. **Configure DNS:** Point your domain to droplet IP
4. **Setup GitHub Actions:** Add secrets as described in QUICK_REFERENCE.md
5. **Deploy:** Push to main branch or run `scripts/deploy.sh`

### For Updates:

```bash
# Automatic (via CI/CD)
git push origin main

# Manual
ssh deploy@your-droplet-ip
cd /var/www/houseofraw
git pull
pm2 restart houseofraw-api
cd frontend && npm run build
```

---

## 📁 Deployment Files Structure

```
houseOfRaw/
├── .github/
│   └── workflows/
│       ├── deploy-production.yml    # Main CI/CD workflow
│       └── test.yml                 # Testing workflow
├── backend/
│   ├── .env.example                 # Backend environment template
│   └── ecosystem.config.js          # PM2 configuration
├── frontend/
│   └── .env.example                 # Frontend environment template
├── config/
│   └── nginx.conf                   # Nginx configuration template
├── scripts/
│   ├── server-setup.sh              # Initial server setup script
│   ├── deploy.sh                    # Manual deployment script (Linux/Mac)
│   └── deploy.bat                   # Manual deployment script (Windows)
├── DEPLOYMENT_GUIDE.md              # Complete deployment guide
├── QUICK_REFERENCE.md               # Quick reference & commands
└── DEPLOYMENT_README.md             # This file
```

---

## 🔑 Prerequisites

Before deploying, ensure you have:

- [ ] **Digital Ocean Account** - Sign up at [digitalocean.com](https://digitalocean.com)
- [ ] **Domain Name** - Purchase houseofraw.tech
- [ ] **GitHub Repository** - Your code repository
- [ ] **MongoDB Atlas** - Free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
- [ ] **Cloudinary Account** - For image uploads [cloudinary.com](https://cloudinary.com)
- [ ] **Razorpay Account** - For payments [razorpay.com](https://razorpay.com)

---

## ⚙️ Environment Variables

### Backend Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RAZORPAY_KEY_ID=your-razorpay-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
CLIENT_URL=https://houseofraw.tech
ALLOWED_ORIGINS=https://houseofraw.tech,https://www.houseofraw.tech
```

### Frontend Environment Variables

Copy `frontend/.env.example` to `frontend/.env.production`:

```env
VITE_API_URL=https://api.houseofraw.tech
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
VITE_APP_NAME=House of Raw
```

---

## 🔐 GitHub Secrets

Add these secrets in GitHub → Settings → Secrets → Actions:

| Secret | Description |
|--------|-------------|
| `DEPLOY_HOST` | Your Digital Ocean droplet IP |
| `DEPLOY_USER` | SSH username (usually `deploy`) |
| `DEPLOY_KEY` | SSH private key for authentication |
| `DEPLOY_PATH` | Application path (`/var/www/houseofraw`) |
| `RAZORPAY_KEY_ID` | Razorpay public key |

---

## 🌐 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    houseofraw.tech                      │
│                    (Domain Registrar)                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ DNS A Records
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Digital Ocean Droplet                      │
│              Ubuntu 22.04 LTS                          │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Nginx (Port 80/443)                 │  │
│  │  - Reverse Proxy                                 │  │
│  │  - SSL Termination (Let's Encrypt)              │  │
│  │  - Static File Serving                          │  │
│  └─────────┬────────────────────┬───────────────────┘  │
│            │                    │                       │
│            ▼                    ▼                       │
│  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   Frontend      │  │   Backend API               │  │
│  │   (React+Vite)  │  │   (Node.js + Express)       │  │
│  │   Port: N/A     │  │   Port: 5000                │  │
│  │   /dist/        │  │   Managed by PM2            │  │
│  └─────────────────┘  └──────────┬──────────────────┘  │
│                                   │                     │
└───────────────────────────────────┼─────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────┐
                    │   MongoDB Atlas           │
                    │   (Cloud Database)        │
                    └───────────────────────────┘
                    ┌───────────────────────────┐
                    │   Cloudinary              │
                    │   (Image Storage)         │
                    └───────────────────────────┘
                    ┌───────────────────────────┐
                    │   Razorpay                │
                    │   (Payment Gateway)       │
                    └───────────────────────────┘
```

---

## 🔄 CI/CD Workflow

```
Developer          GitHub               Digital Ocean
    │                 │                      │
    │   git push      │                      │
    ├────────────────►│                      │
    │                 │                      │
    │                 │  GitHub Actions      │
    │                 │  - Build frontend    │
    │                 │  - Run tests         │
    │                 │  - Deploy via SSH    │
    │                 ├─────────────────────►│
    │                 │                      │
    │                 │                      │  Pull code
    │                 │                      │  Install deps
    │                 │                      │  Build frontend
    │                 │                      │  Restart PM2
    │                 │                      │  Reload Nginx
    │                 │                      │
    │                 │  Success/Failure     │
    │                 │◄─────────────────────┤
    │                 │                      │
    │   Notification  │                      │
    │◄────────────────┤                      │
    │                 │                      │
```

---

## 🛠️ Manual Deployment Steps

### Initial Setup (One-time)

1. **Create Digital Ocean Droplet**
   ```bash
   # Choose Ubuntu 22.04, minimum 2GB RAM
   ```

2. **Run Server Setup Script**
   ```bash
   ssh root@your-droplet-ip
   wget https://raw.githubusercontent.com/YOUR_USERNAME/houseOfRaw/main/scripts/server-setup.sh
   sudo bash server-setup.sh
   ```

3. **Clone Repository**
   ```bash
   su - deploy
   cd /var/www/houseofraw
   git clone https://github.com/YOUR_USERNAME/houseOfRaw.git .
   ```

4. **Configure Backend**
   ```bash
   cd backend
   cp .env.example .env
   nano .env  # Fill in your values
   npm install --production
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

5. **Build Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run build
   ```

6. **Configure Nginx**
   ```bash
   sudo cp /var/www/houseofraw/config/nginx.conf /etc/nginx/sites-available/houseofraw
   sudo ln -s /etc/nginx/sites-available/houseofraw /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

7. **Setup SSL**
   ```bash
   sudo certbot --nginx -d houseofraw.tech -d www.houseofraw.tech
   sudo certbot --nginx -d api.houseofraw.tech
   ```

### Future Updates

```bash
# SSH to server
ssh deploy@your-droplet-ip

# Pull latest code
cd /var/www/houseofraw
git pull origin main

# Update backend
cd backend
npm install --production
pm2 restart houseofraw-api

# Update frontend
cd ../frontend
npm install
npm run build
```

---

## 📊 Monitoring

### View Logs

```bash
# PM2 logs
pm2 logs houseofraw-api

# Nginx access logs
sudo tail -f /var/log/nginx/houseofraw-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/houseofraw-error.log
```

### Check Status

```bash
# PM2 status
pm2 status

# Nginx status
sudo systemctl status nginx

# System resources
htop
df -h
free -h
```

---

## 🔒 Security Features

- ✅ **SSL/TLS Encryption** - Let's Encrypt certificates
- ✅ **Firewall** - UFW configured (ports 22, 80, 443)
- ✅ **Rate Limiting** - Nginx rate limiting for API
- ✅ **CORS Protection** - Configured origins
- ✅ **Security Headers** - X-Frame-Options, XSS Protection, etc.
- ✅ **Environment Variables** - Sensitive data in .env files
- ✅ **MongoDB Whitelist** - IP-based access control
- ✅ **SSH Key Authentication** - Password auth disabled

---

## 🎯 Performance Optimizations

- ✅ **Gzip Compression** - Nginx compression enabled
- ✅ **Static Asset Caching** - 1-year cache for assets
- ✅ **PM2 Process Management** - Auto-restart on failure
- ✅ **HTTP/2** - Enabled with SSL
- ✅ **CDN Ready** - Cloudinary for images
- ✅ **Code Splitting** - Vite build optimization

---

## 🆘 Troubleshooting

### Site not loading?
```bash
sudo systemctl status nginx
sudo nginx -t
sudo systemctl restart nginx
```

### API not responding?
```bash
pm2 status
pm2 logs houseofraw-api
pm2 restart houseofraw-api
```

### SSL issues?
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

**See [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for more troubleshooting commands.**

---

## 📞 Support

- **Full Guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Quick Commands:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Issues:** Check GitHub Actions logs for CI/CD issues
- **Logs:** `pm2 logs` and `/var/log/nginx/error.log`

---

## 📜 License

This deployment documentation is part of the House of Raw project.

---

**Last Updated:** January 2026  
**Project:** House of Raw E-commerce Platform  
**Domain:** houseofraw.tech
