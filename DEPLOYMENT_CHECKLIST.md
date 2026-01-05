# 📋 House of Raw - Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## 🎯 Pre-Deployment Checklist

### 1. Accounts & Services Setup

- [ ] Digital Ocean account created
- [ ] Ubuntu 22.04 droplet created (minimum 2GB RAM)
- [ ] Droplet IP address noted: ________________
- [ ] Domain houseofraw.tech purchased
- [ ] Domain registrar access confirmed
- [ ] GitHub repository created/forked
- [ ] MongoDB Atlas free cluster created
- [ ] Cloudinary account created
- [ ] Razorpay account created (for payments)

### 2. Local Development

- [ ] Application runs locally without errors
- [ ] Backend `.env` file configured locally
- [ ] Frontend builds successfully (`npm run build`)
- [ ] All dependencies installed
- [ ] Code committed to Git
- [ ] README.md updated with project info

### 3. GitHub Setup

- [ ] Repository pushed to GitHub
- [ ] SSH access to GitHub configured (if needed)
- [ ] `.github/workflows/` directory created
- [ ] CI/CD workflow files added

---

## 🖥️ Server Setup Checklist

### 1. Initial Server Configuration

- [ ] SSH access to droplet working
  ```bash
  ssh root@your-droplet-ip
  ```
- [ ] System updated
  ```bash
  apt update && apt upgrade -y
  ```
- [ ] Node.js 20.x installed
  ```bash
  node --version
  ```
- [ ] PM2 installed
  ```bash
  pm2 --version
  ```
- [ ] Nginx installed and running
  ```bash
  systemctl status nginx
  ```
- [ ] Certbot installed
  ```bash
  certbot --version
  ```
- [ ] Git installed
  ```bash
  git --version
  ```

### 2. User & Directory Setup

- [ ] Deploy user created
  ```bash
  id deploy
  ```
- [ ] SSH keys configured for deploy user
- [ ] Application directory created (`/var/www/houseofraw`)
- [ ] Proper permissions set
  ```bash
  ls -la /var/www/houseofraw
  ```
- [ ] Logs directory created
  ```bash
  mkdir -p /var/www/houseofraw/logs
  ```

### 3. Security Configuration

- [ ] UFW firewall enabled
  ```bash
  ufw status
  ```
- [ ] Ports 22, 80, 443 allowed
- [ ] Root login disabled (recommended)
- [ ] SSH key authentication enabled
- [ ] Password authentication disabled (recommended)

---

## 🌐 Domain & DNS Checklist

### 1. DNS Configuration

- [ ] A record created: `@ → droplet-ip`
- [ ] A record created: `www → droplet-ip`
- [ ] A record created: `api → droplet-ip`
- [ ] DNS propagation verified
  ```bash
  nslookup houseofraw.tech
  nslookup api.houseofraw.tech
  ```
- [ ] Waited 5-60 minutes for DNS propagation

---

## 📦 Application Deployment Checklist

### 1. Backend Deployment

- [ ] Repository cloned to `/var/www/houseofraw`
  ```bash
  cd /var/www/houseofraw
  git remote -v
  ```
- [ ] Backend `.env` file created and configured
  ```bash
  test -f backend/.env && echo "✅ .env exists"
  ```
- [ ] All environment variables filled in:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`
  - [ ] `MONGODB_URI` (MongoDB Atlas connection string)
  - [ ] `JWT_SECRET` (strong random string)
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`
  - [ ] `RAZORPAY_KEY_ID`
  - [ ] `RAZORPAY_KEY_SECRET`
  - [ ] `CLIENT_URL=https://houseofraw.tech`
  - [ ] `ALLOWED_ORIGINS` configured
- [ ] Backend dependencies installed
  ```bash
  cd backend && npm install --production
  ```
- [ ] Backend started with PM2
  ```bash
  pm2 start server.js --name houseofraw-api
  ```
- [ ] PM2 saved
  ```bash
  pm2 save
  ```
- [ ] PM2 startup configured
  ```bash
  pm2 startup
  ```
- [ ] Backend responding on localhost:5000
  ```bash
  curl http://localhost:5000
  ```

### 2. Frontend Deployment

- [ ] Frontend `.env.production` created
  ```bash
  test -f frontend/.env.production && echo "✅ .env.production exists"
  ```
