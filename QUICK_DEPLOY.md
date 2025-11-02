# 🎯 Quick Start: Deploy to Vercel in 5 Minutes

Follow these exact steps to deploy PlacementIQ frontend to Vercel.

---

## ⚡ Super Quick Steps

### 1️⃣ Go to Vercel (1 minute)

**Open your browser and go to:** https://vercel.com

**Click:** "Sign Up" button (top right)

**Choose:** "Continue with GitHub" (the black button)

**Result:** You'll be redirected to GitHub to authorize Vercel

---

### 2️⃣ Import Project (2 minutes)

**After logging in:**

**Click:** "Add New..." button (top right) → Select "Project"

**You'll see:** List of your GitHub repositories

**Find:** "PlacementIQ" repository

**Click:** "Import" button next to it

**If you don't see PlacementIQ:**
- Click "Adjust GitHub App Permissions"
- Select "Only select repositories"
- Check "PlacementIQ"
- Click "Save"
- Go back to Vercel and refresh

---

### 3️⃣ Configure Settings (1 minute)

**Framework Preset:**
- Should auto-detect as "Create React App"
- If not, select it from dropdown

**Root Directory:**
```
Click "Edit" → Type: frontend → Click "Save"
```

**Environment Variables:**
Click "Add Environment Variable" and add:

| Name | Value |
|------|-------|
| `REACT_APP_BACKEND_URL` | `http://localhost:8000` |

> **Note:** You can update this later with your real backend URL

**Leave everything else as default!**

---

### 4️⃣ Deploy! (2-3 minutes)

**Click:** The big blue "Deploy" button at the bottom

**Wait for:**
- "Building..." (2-3 minutes)
- "Deployment Ready" ✅

**You'll see:**
- Confetti animation 🎉
- Your live URL
- Preview screenshot

---

### 5️⃣ Visit Your App! (instant)

**Click:** "Visit" button or the URL

**Your app is LIVE at:** `https://placement-iq-xxxxx.vercel.app`

---

## ✅ What You Just Did

- ✅ Deployed React app to global CDN
- ✅ Got free HTTPS certificate
- ✅ Enabled automatic deployments (pushes to GitHub = auto-deploy)
- ✅ Got analytics for free

---

## 🔄 Next: Deploy Backend

Your frontend is live but needs a backend! Options:

### Option A: Railway (Recommended - Easiest)
1. Go to https://railway.app
2. Sign in with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select "PlacementIQ"
5. Set root directory: `backend`
6. Add environment variables (see below)
7. Deploy!

### Option B: Render (Free Tier)
1. Go to https://render.com
2. Similar process to Railway
3. See DEPLOYMENT.md for details

### Backend Environment Variables Needed:
```bash
MONGO_URL=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/placementiq_db
JWT_SECRET_KEY=<your-strong-random-secret>
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

---

## 🔧 Update Frontend After Backend Deployment

Once backend is deployed:

1. Go to Vercel dashboard
2. Click your project
3. Settings → Environment Variables
4. Edit `REACT_APP_BACKEND_URL`
5. Change to: `https://your-backend-url.com`
6. Deployments tab → Click "Redeploy"

---

## 🎉 Done!

Your full-stack app is now live on the internet! 🚀

**Frontend:** `https://your-app.vercel.app`  
**Backend:** `https://your-backend.railway.app`

---

## 📱 Share Your App

Copy your Vercel URL and share it:
- With your team
- On your resume
- In your portfolio
- With potential employers

---

**Need detailed help?** See `VERCEL_DEPLOYMENT_GUIDE.md` for troubleshooting and advanced configuration.
