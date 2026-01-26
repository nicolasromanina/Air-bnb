# 🚀 PRODUCTION DEPLOYMENT CHECKLIST

## ✅ Backend Configuration Status

### Local Files - Ready to Push
- [x] `backend/.env` - FRONTEND_URL updated to `https://air-frontend-neon.vercel.app`
- [x] `backend/.env` - MONGODB_URI fixed (typo corrected)
- [x] `backend/src/app.ts` - CORS auto-configured via FRONTEND_URL env var
- [x] `render.yaml` - Build command includes devDependencies

### Render Dashboard - Required Actions
1. **Go to**: https://dashboard.render.com
2. **Select Service**: `airbnb-backend`
3. **Verify Environment Variables**:
   - `NODE_ENV` = `production` ✅
   - `MONGODB_URI` = `mongodb+srv://airbnb_user:d4CdJV6T8E8EIJvR@airrbnb-cluster.upznduc.mongodb.net/?appName=airrbnb-cluster` ✅
   - `FRONTEND_URL` = `https://air-frontend-neon.vercel.app` ✅
   - `JWT_SECRET` = (configured) ✅
   - `STRIPE_SECRET_KEY` = (configured) ✅
   - `STRIPE_PUBLISHABLE_KEY` = (configured) ✅
   - `STRIPE_WEBHOOK_SECRET` = (configured) ✅

**Action**: Press "Save" if any changes made. Service auto-redeploys.

---

## ✅ Frontend Configuration Status

### Local Files - Ready to Push
- [x] `src/config/env.ts` - Falls back to `https://airbnb-backend.onrender.com/api`
- [x] `.env.local` - Development points to `http://localhost:3000/api`
- [x] `.env.production` - Production points to backend (new file created)

### Vercel Dashboard - Required Actions
1. **Go to**: https://vercel.com/dashboard
2. **Select Project**: `air-frontend-neon`
3. **Settings** → **Environment Variables**
4. **Add/Update**:
   ```
   VITE_API_URL = https://airbnb-backend.onrender.com/api
   VITE_STRIPE_PUBLISHABLE_KEY = pk_live_xxxxx (production key when ready)
   ```

**Action**: Save variables → Project auto-redeploys within 2-3 minutes.

---

## 🔄 Deployment Order

### Step 1: Push Backend Changes (2 minutes)
```bash
cd backend
git add .env
git commit -m "Fix: Correct production URLs and MongoDB URI typo"
git push origin main
```
**Expected**: Render auto-detects push, rebuilds, redeploys in ~2 minutes.

### Step 2: Configure Render Dashboard (1 minute)
- Verify all env vars are present (list above)
- Click Save if changed
- Render auto-redeploys

### Step 3: Configure Vercel Dashboard (2 minutes)
- Add environment variables (list above)
- Save
- Wait for auto-redeploy (~2-3 minutes)

### Step 4: Test Production (5 minutes)

#### Test 4a: Backend Health
```bash
curl https://airbnb-backend.onrender.com/health
```
**Expected Response**:
```json
{"status":"OK"}
```

#### Test 4b: Frontend Loads
Open in browser: `https://air-frontend-neon.vercel.app/contact`
- Page should load without timeout
- Console (F12) should show no CORS errors

#### Test 4c: API Communication
Open browser console (F12) and run:
```javascript
fetch('https://airbnb-backend.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend Connected:', d))
  .catch(e => console.error('❌ Backend Error:', e))
```
**Expected**: Console shows `✅ Backend Connected: {status: 'OK'}`

#### Test 4d: Full Page Features
- Try to submit contact form → should reach backend
- Try to login → should communicate with backend
- Check Network tab → requests to `https://airbnb-backend.onrender.com/api/*`

---

## 🔧 Troubleshooting

### Issue: "API Error: timeout of 10000ms exceeded"
**Cause**: Frontend/Backend not communicating  
**Solution**: 
1. Verify `VITE_API_URL` on Vercel matches your backend URL
2. Check backend `/health` endpoint is accessible
3. Verify `FRONTEND_URL` on Render matches your Vercel domain

### Issue: "CORS Error"
**Cause**: Render CORS not configured for Vercel domain  
**Solution**: 
1. Add `FRONTEND_URL=https://air-frontend-neon.vercel.app` to Render env vars
2. Service auto-restarts with new CORS config

### Issue: "Cannot connect to MongoDB"
**Cause**: MONGODB_URI typo or connectivity issue  
**Solution**:
1. Check Render logs: Dashboard → Service → Logs
2. Verify MongoDB Atlas whitelist includes Render IP
3. Test connection: `npm run test:mongo` in backend

### Issue: Backend keeps crashing on Render
**Cause**: Build or runtime errors  
**Solution**:
1. Check Render logs for error details
2. Verify all @types packages installed locally
3. Run `npm run build` locally to test compilation
4. Push fixes and redeploy

---

## 📊 Current State

| Component | Env | Status | URL |
|-----------|-----|--------|-----|
| Frontend | Production | Ready | https://air-frontend-neon.vercel.app |
| Backend | Production | Ready | https://airbnb-backend.onrender.com |
| Database | MongoDB Atlas | ✅ | mongodb+srv://... |
| Config Files | Local | ✅ Ready to Push | - |
| Vercel Env Vars | Dashboard | ⏳ Needs Config | - |
| Render Env Vars | Dashboard | ⏳ Needs Verify | - |

---

## 📝 Summary

**You have completed:**
- ✅ Backend code (production-ready)
- ✅ Frontend code (production-ready)
- ✅ MongoDB Atlas setup
- ✅ Local configuration files
- ✅ CORS configuration (auto-reads env vars)
- ✅ Security hardening (Helmet, rate limiting, HSTS)

**You need to do (5 minutes total):**
1. Push backend changes to GitHub
2. Add `VITE_API_URL` to Vercel environment variables
3. Verify `FRONTEND_URL` on Render environment variables
4. Test API connectivity via curl and browser

**Expected Result:**
Frontend and Backend communication working in production!

---

**Questions?** Check PRODUCTION_CONFIG.md for detailed steps.
