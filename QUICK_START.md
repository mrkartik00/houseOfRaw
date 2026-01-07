# 🚀 Quick Start Guide - House of Raw

## Running Locally (Development)

### Frontend (.env)
Uncomment local URL, comment production URL:
```env
# Local Development - Uncomment this
VITE_BACKEND_URL = http://localhost:7000

# Production - Comment this
# VITE_BACKEND_URL = https://api.houseofraw.tech
```

### Backend (.env)
No changes needed! WHITELIST includes both local and production URLs.

### Start Development Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Open: http://localhost:5173

---

## Running in Production

### Frontend (.env)
Comment local URL, uncomment production URL:
```env
# Local Development - Comment this
# VITE_BACKEND_URL = http://localhost:7000

# Production - Uncomment this
VITE_BACKEND_URL = https://api.houseofraw.tech
```

### Push to GitHub
```bash
git add .
git commit -m "Update for production"
git push origin main
```

GitHub Actions will automatically deploy! ✅

---

## Environment Files

- ✅ `frontend/.env` - Single file, switch with comments
- ✅ `backend/.env` - Single file, WHITELIST handles both environments
- ❌ No `.env.example` files needed
- ❌ No `.env.production` files needed

---

## Quick Commands

```bash
# Local development
npm run dev          # Both frontend & backend

# Production build
npm run build        # Frontend only
npm start            # Backend production mode

# Git deployment
git push origin main # Auto-deploys via GitHub Actions
```

---

**Your Setup:**
- 🖥️ Local: http://localhost:5173 → http://localhost:7000
- 🌐 Production: https://houseofraw.tech → https://api.houseofraw.tech
