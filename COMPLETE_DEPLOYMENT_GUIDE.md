# 🚀 House of Raw - Complete Deployment Guide
## Single Step-by-Step Guide from Zero to Production

**Your Situation:**
- Domain: `houseofraw.tech` (from GitHub Student Pack)
- Server: Digital Ocean
- Need: Complete deployment with SSL certificate

---

## 📋 Part 1: Prerequisites & Accounts Setup

### 1.1 What You Need Before Starting

**Accounts to Create (All Free Tiers Available):**

1. **Digital Ocean Account**
   - Go to: https://www.digitalocean.com
   - Sign up (you can use GitHub Student Pack for $200 credit)
   - Verify your email

2. **MongoDB Atlas (Database)**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up with Google/GitHub
   - Click "Build a Database" → Choose "FREE" tier (M0)
   - Choose cloud provider: AWS
   - Region: Choose closest to your location
   - Cluster Name: `houseofraw-cluster`
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Cloudinary (Image Storage)**
   - Go to: https://cloudinary.com/users/register_free
   - Sign up (free tier: 25GB storage, 25GB bandwidth)
   - After signup, go to Dashboard
   - Note down: Cloud Name, API Key, API Secret

4. **Razorpay (Payment Gateway)**
   - Go to: https://razorpay.com
   - Sign up (for India) or use Stripe (for international)
   - Go to Settings → API Keys
   - Note down: Key ID and Key Secret
   - Switch to "Test Mode" for development

---

## 🌐 Part 2: Domain Configuration (CRITICAL FOR SSL)

### 2.1 Your Domain Setup

Since you got `houseofraw.tech` from GitHub Student Pack (likely through Get.tech or Namecheap), you need to configure DNS properly for SSL to work.

**Step 1: Find Your Domain Registrar**
- Check your email for domain confirmation
- Common registrars with Student Pack:
  - Name.com
  - Namecheap
  - Get.tech

**Step 2: Log into Your Domain Registrar**
- Go to your domain registrar's website
- Log in with your credentials
- Find "Domain Management" or "DNS Management"

**Step 3: Configure DNS Records**

You need to add these DNS records. **This is critical for SSL certificates!**

```
Record Type: A
Name/Host: @
Value/Points to: [YOUR_DIGITAL_OCEAN_DROPLET_IP]
TTL: 3600

Record Type: A
Name/Host: www
Value/Points to: [YOUR_DIGITAL_OCEAN_DROPLET_IP]
TTL: 3600

Record Type: A
Name/Host: api
Value/Points to: [YOUR_DIGITAL_OCEAN_DROPLET_IP]
TTL: 3600
```

**Example for Namecheap:**
1. Login to Namecheap
2. Go to "Domain List"
3. Click "Manage" next to houseofraw.tech
4. Go to "Advanced DNS" tab
5. Add the records above

**Example for Name.com:**
1. Login to Name.com
2. Click on your domain
3. Go to "DNS Records"
4. Add the records above

**Step 4: Wait for DNS Propagation**
- DNS changes take 5-60 minutes to propagate
- You MUST wait for this before getting SSL certificate
- Check propagation at: https://dnschecker.org
  - Enter: `houseofraw.tech`
  - If it shows your droplet IP globally → Ready!
  - If not → Wait longer

**IMPORTANT:** SSL certificate will FAIL if DNS is not fully propagated!

---

## 🖥️ Part 3: Create Digital Ocean Droplet

### 3.1 Create Your Server

1. **Log into Digital Ocean**
   - Go to: https://cloud.digitalocean.com

2. **Create Droplet**
   - Click green "Create" button → "Droplets"
   - **Choose Image:**
     - Distribution: Ubuntu
     - Version: 22.04 LTS x64
   
   - **Choose Plan:**
     - Shared CPU → Basic
     - CPU Options: Regular
     - $12/month plan (2GB RAM / 1 CPU / 50GB SSD) ← **Recommended**
     - OR $6/month (1GB RAM) for testing only
   
   - **Choose Datacenter:**
     - Bangalore (if targeting India)
     - Singapore (for Asia)
     - New York/San Francisco (for US/Global)
   
   - **Authentication:**
     - Choose "Password" (easier for first time)
     - Set a strong password
     - OR use SSH keys (more secure)
   
   - **Hostname:**
     - Enter: `houseofraw-server`
   
   - Click "Create Droplet"