- [ ] Frontend environment variables configured:
  - [ ] `VITE_API_URL=https://api.houseofraw.tech`
  - [ ] `VITE_RAZORPAY_KEY_ID` configured
  - [ ] `VITE_APP_NAME=House of Raw`
- [ ] Frontend dependencies installed
  ```bash
  cd frontend && npm install
  ```
- [ ] Frontend built successfully
  ```bash
  npm run build
  ```
- [ ] `dist/` folder created and contains files
  ```bash
  ls -la dist/
  ```

---

## ⚙️ Nginx Configuration Checklist

### 1. Nginx Setup

- [ ] Nginx config file created
  ```bash
  sudo nano /etc/nginx/sites-available/houseofraw
  ```
- [ ] Configuration copied from `config/nginx.conf`
- [ ] Droplet IP replaced with actual values
- [ ] Symlink created to sites-enabled
  ```bash
  sudo ln -s /etc/nginx/sites-available/houseofraw /etc/nginx/sites-enabled/
  ```
- [ ] Default site removed
  ```bash
  sudo rm /etc/nginx/sites-enabled/default
  ```
- [ ] Nginx configuration tested
  ```bash
  sudo nginx -t
  ```
- [ ] Nginx reloaded
  ```bash
  sudo systemctl reload nginx
  ```
- [ ] Frontend accessible via HTTP
  ```bash
  curl -I http://houseofraw.tech
  ```
- [ ] Backend API accessible via HTTP
  ```bash
  curl http://api.houseofraw.tech
  ```

---

## 🔒 SSL Certificate Checklist

### 1. Let's Encrypt SSL

- [ ] DNS fully propagated (wait if needed)
- [ ] Certbot command run for frontend
  ```bash
  sudo certbot --nginx -d houseofraw.tech -d www.houseofraw.tech
  ```
- [ ] Email provided to certbot
- [ ] Terms of Service agreed
- [ ] Option 2 (Redirect) selected
- [ ] Certbot command run for backend
  ```bash
  sudo certbot --nginx -d api.houseofraw.tech
  ```
- [ ] Certificates successfully issued
- [ ] Frontend accessible via HTTPS
  ```bash
  curl -I https://houseofraw.tech
  ```
- [ ] Backend API accessible via HTTPS
  ```bash
  curl -I https://api.houseofraw.tech
  ```
- [ ] Green padlock visible in browser 🔒
- [ ] HTTP redirects to HTTPS
- [ ] Auto-renewal tested
  ```bash
  sudo certbot renew --dry-run
  ```

---

## 🔄 CI/CD Setup Checklist

### 1. GitHub Actions Configuration

- [ ] Workflow files created in `.github/workflows/`
- [ ] `deploy-production.yml` exists
- [ ] `test.yml` exists (optional)
- [ ] SSH key pair generated on server
  ```bash
  ssh-keygen -t ed25519 -C "github-actions"
  ```
- [ ] Public key added to authorized_keys
- [ ] Private key copied for GitHub
- [ ] GitHub Secrets added:
  - [ ] `DEPLOY_HOST` (droplet IP)
  - [ ] `DEPLOY_USER` (deploy)
  - [ ] `DEPLOY_KEY` (SSH private key)
  - [ ] `DEPLOY_PATH` (/var/www/houseofraw)
  - [ ] `RAZORPAY_KEY_ID`
- [ ] Workflow file committed and pushed
- [ ] GitHub Actions triggered
- [ ] Deployment successful in Actions tab

---

## 💾 Database Configuration Checklist

### 1. MongoDB Atlas

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Droplet IP added to IP whitelist
- [ ] Connection string obtained
- [ ] Connection string added to backend `.env`
- [ ] Backend can connect to database
  ```bash
  # Check logs for successful connection
  pm2 logs houseofraw-api | grep -i mongo
  ```

### 2. Database Collections (Auto-created)

- [ ] Users collection
- [ ] Products collection
- [ ] Orders collection
- [ ] Carts collection
- [ ] Coupons collection
- [ ] Reviews collection

---

## 🧪 Testing Checklist

### 1. Frontend Testing

- [ ] Homepage loads
- [ ] All pages accessible
- [ ] Navigation works
- [ ] Images load (Cloudinary)
- [ ] Mobile responsive
- [ ] No console errors in browser DevTools
- [ ] SEO meta tags present

### 2. Backend API Testing

- [ ] Health endpoint responds
  ```bash
  curl https://api.houseofraw.tech/health
  ```
