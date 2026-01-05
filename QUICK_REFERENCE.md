# 🚀 House of Raw - Quick Deployment Reference

## 📋 Prerequisites Checklist

- [ ] Digital Ocean account created
- [ ] Domain `houseofraw.tech` purchased
- [ ] GitHub repository set up
- [ ] MongoDB Atlas cluster created (or plan to use local MongoDB)
- [ ] Cloudinary account for image uploads
- [ ] Razorpay account for payments

---

## ⚡ Quick Commands Reference

### On Digital Ocean Server

```bash
# SSH into server
ssh deploy@your-droplet-ip

# Navigate to app directory
cd /var/www/houseofraw

# Pull latest code
git pull origin main

# Restart backend
pm2 restart houseofraw-api

# View logs
pm2 logs houseofraw-api

# View PM2 status
pm2 status

# Rebuild frontend
cd frontend && npm run build && cd ..

# Reload Nginx
sudo systemctl reload nginx

# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check SSL certificate expiry
sudo certbot certificates

# Renew SSL manually
sudo certbot renew

# Check disk space
df -h

# Check memory
free -h
```

---

## 🔑 GitHub Secrets Required

Add these in GitHub → Settings → Secrets → Actions:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DEPLOY_HOST` | Server IP address | `123.45.67.89` |
| `DEPLOY_USER` | SSH username | `deploy` |
| `DEPLOY_KEY` | SSH private key | Copy from `~/.ssh/github-actions` |
| `DEPLOY_PATH` | Application path | `/var/www/houseofraw` |
| `RAZORPAY_KEY_ID` | Razorpay public key | `rzp_live_xxxxx` |

---

## 🌐 DNS Records Configuration

Point these to your Digital Ocean droplet IP:

```
Type    Name    Value               TTL
A       @       your-droplet-ip     3600
A       www     your-droplet-ip     3600
A       api     your-droplet-ip     3600
```

---

## 📂 Important File Paths

```
/var/www/houseofraw/              # Main application directory
├── backend/
│   ├── server.js                 # Backend entry point
│   ├── .env                      # Backend environment variables
│   └── package.json
├── frontend/
│   ├── dist/                     # Built frontend (served by Nginx)
│   ├── .env.production           # Frontend environment variables
│   └── package.json
└── .github/
    └── workflows/
        └── deploy-production.yml # CI/CD workflow
```

---

## 🔄 Deployment Workflow

### Automatic (via CI/CD)

1. Make changes locally
2. Commit and push to `main` branch
3. GitHub Actions automatically deploys
4. Monitor progress in Actions tab

```bash
git add .
git commit -m "Your update"
git push origin main
```

### Manual

1. SSH to server
2. Pull latest code
3. Restart services

```bash
ssh deploy@your-droplet-ip
cd /var/www/houseofraw
git pull origin main
cd backend && npm install --production
pm2 restart houseofraw-api
cd ../frontend && npm run build
```

---

## 🔒 SSL Certificate Commands

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate (auto-renewed every 60 days)
sudo certbot renew

# Force renew
sudo certbot renew --force-renewal

# Test renewal
sudo certbot renew --dry-run

# Get new certificate
sudo certbot --nginx -d houseofraw.tech -d www.houseofraw.tech
sudo certbot --nginx -d api.houseofraw.tech
```

---

## 🛠️ Troubleshooting Commands

### Frontend Issues

```bash
# Check if Nginx is running
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check frontend build
cd /var/www/houseofraw/frontend
npm run build

# Check if dist folder exists
ls -la dist/
```

### Backend Issues

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs houseofraw-api --lines 100

# Restart backend
pm2 restart houseofraw-api

# Check if backend is listening
netstat -tlnp | grep :5000
curl http://localhost:5000

# Check environment variables
cat /var/www/houseofraw/backend/.env
```

### Database Issues

```bash
# Test MongoDB connection
mongosh "your-mongodb-uri"

