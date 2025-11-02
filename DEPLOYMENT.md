# 🚀 PlacementIQ - Deployment Guide

## 📋 Table of Contents
- [Local Development Setup](#local-development-setup)
- [Vercel Deployment (Frontend)](#vercel-deployment-frontend)
- [Backend Deployment Options](#backend-deployment-options)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## 🏠 Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- MongoDB 4.0+

### Step 1: Clone the Repository
```bash
git clone https://github.com/Romio1310/PlacementIQ.git
cd PlacementIQ
```

### Step 2: Backend Setup
```bash
cd backend

# Create virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp ../.env.example .env

# Edit .env and update MongoDB URL if needed
# MONGO_URL=mongodb://localhost:27017
```

### Step 3: Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install --legacy-peer-deps

# Create .env file
echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env
```

### Step 4: Start MongoDB
```bash
# Start MongoDB service
mongod --dbpath ~/data/db --fork --logpath /tmp/mongodb.log

# Or using Homebrew (macOS)
brew services start mongodb-community
```

### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
python3 -m uvicorn server:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 🌐 Vercel Deployment (Frontend)

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository: `Romio1310/PlacementIQ`

3. **Configure Build Settings**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

4. **Set Environment Variables** (in Vercel Dashboard)
   ```
   REACT_APP_BACKEND_URL=https://your-backend-url.com
   ```

5. **Deploy!** 🎉

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow the prompts:
# - Set up and deploy: Y
# - Scope: Select your account
# - Link to existing project: N
# - Project name: placementiq
# - Directory: ./
# - Override build settings: N

# For production deployment
vercel --prod
```

---

## 🖥️ Backend Deployment Options

Since Vercel primarily hosts frontend/serverless, you need to deploy the backend separately.

### Option 1: Railway.app (Easiest)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add **environment variables:**
   ```
   MONGO_URL=<your-mongodb-atlas-connection-string>
   JWT_SECRET_KEY=<generate-random-secret>
   CORS_ORIGINS=https://your-frontend-vercel-url.vercel.app
   ```
5. Railway will auto-detect Python and deploy!
6. Copy the backend URL and update your Vercel frontend environment variable

### Option 2: Render.com (Free Tier)

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect your GitHub repo
4. Configure:
   - **Name:** placementiq-backend
   - **Root Directory:** `backend`
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (same as Railway)
6. Deploy!

### Option 3: Heroku

```bash
# Install Heroku CLI
brew install heroku  # or download from heroku.com

# Login
heroku login

# Create app
cd backend
heroku create placementiq-backend

# Add Python buildpack
heroku buildpacks:set heroku/python

# Create Procfile in backend folder
echo "web: uvicorn server:app --host 0.0.0.0 --port \$PORT" > Procfile

# Set environment variables
heroku config:set MONGO_URL=<your-mongodb-url>
heroku config:set JWT_SECRET_KEY=<your-secret>
heroku config:set CORS_ORIGINS=https://your-frontend.vercel.app

# Deploy
git subtree push --prefix backend heroku main

# Or if subtree doesn't work:
git push heroku `git subtree split --prefix backend main`:main --force
```

### MongoDB Atlas Setup (Required for Production)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow all - or specific IPs)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/placementiq_db`
6. Use this as `MONGO_URL` in your backend deployment

---

## 🔐 Environment Variables

### Backend (.env)
```bash
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/placementiq_db
DB_NAME=placementiq_db
CORS_ORIGINS=https://your-frontend.vercel.app
JWT_SECRET_KEY=your-super-secret-jwt-key-min-32-chars
```

### Frontend (.env)
```bash
REACT_APP_BACKEND_URL=https://your-backend.railway.app
```

**⚠️ Important:**
- Never commit `.env` files to GitHub
- Always use `.env.example` as a template
- Generate a secure JWT secret: `openssl rand -hex 32`

---

## 🔧 Troubleshooting

### Frontend Build Issues

**Problem:** `npm install` fails with dependency conflicts
```bash
# Solution: Use legacy peer deps
npm install --legacy-peer-deps
```

**Problem:** Frontend can't connect to backend
```bash
# Check .env file
cat frontend/.env

# Should show:
REACT_APP_BACKEND_URL=https://your-backend-url.com

# Rebuild after changing env
npm run build
```

### Backend Issues

**Problem:** MongoDB connection fails
```bash
# Check MongoDB is running
mongod --version

# Test connection
python3 -c "from pymongo import MongoClient; client = MongoClient('your-mongo-url'); print(client.server_info())"
```

**Problem:** CORS errors
```bash
# Update CORS_ORIGINS in backend .env
CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

### Vercel Deployment Issues

**Problem:** Build fails on Vercel
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Try building locally first: `npm run build`

**Problem:** Environment variables not working
- Environment variables must start with `REACT_APP_` for React
- Rebuild deployment after adding env vars
- Check Vercel dashboard → Settings → Environment Variables

---

## 📊 Deployment Checklist

Before deploying to production:

- [ ] Update MongoDB to Atlas (cloud)
- [ ] Set strong JWT secret
- [ ] Configure CORS properly
- [ ] Test all API endpoints
- [ ] Set environment variables in Vercel
- [ ] Deploy backend to Railway/Render/Heroku
- [ ] Update frontend backend URL
- [ ] Test registration/login
- [ ] Test all CRUD operations
- [ ] Monitor logs for errors

---

## 🎯 Quick Deploy Summary

**Fastest way to deploy:**

1. **Backend:** Railway.app
   - Connect GitHub → Auto-deploy
   - Add MongoDB Atlas connection string
   - Copy backend URL

2. **Frontend:** Vercel
   - Import from GitHub
   - Set `REACT_APP_BACKEND_URL`
   - Deploy!

3. **Database:** MongoDB Atlas
   - Free tier cluster
   - Copy connection string
   - Use in Railway

**Total time:** ~15 minutes ⚡

---

## 📞 Support

- **Issues:** Create an issue on GitHub
- **Documentation:** See main README.md
- **API Docs:** Visit `/docs` endpoint on your backend

Happy Deploying! 🚀