- [ ] API endpoints respond
- [ ] CORS working (no CORS errors)
- [ ] Authentication works
- [ ] File uploads work (Cloudinary)

### 3. Feature Testing

#### User Features
- [ ] User registration works
- [ ] User login works
- [ ] JWT tokens issued correctly
- [ ] User profile accessible
- [ ] Password reset works (if implemented)

#### Product Features
- [ ] Products display on shop page
- [ ] Product details page works
- [ ] Product search works
- [ ] Product filtering works
- [ ] Product images load from Cloudinary

#### Cart Features
- [ ] Add to cart works
- [ ] Cart persistence works
- [ ] Update quantity works
- [ ] Remove from cart works
- [ ] Cart total calculates correctly

#### Checkout & Payments
- [ ] Checkout process works
- [ ] Razorpay integration works
- [ ] Payment page loads
- [ ] Test payment succeeds
- [ ] Order confirmation page shows
- [ ] Order saved to database

#### Admin Features
- [ ] Admin login works
- [ ] Admin dashboard accessible
- [ ] Add product works
- [ ] Edit product works
- [ ] Delete product works
- [ ] Order management works
- [ ] User management works (if implemented)

---

## 🔍 Post-Deployment Verification

### 1. URLs & Accessibility

- [ ] https://houseofraw.tech - Frontend loads ✅
- [ ] https://www.houseofraw.tech - Redirects to main domain ✅
- [ ] https://api.houseofraw.tech - API responds ✅
- [ ] All HTTPS (no HTTP connections) ✅

### 2. SSL/Security

- [ ] SSL certificates valid
- [ ] Green padlock in browser
- [ ] No mixed content warnings
- [ ] Security headers present (check in DevTools → Network)
- [ ] HTTPS enforced (HTTP redirects to HTTPS)

### 3. Performance

- [ ] Page load time < 3 seconds
- [ ] Images optimized (Cloudinary)
- [ ] Gzip compression working
- [ ] Browser caching working
- [ ] Lighthouse score > 80 (optional)

### 4. Monitoring

- [ ] PM2 logs accessible
  ```bash
  pm2 logs houseofraw-api
  ```
- [ ] Nginx logs accessible
  ```bash
  sudo tail -f /var/log/nginx/error.log
  ```
- [ ] Server resources monitored
  ```bash
  htop
  df -h
  free -h
  ```

---

## 📊 Maintenance Checklist

### Daily

- [ ] Check PM2 status
  ```bash
  pm2 status
  ```
- [ ] Check error logs
  ```bash
  pm2 logs houseofraw-api --lines 50 --err
  ```

### Weekly

- [ ] Check disk space
  ```bash
  df -h
  ```
- [ ] Check memory usage
  ```bash
  free -h
  ```
- [ ] Review error logs
  ```bash
  sudo tail -100 /var/log/nginx/error.log
  ```

### Monthly

- [ ] Update system packages
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```
- [ ] Check SSL certificate expiry
  ```bash
  sudo certbot certificates
  ```
- [ ] Review security updates
- [ ] Backup database
- [ ] Test backup restoration

---

## 🚨 Emergency Checklist

### If Site is Down

1. [ ] Check PM2 status
   ```bash
   pm2 status
   ```
2. [ ] Restart backend if needed
   ```bash
   pm2 restart houseofraw-api
   ```
3. [ ] Check Nginx status
   ```bash
   sudo systemctl status nginx
   ```
4. [ ] Restart Nginx if needed
   ```bash
   sudo systemctl restart nginx
   ```
5. [ ] Check error logs
   ```bash
   pm2 logs houseofraw-api --lines 100 --err
   sudo tail -100 /var/log/nginx/error.log
   ```
6. [ ] Check disk space
   ```bash
   df -h
   ```
7. [ ] Check memory
   ```bash
   free -h
   ```

---

## ✅ Final Sign-Off

- [ ] All checklist items completed
- [ ] Application fully functional
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Team notified of deployment
- [ ] Monitoring tools configured
- [ ] Backup procedures in place

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Sign-off:** _______________

---

## 📚 Additional Resources

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Full deployment guide
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick command reference
- [DEPLOYMENT_README.md](DEPLOYMENT_README.md) - Overview and architecture

---

**🎉 Congratulations! Your deployment is complete!**

**Your House of Raw e-commerce platform is now live at https://houseofraw.tech**
