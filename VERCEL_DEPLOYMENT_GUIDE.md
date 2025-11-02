# 🚀 Vercel Deployment Guide - PlacementIQ Frontend

This guide will walk you through deploying the PlacementIQ React frontend on Vercel step-by-step.

---

## 📋 Prerequisites

Before you start, make sure you have:
- [x] GitHub account (you already have this ✅)
- [x] Your repository pushed to GitHub: `https://github.com/Romio1310/PlacementIQ.git` ✅
- [ ] Vercel account (free tier works!)
- [ ] Backend deployed (Railway/Render) OR ready to deploy

---

## 🎯 Deployment Steps

### Step 1: Create Vercel Account

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (recommended - easiest setup)
4. Authorize Vercel to access your GitHub repositories

---

### Step 2: Import Your Project

1. Once logged in, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"PlacementIQ"** in the list
4. Click **"Import"** next to it

   **If you don't see your repository:**
   - Click "Adjust GitHub App Permissions"
   - Grant Vercel access to the repository
   - Refresh the page

---

### Step 3: Configure Project Settings

Vercel will show you a configuration screen. Here's what to set:

#### **Framework Preset:**
- Vercel should auto-detect: **"Create React App"** ✅
- If not, select it manually from the dropdown

#### **Root Directory:**
- Click **"Edit"** next to Root Directory
- Set to: `frontend`
- This tells Vercel where your React app is located

#### **Build & Output Settings:**
Vercel auto-detects these from your package.json, but verify:
- **Build Command:** `npm run build` or `craco build` ✅
- **Output Directory:** `build` ✅
- **Install Command:** `npm install` ✅

#### **Environment Variables:**
This is CRITICAL! Click **"Environment Variables"** and add:

| Name | Value | Notes |
|------|-------|-------|
| `REACT_APP_BACKEND_URL` | `https://your-backend-url.com` | ⚠️ Replace with actual backend URL |
| `REACT_APP_ENABLE_VISUAL_EDITS` | `false` | Disable dev features |
| `ENABLE_HEALTH_CHECK` | `false` | Disable health checks |

**Important Notes:**
- ⚠️ **Don't include trailing slash** in backend URL (use `https://api.example.com` not `https://api.example.com/`)
- If you haven't deployed the backend yet, you can add this later (see "Update Environment Variables" below)
- For now, you can use a placeholder: `https://placeholder-backend.com`

---

### Step 4: Deploy!

1. Click the big blue **"Deploy"** button
2. Vercel will:
   - Clone your repository
   - Install dependencies (`npm install --legacy-peer-deps`)
   - Build your React app (`npm run build`)
   - Deploy to a URL like: `https://placement-iq-xyz123.vercel.app`

3. **Wait 2-5 minutes** for deployment to complete

4. You'll see a success screen with:
   - 🎉 Congratulations message
   - 🔗 Your live URL
   - 📸 Screenshot preview

---

### Step 5: Visit Your Deployed App

1. Click **"Visit"** or the deployment URL
2. Your PlacementIQ frontend is now live! 🎉

**Expected behavior:**
- ✅ Landing page loads
- ✅ Navigation works
- ⚠️ Login/Register won't work yet (need backend)
- ⚠️ API calls will fail (need backend URL)

---

## 🔧 Post-Deployment Configuration

### Update Environment Variables (After Backend Deployment)

Once you've deployed your backend to Railway/Render:

1. Go to your Vercel project dashboard
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in sidebar
4. Find `REACT_APP_BACKEND_URL`
5. Click **"Edit"** (pencil icon)
6. Update with your actual backend URL:
   - Railway: `https://your-app.up.railway.app`
   - Render: `https://your-app.onrender.com`
7. Click **"Save"**
8. **Important:** Go to "Deployments" tab and click **"Redeploy"** to apply changes

---

## 🎨 Custom Domain (Optional)

Want to use your own domain instead of `*.vercel.app`?

1. Go to **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter your domain (e.g., `placementiq.com`)
4. Follow DNS configuration instructions
5. Vercel automatically provides free SSL certificate

---

## 🔄 Automatic Deployments

Good news! Vercel automatically redeploys when you push to GitHub:

1. You push code to `main` branch
2. Vercel detects the change
3. Automatically rebuilds and deploys
4. New version is live in ~2 minutes

