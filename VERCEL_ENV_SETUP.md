# Vercel Environment Variable Setup

## ⚠️ CRITICAL: Vercel Environment Variables

Vercel does NOT automatically use `.env.production` from your git repository.
You MUST set environment variables in the Vercel dashboard.

## 🔧 How to Fix

### Option 1: Set Environment Variable in Vercel Dashboard (RECOMMENDED)

1. Go to: https://vercel.com/dashboard
2. Select your project: `aaz-international`
3. Go to: **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://aaz-inter-production.up.railway.app`
   - **Environment**: Select **Production**, **Preview**, and **Development**
5. Click **Save**
6. Go to **Deployments** tab
7. Find the latest deployment
8. Click **...** (three dots) → **Redeploy**
9. Check **Use existing Build Cache** → Click **Redeploy**

### Option 2: Use Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
cd frontend
vercel link

# Set environment variable
vercel env add VITE_API_URL production
# When prompted, enter: https://aaz-inter-production.up.railway.app

# Trigger new deployment
vercel --prod
```

## ✅ Verification

After setting the environment variable and redeploying:

1. Visit: https://aaz-international.vercel.app
2. Open DevTools → Console
3. Run: `console.log(import.meta.env.VITE_API_URL)`
4. Should show: `https://aaz-inter-production.up.railway.app`
5. Check Network tab - API calls should go to Railway, not localhost

## 🚨 Why This Happened

- `.env.production` in git is for **local production builds**
- Vercel uses its own environment variable system
- Vercel ignores `.env` files from git for security reasons
- You must set env vars in Vercel dashboard or CLI

## 📝 Current Status

- ✅ Backend CORS configured correctly
- ✅ Frontend code uses environment variable
- ❌ Vercel doesn't have the environment variable set
- **ACTION REQUIRED**: Set `VITE_API_URL` in Vercel dashboard
