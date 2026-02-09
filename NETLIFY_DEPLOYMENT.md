# Quick Netlify Deployment Guide

## Deploy to Netlify (Alternative to Vercel)

### Step 1: Create Netlify Account & Connect Repository

1. Go to: https://app.netlify.com/
2. Click: **Add new site** → **Import an existing project**
3. Choose: **GitHub**
4. Select repository: `aazinter92-max/Aaz-inter`
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. Click: **Show advanced** → **New variable**
7. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://aaz-inter-production.up.railway.app`
8. Click: **Deploy site**

### Step 2: Configure Redirects for SPA

Netlify needs a `_redirects` file for React Router to work.

Create: `frontend/public/_redirects`

```
/*    /index.html   200
```

### Step 3: Wait for Deployment

1. Watch the deployment logs
2. Should take 2-3 minutes
3. Look for: "Site is live"
4. You'll get a URL like: `https://[random-name].netlify.app`

### Step 4: Verify

1. Visit the Netlify URL
2. Open DevTools → Console
3. Should see: `🔧 API Configuration:` with Railway URL
4. Try login - should work!

## Why Netlify Might Work Better

- ✅ Simpler build process
- ✅ Better environment variable handling
- ✅ Clearer build logs
- ✅ Automatic SPA routing with `_redirects`
- ✅ No cache issues

## Files Needed

I'll create the `_redirects` file for you now.