**To disable auto-deploy:**
- Settings → Git → Disable "Production Branch"

---

## 🐛 Troubleshooting

### Build Failed

**Problem:** Build fails with dependency errors

**Solution:**
1. Go to **Settings** → **General**
2. Under "Build & Development Settings"
3. Override Install Command: `npm install --legacy-peer-deps`
4. Click **Save**
5. Go to **Deployments** → **Redeploy**

---

### 404 on Refresh

**Problem:** Refreshing any page (except home) shows 404

**Solution:** This is already fixed in your `vercel.json`! The file redirects all routes to index.html for React Router.

If it's not working:
1. Check `vercel.json` exists in root
2. Redeploy the project

---

### Environment Variables Not Working

**Problem:** Backend URL not being used, API calls fail

**Checklist:**
- [ ] Variable name starts with `REACT_APP_` (required for Create React App)
- [ ] No trailing slash in URL
- [ ] Redeployed after adding/changing variables
- [ ] URL is accessible (test in browser)

**Solution:**
1. Settings → Environment Variables
2. Verify `REACT_APP_BACKEND_URL` is set
3. Deployments → Click "..." → **Redeploy**

---

### CORS Errors

**Problem:** Browser console shows CORS errors when calling backend

**This is a BACKEND issue**, not Vercel. Fix in your backend:

1. Update `backend/server.py`:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-app.vercel.app"],  # Your Vercel URL
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. Or use environment variable:
   - Railway/Render: Set `CORS_ORIGINS=https://your-app.vercel.app`

---

## 📊 Monitoring Your Deployment

### View Deployment Logs

1. Go to **Deployments** tab
2. Click on any deployment
3. Click **"Building"** or **"Deployment Summary"**
4. View real-time logs

### Analytics (Free on Vercel)

1. Click **"Analytics"** tab
2. View:
   - Page views
   - Visitor countries
   - Top pages
   - Performance metrics

---

## 🚀 Quick Checklist

Use this checklist when deploying:

### Pre-Deployment:
- [ ] Code pushed to GitHub
- [ ] `frontend/.env` is in `.gitignore` (not committed)
- [ ] `vercel.json` exists in project root
- [ ] Build works locally (`cd frontend && npm run build`)

### During Deployment:
- [ ] Selected correct repository (PlacementIQ)
- [ ] Set root directory to `frontend`
- [ ] Framework preset is "Create React App"
- [ ] Added `REACT_APP_BACKEND_URL` environment variable
- [ ] Clicked Deploy button

### Post-Deployment:
- [ ] Deployment succeeded (green checkmark)
- [ ] Visited the deployed URL
- [ ] Landing page loads correctly
- [ ] Updated backend CORS to allow Vercel URL
- [ ] Tested login/register with backend connected

---

## 🎯 Next Steps After Frontend Deployment

1. **Deploy Backend** (if not done yet):
   - See `DEPLOYMENT.md` for Railway/Render instructions
   - Get backend URL

2. **Update Frontend Environment Variable**:
   - Add backend URL to Vercel
   - Redeploy

3. **Test Full Application**:
   - Register new user
   - Login
   - Create student/company/drive
   - Check analytics

4. **Setup MongoDB Atlas** (for production database):
   - See `DEPLOYMENT.md` MongoDB Atlas section
   - Update backend env variables

5. **Configure Custom Domain** (optional):
   - Add your domain in Vercel
   - Update DNS settings

---

## 📞 Need Help?

If you run into issues:

1. **Check Vercel Deployment Logs**: Most errors are shown here with clear messages
2. **Check Browser Console**: For frontend errors (F12 → Console tab)
3. **Review DEPLOYMENT.md**: More detailed backend deployment info
4. **Check Vercel Docs**: https://vercel.com/docs

---

## 🎉 Success!

Once deployed, your PlacementIQ frontend will be:
- ✅ Live on the internet
- ✅ Automatically deployed on git push
- ✅ Secured with HTTPS (free SSL)
- ✅ Globally distributed (CDN)
- ✅ Analytics enabled

**Your live URL:** `https://your-project.vercel.app`

Share it with your team and start managing placements! 🚀

---

**Last Updated:** November 3, 2025