3. **Wait for Droplet Creation** (1-2 minutes)

4. **Note Your IP Address**
   - You'll see your droplet with an IP like: `123.45.67.89`
   - **WRITE THIS DOWN - YOU'LL NEED IT!**
   - Let's call this: `YOUR_DROPLET_IP`

### 3.2 Update DNS with Your Droplet IP

**GO BACK TO YOUR DOMAIN REGISTRAR NOW** and update the DNS records with your actual droplet IP!

Replace `[YOUR_DIGITAL_OCEAN_DROPLET_IP]` with your actual IP address.

---

## 🔧 Part 4: Server Setup & Configuration

### 4.1 Connect to Your Server

**On Windows:**
1. Press `Win + R`, type `cmd`, press Enter
2. Type this command (replace with YOUR IP):
   ```cmd
   ssh root@YOUR_DROPLET_IP
   ```
3. Type `yes` when asked about fingerprint
4. Enter your password (you won't see characters as you type)

**You should now see:** `root@houseofraw-server:~#`

### 4.2 Initial Server Setup

Copy and paste each command (right-click to paste in cmd):

```bash
# Update system packages
apt update && apt upgrade -y
```

This takes 2-5 minutes. Wait for it to complete.

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

Verify Node.js installation:
```bash
node --version
# Should show: v20.x.x
```

```bash
# Install PM2 (Process Manager)
npm install -g pm2
```

```bash
# Install Nginx (Web Server)
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

```bash
# Install Certbot (for SSL)
apt install -y certbot python3-certbot-nginx
```

```bash
# Install Git
apt install -y git
```

```bash
# Install other utilities
apt install -y build-essential htop curl wget vim nano
```

### 4.3 Create Deploy User (Security Best Practice)

```bash
# Create a new user called 'deploy'
adduser deploy
```

You'll be asked to set a password and details:
- Password: Choose a strong password
- Full Name: Just press Enter (skip)
- Room Number: Press Enter (skip)
- Work Phone: Press Enter (skip)
- Home Phone: Press Enter (skip)
- Other: Press Enter (skip)
- Is the information correct: Type `Y`

```bash
# Give deploy user sudo privileges
usermod -aG sudo deploy
```

```bash
# Copy SSH keys to deploy user (if you used password, skip this)
mkdir -p /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/ 2>/dev/null || echo "No SSH keys to copy"
chown -R deploy:deploy /home/deploy/.ssh 2>/dev/null || echo "Skipped"
chmod 700 /home/deploy/.ssh 2>/dev/null || echo "Skipped"
chmod 600 /home/deploy/.ssh/authorized_keys 2>/dev/null || echo "Skipped"
```

```bash
# Create application directory
mkdir -p /var/www/houseofraw
chown -R deploy:deploy /var/www/houseofraw
```

```bash
# Create logs directory
mkdir -p /var/www/houseofraw/logs
chown -R deploy:deploy /var/www/houseofraw/logs
```

```bash
# Allow deploy user to manage nginx without password
echo "deploy ALL=(ALL) NOPASSWD: /usr/sbin/nginx, /bin/systemctl reload nginx, /bin/systemctl restart nginx, /bin/systemctl status nginx" > /etc/sudoers.d/deploy-nginx
chmod 0440 /etc/sudoers.d/deploy-nginx
```

### 4.4 Configure Firewall

```bash
# Install and configure UFW firewall
apt install -y ufw
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable
```

Check firewall status:
```bash
ufw status
```

You should see:
```
Status: active
To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

### 4.5 Switch to Deploy User

```bash
su - deploy
```

You should now see: `deploy@houseofraw-server:~$`

---

## 📦 Part 5: Clone & Setup Your Application

### 5.1 Clone Your Repository

```bash
cd /var/www/houseofraw
git clone https://github.com/YOUR_GITHUB_USERNAME/houseOfRaw.git .
```

**Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username!**

If you get permission error, the repository might be private. You'll need to:
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"
# Press Enter 3 times (default location, no passphrase)

# Show your public key
cat ~/.ssh/id_ed25519.pub
# Copy this entire output
```

Then:
1. Go to GitHub → Settings → SSH and GPG keys → New SSH key
2. Paste the key → Add SSH key
3. Try cloning again with SSH URL:
   ```bash
   git clone git@github.com:YOUR_GITHUB_USERNAME/houseOfRaw.git .
   ```

### 5.2 Setup Backend Environment

```bash
cd /var/www/houseofraw/backend
```

Create `.env` file:
```bash
nano .env
```

**Copy and paste this, then fill in YOUR values:**

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# MongoDB Configuration - FROM MONGODB ATLAS
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/houseofraw?retryWrites=true&w=majority

# JWT Configuration - Generate random: openssl rand -base64 32
JWT_SECRET=CHANGE_THIS_TO_RANDOM_SECRET_KEY

# Cloudinary Configuration - FROM CLOUDINARY DASHBOARD
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay Configuration - FROM RAZORPAY DASHBOARD
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Frontend URLs
CLIENT_URL=https://houseofraw.tech
FRONTEND_URL=https://houseofraw.tech
ALLOWED_ORIGINS=https://houseofraw.tech,https://www.houseofraw.tech

# Email Configuration (Optional - for order confirmations)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@houseofraw.tech
```

**How to Fill Each Value:**

1. **MONGODB_URI:**
   - Go to MongoDB Atlas Dashboard
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<database>` with `houseofraw`

2. **JWT_SECRET:**
   - Generate random secret:
     ```bash
     openssl rand -base64 32
     ```
   - Copy the output and paste here

3. **CLOUDINARY values:**
   - Go to Cloudinary Dashboard
   - You'll see: Cloud Name, API Key, API Secret
   - Copy each one

4. **RAZORPAY values:**
   - Go to Razorpay Dashboard → Settings → API Keys
   - In "Test Mode", copy Key ID and Secret

**Save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

### 5.3 Install Backend Dependencies

```bash
npm install --production
```

This takes 2-5 minutes.

### 5.4 Start Backend with PM2

```bash
pm2 start server.js --name houseofraw-api --env production
```

Check if it's running:
```bash
pm2 status
```

You should see:
```
┌─────┬──────────────────┬─────────┬──────┬─────────┐
│ id  │ name             │ status  │ cpu  │ memory  │
├─────┼──────────────────┼─────────┼──────┼─────────┤
│ 0   │ houseofraw-api   │ online  │ 0%   │ 50MB    │
└─────┴──────────────────┴─────────┴──────┴─────────┘
```

**If status is "errored":** Check logs:
```bash
pm2 logs houseofraw-api
```

Fix any errors (usually MongoDB connection or missing env variables), then restart:
```bash
pm2 restart houseofraw-api
```

**Save PM2 configuration:**
```bash
pm2 save
```

**Setup PM2 to start on boot:**
```bash
pm2 startup
```

Copy the command it shows and run it (will look like):
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u deploy --hp /home/deploy
```

### 5.5 Test Backend

```bash
curl http://localhost:5000
```

You should get a response (might be "Cannot GET /" or actual API response). If you get "Connection refused", backend is not running.

---

## 🎨 Part 6: Build Frontend

### 6.1 Create Frontend Environment File

```bash
cd /var/www/houseofraw/frontend
```

Create `.env.production`:
```bash
nano .env.production
```

Paste this:
```env
VITE_API_URL=https://api.houseofraw.tech
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
VITE_APP_NAME=House of Raw
```

Replace `VITE_RAZORPAY_KEY_ID` with your actual Razorpay Key ID (same as in backend).

**Save:** `Ctrl + X`, `Y`, `Enter`

### 6.2 Install Dependencies and Build

```bash
npm install
```

This takes 3-5 minutes.

```bash
npm run build
```

This creates a `dist/` folder with optimized files. Takes 1-2 minutes.

Verify build:
```bash
ls -la dist/
```

You should see `index.html` and other files.

---

## ⚙️ Part 7: Configure Nginx (Web Server)

### 7.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/houseofraw
```

**Paste this entire configuration:**

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

    # React Router - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend API - api.houseofraw.tech
server {
    listen 80;
    listen [::]:80;
    server_name api.houseofraw.tech;

    # Request size limit (for image uploads)
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
    }
}
```

**Save:** `Ctrl + X`, `Y`, `Enter`

### 7.2 Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/houseofraw /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default
```

### 7.3 Test Nginx Configuration

```bash
sudo nginx -t
```

You should see:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**If you see errors:** Check the configuration file for typos.

### 7.4 Restart Nginx

```bash
sudo systemctl restart nginx
```

Check status:
```bash
sudo systemctl status nginx
```

Should show "active (running)" in green.

### 7.5 Test HTTP Access

**On your local computer**, open browser and go to:
- `http://YOUR_DROPLET_IP` (should show your frontend)
- `http://houseofraw.tech` (should show your frontend if DNS is working)

**If you see Nginx default page or 404:**
- Check if dist folder exists: `ls /var/www/houseofraw/frontend/dist/`
- Check Nginx logs: `sudo tail -30 /var/log/nginx/error.log`

---

## 🔒 Part 8: SSL Certificate Setup (SOLVING YOUR ISSUE)

### 8.1 Pre-SSL Checklist

**BEFORE running certbot, verify ALL these:**

```bash
# 1. Check DNS is fully propagated
nslookup houseofraw.tech
```

Should show your droplet IP. If not, **WAIT** and check again.

```bash
# 2. Check www subdomain
nslookup www.houseofraw.tech
```

Should also show your droplet IP.

```bash
# 3. Check api subdomain
nslookup api.houseofraw.tech
```

Should also show your droplet IP.

**On your computer**, go to https://dnschecker.org and check:
- `houseofraw.tech` → Should show your IP worldwide ✅
- `www.houseofraw.tech` → Should show your IP worldwide ✅
- `api.houseofraw.tech` → Should show your IP worldwide ✅

**If ANY are not showing your IP globally, WAIT longer!**

```bash
# 4. Check Nginx is serving on port 80
curl -I http://houseofraw.tech
```

Should return `HTTP/1.1 200 OK` or similar (not connection refused).

```bash
# 5. Check API is accessible
curl -I http://api.houseofraw.tech
```

Should return a response (not connection refused).

### 8.2 Troubleshooting DNS Issues

**If DNS is not working after 1 hour:**

1. **Check Domain Registrar Settings:**
   - Make sure you're editing the DNS for `houseofraw.tech` (not a different domain)
   - Make sure DNS is using "Custom DNS" or "Registrar DNS" (not parked)
   - Some registrars have a "DNS Template" that overwrites changes - disable it

2. **Check Record Format:**
   - Record Type: Must be `A` (not CNAME for root domain)
   - Name/Host: Use `@` for root domain, NOT blank or `houseofraw.tech`
   - Value: Just the IP address, no `http://` or anything else

3. **Common Issues with .tech Domains:**
   - Some .tech domain providers have 24-hour propagation delays
   - Check if your domain has "Privacy Protection" enabled - should be fine
   - Check if domain status is "Active" (not "Pending" or "Suspended")

4. **Flush Your Local DNS Cache:**
   **On Windows:**
   ```cmd
   ipconfig /flushdns
   ```

### 8.3 Get SSL Certificate - Frontend Domain

**Once DNS is fully propagated (this is critical!):**

```bash
sudo certbot --nginx -d houseofraw.tech -d www.houseofraw.tech
```

You'll be asked:

1. **Enter email address:** Your real email (for SSL expiry notifications)
   ```
   your-email@example.com
   ```

2. **Terms of Service:** Type `Y` and press Enter

3. **Share email with EFF:** Type `N` (or `Y` if you want updates)

4. **HTTP to HTTPS redirect:**
   ```
   Please choose whether or not to redirect HTTP traffic to HTTPS
   1: No redirect
   2: Redirect - Make all requests redirect to secure HTTPS access
   ```
   **Type: `2`** and press Enter

**If successful, you'll see:**
```
Successfully deployed certificate for houseofraw.tech
Successfully deployed certificate for www.houseofraw.tech
```

### 8.4 Get SSL Certificate - API Domain

```bash
sudo certbot --nginx -d api.houseofraw.tech
```

Same prompts:
- Email: Same as before (or just press Enter)
- Terms: `Y`
- Redirect: `2`

**If successful:**
```
Successfully deployed certificate for api.houseofraw.tech
```

### 8.5 SSL Certificate Troubleshooting

**ERROR: "Could not resolve host"**
```
Domain: houseofraw.tech
Type: None
Detail: DNS problem: NXDOMAIN looking up A for houseofraw.tech
```

**Solution:** DNS not propagated yet. Wait 30 more minutes and try again.

**ERROR: "Timeout during connect"**
```
Detail: Fetching http://houseofraw.tech/.well-known/acme-challenge/xxx: Timeout during connect
```

**Solution:** 
- Check firewall: `sudo ufw status` (Port 80 must be open)
- Check Nginx is running: `sudo systemctl status nginx`
- Check you can access site: `curl -I http://houseofraw.tech`

**ERROR: "Failed authorization procedure"**
```
The following errors were reported by the server:
Domain: houseofraw.tech
Type: unauthorized
```

**Solution:**
1. Check Nginx config syntax: `sudo nginx -t`
2. Check Nginx root path exists: `ls /var/www/houseofraw/frontend/dist/`
3. Restart Nginx: `sudo systemctl restart nginx`
4. Try again: `sudo certbot --nginx -d houseofraw.tech -d www.houseofraw.tech`

**ERROR: "Too many certificates already issued"**
```
There were too many requests of a given type :: Error creating new order
```

**Solution:** 
- Let's Encrypt has rate limits: 5 failed attempts per hour
- Wait 1 hour and try again
- In the meantime, fix any DNS or Nginx issues

**ERROR: "CAA records forbid certificate"**
```
CAA records forbid certificate
```

**Solution:**
- Your domain has CAA DNS records restricting SSL issuers
- Log into your domain registrar
- Go to DNS management
- Remove or edit CAA records to allow "letsencrypt.org"

### 8.6 Verify SSL is Working

**Open your browser and visit:**
- ✅ https://houseofraw.tech (should show 🔒 green padlock)
- ✅ https://www.houseofraw.tech (should show 🔒)
- ✅ https://api.houseofraw.tech (should show 🔒)

**Test HTTP redirect:**
- Visit: http://houseofraw.tech (should auto-redirect to https://)

**Check certificate:**
```bash
sudo certbot certificates
```

Should show:
```
Certificate Name: houseofraw.tech
  Domains: houseofraw.tech www.houseofraw.tech
  Expiry Date: [60 days from now]
  Certificate Path: /etc/letsencrypt/live/houseofraw.tech/fullchain.pem

Certificate Name: api.houseofraw.tech
  Domains: api.houseofraw.tech
  Expiry Date: [60 days from now]
```

### 8.7 Setup Auto-Renewal

Certbot automatically sets up renewal. Test it:

```bash
sudo certbot renew --dry-run
```

If successful, you'll see:
```
Congratulations, all simulated renewals succeeded
```

Your SSL certificates will auto-renew every 60 days automatically!

---

## 🔄 Part 9: Setup CI/CD (Automatic Deployments)

### 9.1 Generate SSH Key for GitHub Actions

**On your server (as deploy user):**

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github-actions
```

Press Enter 3 times (no passphrase).

```bash
# Add public key to authorized_keys
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys
```

```bash
# Show private key - COPY THIS ENTIRE OUTPUT
cat ~/.ssh/github-actions
```

**Copy everything from `-----BEGIN` to `-----END` including those lines.**

### 9.2 Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**

**Add these 5 secrets one by one:**

| Secret Name | Value |
|------------|--------|
| `DEPLOY_HOST` | Your droplet IP (e.g., `123.45.67.89`) |
| `DEPLOY_USER` | `deploy` |
| `DEPLOY_KEY` | The SSH private key you copied above |
| `DEPLOY_PATH` | `/var/www/houseofraw` |
| `RAZORPAY_KEY_ID` | Your Razorpay Key ID |

For each:
- Click "New repository secret"
- Name: (from table above)
- Value: (corresponding value)
- Click "Add secret"

### 9.3 Create GitHub Actions Workflow

**On your LOCAL computer (in your project):**

Create folder:
```bash
mkdir -p .github/workflows
```

Create file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy to Digital Ocean
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Deploy to Server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd ${{ secrets.DEPLOY_PATH }}
            git pull origin main
            
            # Backend
            cd backend
            npm install --production
            pm2 restart houseofraw-api
            
            # Frontend
            cd ../frontend
            npm install
            npm run build
            
            # Status
            pm2 status
```

Save and commit:

```bash
git add .github/workflows/deploy.yml
git commit -m "Add CI/CD deployment workflow"
git push origin main
```

### 9.4 Test Automatic Deployment

1. Go to your GitHub repository
2. Click **Actions** tab
3. You should see "Deploy to Production" workflow running
4. Click on it to see progress
5. Wait for it to complete (green checkmark ✅)

**From now on:** Every time you `git push`, your site automatically deploys! 🎉

---

## ✅ Part 10: Final Testing & Verification

### 10.1 Test Frontend

**Open browser:**
- ✅ https://houseofraw.tech
- ✅ Should load with HTTPS 🔒
- ✅ No console errors (Press F12 → Console tab)
- ✅ Navigation works
- ✅ Images load

### 10.2 Test Backend API

**In browser or terminal:**
```bash
curl https://api.houseofraw.tech
```

Should return API response (not error).

### 10.3 Test Full User Flow

1. **Register new user**
   - Go to Register page
   - Fill details
   - Submit
   - Should create account

2. **Login**
   - Use credentials
   - Should login successfully
   - Token should be saved

3. **Browse products**
   - Products should load from database
   - Images should load from Cloudinary

4. **Add to cart**
   - Click "Add to Cart"
   - Cart count should update
   - Go to cart page
   - Items should be there

5. **Test checkout (with Razorpay TEST mode)**
   - Proceed to checkout
   - Fill shipping details
   - Click "Pay"
   - Razorpay popup should appear
   - Use test card: `4111 1111 1111 1111`, any future date, any CVV
   - Payment should succeed
   - Order should be created
   - Check order confirmation page

### 10.4 Test Admin Panel

1. Login as admin
2. Go to /admin
3. Try adding a product
4. Upload image (should go to Cloudinary)
5. Product should appear in shop

### 10.5 Check Logs

**Backend logs:**
```bash
pm2 logs houseofraw-api
```

Should not show continuous errors.

**Nginx logs:**
```bash
sudo tail -50 /var/log/nginx/error.log
```

Should not show critical errors.

---

## 📊 Part 11: Monitoring & Maintenance

### 11.1 Daily Commands

**Check if everything is running:**
```bash
pm2 status                    # Backend status
sudo systemctl status nginx   # Nginx status
```

**View logs:**
```bash
pm2 logs houseofraw-api --lines 50
```

**Check server resources:**
```bash
free -h    # Memory
df -h      # Disk space
```

### 11.2 Restart Commands

**If backend has issues:**
```bash
pm2 restart houseofraw-api
pm2 logs houseofraw-api
```

**If frontend has issues:**
```bash
cd /var/www/houseofraw/frontend
npm run build
sudo systemctl reload nginx
```

**If site is completely down:**
```bash
pm2 restart houseofraw-api
sudo systemctl restart nginx
```

### 11.3 Update Application

**Manual update:**
```bash
cd /var/www/houseofraw
git pull origin main
cd backend && npm install --production
pm2 restart houseofraw-api
cd ../frontend && npm run build
```

**Automatic update:** Just `git push` from your local machine!

### 11.4 Check SSL Certificate

```bash
sudo certbot certificates
```

Shows expiry date. Renews automatically 30 days before expiry.

**Force renewal (if needed):**
```bash
sudo certbot renew --force-renewal
```

---

## 🆘 Part 12: Common Issues & Solutions

### Issue 1: "502 Bad Gateway"

**Cause:** Backend is not running.

**Solution:**
```bash
pm2 status
pm2 restart houseofraw-api
pm2 logs houseofraw-api
```

Check logs for errors. Common causes:
- MongoDB connection failed (check MONGODB_URI in .env)
- Port 5000 already in use (restart PM2)
- Backend code error (check logs)

### Issue 2: "Cannot connect to MongoDB"

**Solution:**
1. Check MongoDB Atlas:
   - Go to Atlas dashboard
   - Click "Network Access"
   - Make sure your droplet IP is whitelisted
   - OR add `0.0.0.0/0` (allow from anywhere)

2. Check connection string in backend/.env:
   - Username and password correct?
   - Database name correct?
   - Connection string format correct?

3. Test connection:
   ```bash
   cd /var/www/houseofraw/backend
   node -e "require('mongoose').connect(process.env.MONGODB_URI || 'mongodb://localhost').then(() => console.log('Connected!')).catch(err => console.log('Error:', err.message))"
   ```

### Issue 3: Images Not Uploading

**Solution:**
1. Check Cloudinary credentials in backend/.env
2. Check Cloudinary upload folder permissions
3. Check backend logs: `pm2 logs houseofraw-api`

### Issue 4: Payment Not Working

**Solution:**
1. Make sure you're using TEST mode Razorpay keys
2. Check frontend has VITE_RAZORPAY_KEY_ID in .env.production
3. Check backend has RAZORPAY_KEY_SECRET in .env
4. Use test card: `4111 1111 1111 1111`

### Issue 5: CORS Error in Browser

**Error in console:** `Access to fetch at 'https://api.houseofraw.tech' from origin 'https://houseofraw.tech' has been blocked by CORS policy`

**Solution:**
Edit `/var/www/houseofraw/backend/.env`:
```env
ALLOWED_ORIGINS=https://houseofraw.tech,https://www.houseofraw.tech
CLIENT_URL=https://houseofraw.tech
```

Restart backend:
```bash
pm2 restart houseofraw-api
```

### Issue 6: SSL Certificate Won't Install

**See Part 8.5 above for detailed SSL troubleshooting.**

Quick checklist:
- ✅ DNS fully propagated? Check: https://dnschecker.org
- ✅ Nginx running? `sudo systemctl status nginx`
- ✅ Port 80 open? `sudo ufw status`
- ✅ Site accessible via HTTP? `curl http://houseofraw.tech`

### Issue 7: Site Very Slow

**Solutions:**
1. Enable caching (already in Nginx config)
2. Optimize images in Cloudinary
3. Add MongoDB indexes
4. Upgrade droplet (2GB → 4GB RAM)

### Issue 8: "Out of Memory"

**Solution:**
1. Check memory:
   ```bash
   free -h
   ```

2. If using 1GB droplet, upgrade to 2GB:
   - Digital Ocean Dashboard → Your Droplet → Resize
   - Choose 2GB plan
   - Resize

3. Or add swap space:
   ```bash
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

---

## 💰 Monthly Costs

| Service | Plan | Cost |
|---------|------|------|
| Domain | houseofraw.tech | FREE (GitHub Student Pack) |
| Digital Ocean | 2GB Droplet | $12/month |
| MongoDB Atlas | Free Tier | FREE |
| Cloudinary | Free Tier | FREE |
| SSL Certificate | Let's Encrypt | FREE |
| Razorpay | Transaction fees only | FREE (2% per transaction) |

**Total: $12/month = $144/year** 💸

With GitHub Student Pack: First domain year free!

---

## 🎉 Congratulations!

Your House of Raw e-commerce platform is now live at:

- 🌐 **Frontend:** https://houseofraw.tech
- 🔌 **Backend API:** https://api.houseofraw.tech
- 🔒 **SSL:** Enabled with auto-renewal
- 🚀 **CI/CD:** Auto-deploy on every push

### Quick Command Reference

**SSH to server:**
```bash
ssh deploy@YOUR_DROPLET_IP
```

**Check status:**
```bash
pm2 status
sudo systemctl status nginx
```

**View logs:**
```bash
pm2 logs houseofraw-api
sudo tail -f /var/log/nginx/error.log
```

**Restart services:**
```bash
pm2 restart houseofraw-api
sudo systemctl restart nginx
```

**Update app:**
```bash
cd /var/www/houseofraw
git pull
cd backend && npm install --production
pm2 restart houseofraw-api
cd ../frontend && npm run build
```

**Or just:** `git push` (CI/CD does it automatically!)

---

## 📞 Need More Help?

1. **Check logs first:**
   - Backend: `pm2 logs houseofraw-api`
   - Nginx: `sudo tail -f /var/log/nginx/error.log`

2. **Common issues:** See Part 12 above

3. **Server status:**
   ```bash
   pm2 status
   sudo systemctl status nginx
   df -h
   free -h
   ```

4. **Test connectivity:**
   ```bash
   curl https://houseofraw.tech
   curl https://api.houseofraw.tech
   ```

---

**You're all set! Happy selling! 🎉🛒**

**Last Updated:** January 5, 2026  
**Project:** House of Raw E-commerce Platform  
**Domain:** houseofraw.tech