# Check backend can connect to DB
cd /var/www/houseofraw/backend
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('DB Connected')).catch(err => console.log(err))"
```

### SSL Issues

```bash
# Check certificate
sudo certbot certificates

# Check Nginx SSL config
sudo cat /etc/nginx/sites-available/houseofraw

# Test HTTPS
curl -I https://houseofraw.tech
curl -I https://api.houseofraw.tech
```

---

## 📊 Monitoring

### Real-time Monitoring

```bash
# PM2 monitoring dashboard
pm2 monit

# Live server resources
htop  # or top

# Live Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Live Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Live application logs
pm2 logs houseofraw-api --lines 0
```

### Resource Usage

```bash
# Disk space
df -h

# Memory usage
free -h

# CPU usage
top

# Check running Node processes
ps aux | grep node

# Network connections
netstat -tlnp
```

---

## 🔐 Security Checklist

- [ ] Firewall enabled (UFW)
- [ ] Only necessary ports open (22, 80, 443)
- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] Strong passwords for database
- [ ] JWT secret changed from default
- [ ] SSL certificates installed and auto-renewing
- [ ] Environment variables secured (.env not in Git)
- [ ] Rate limiting enabled in Nginx
- [ ] CORS properly configured
- [ ] MongoDB IP whitelist configured

---

## 🌐 URLs

- **Frontend:** https://houseofraw.tech
- **Backend API:** https://api.houseofraw.tech
- **GitHub Actions:** https://github.com/YOUR_USERNAME/houseOfRaw/actions

---

## 📞 Common Issues & Quick Fixes

### "502 Bad Gateway"
```bash
pm2 restart houseofraw-api
sudo systemctl restart nginx
```

### "Cannot connect to MongoDB"
```bash
# Check .env file
cat /var/www/houseofraw/backend/.env | grep MONGODB_URI
# Verify IP whitelist in MongoDB Atlas
```

### "SSL Certificate Expired"
```bash
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

### "Permission Denied" errors
```bash
sudo chown -R deploy:deploy /var/www/houseofraw
chmod -R 755 /var/www/houseofraw
```

### "Port 5000 already in use"
```bash
pm2 restart houseofraw-api
# Or find and kill the process
lsof -ti:5000 | xargs kill -9
```

---

## 📦 Backup Commands

```bash
# Backup database
mongodump --uri="your-mongodb-uri" --out=/backup/$(date +%Y%m%d)

# Backup application files
tar -czf /backup/houseofraw-$(date +%Y%m%d).tar.gz /var/www/houseofraw

# Backup Nginx config
sudo cp /etc/nginx/sites-available/houseofraw /backup/nginx-config-$(date +%Y%m%d)

# Backup environment variables
cp /var/www/houseofraw/backend/.env /backup/env-backup-$(date +%Y%m%d)
```

---

## 🎯 Performance Tips

1. **Enable Gzip/Brotli** - Already configured in Nginx
2. **Use CDN** - Consider Cloudflare for static assets
3. **Database Indexing** - Ensure proper indexes in MongoDB
4. **Image Optimization** - Use Cloudinary transformations
5. **Caching** - Implement Redis for session/cache
6. **HTTP/2** - Already enabled in Nginx SSL config

---

## 📈 Scaling Considerations

When your app grows:

1. **Load Balancer** - Add Digital Ocean Load Balancer
2. **Multiple Droplets** - Scale horizontally
3. **Separate Database Server** - Move MongoDB to dedicated droplet
4. **Redis for Sessions** - Shared sessions across servers
5. **CDN for Static Assets** - Reduce server load
6. **Database Replicas** - MongoDB replica set

---

## 🆘 Need Help?

1. Check the full [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. Review server logs: `pm2 logs` and `sudo tail -f /var/log/nginx/error.log`
3. Check GitHub Actions for CI/CD issues
4. Verify all environment variables are set correctly

---

**Last Updated:** January 2026
