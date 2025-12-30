# Deployment Checklist for Render

Use this checklist to ensure everything is set up correctly before and after deployment.

## ✅ Pre-Deployment Checklist

### Backend
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB database user created
- [ ] MongoDB IP whitelist configured (0.0.0.0/0 for Render)
- [ ] MongoDB connection string copied
- [ ] SerpAPI key obtained
- [ ] Gemini API key obtained
- [ ] `backend/package.json` has `start` script
- [ ] `backend/server.js` uses `process.env.PORT`

### Frontend
- [ ] Code pushed to GitHub
- [ ] `frontend/package.json` has `build` script
- [ ] `vite.config.js` configured correctly
- [ ] API URLs use environment variables

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend
- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Add environment variables:
  - [ ] `MONGODB_URI`
  - [ ] `PORT=10000`
  - [ ] `NODE_ENV=production`
  - [ ] `SERPAPI_KEY`
  - [ ] `GEMINI_API_KEY`
  - [ ] `GEMINI_MODEL=gemini-2.5-flash`
- [ ] Deploy and wait for success
- [ ] Copy backend URL
- [ ] Test health endpoint: `https://your-backend.onrender.com/api/health`

### Step 2: Deploy Frontend
- [ ] Create new Static Site on Render
- [ ] Connect same GitHub repository
- [ ] Set Root Directory: `frontend`
- [ ] Set Build Command: `npm install && npm run build`
- [ ] Set Publish Directory: `dist`
- [ ] Add environment variable:
  - [ ] `VITE_NODE_API_URL=https://your-backend.onrender.com/api`
- [ ] Deploy and wait for success
- [ ] Copy frontend URL

### Step 3: Update Backend CORS
- [ ] Go to backend service → Environment
- [ ] Update `CORS_ORIGIN` to frontend URL
- [ ] Add `API_BASE_URL` environment variable
- [ ] Save and wait for redeploy

---

## ✅ Post-Deployment Verification

### Backend Tests
- [ ] Health check: `https://your-backend.onrender.com/api/health` returns OK
- [ ] CORS headers allow frontend origin
- [ ] MongoDB connection successful (check logs)
- [ ] API endpoints accessible

### Frontend Tests
- [ ] Frontend loads without errors
- [ ] Can fetch articles from backend
- [ ] Can scrape articles
- [ ] Can enhance articles
- [ ] Can view article versions
- [ ] No CORS errors in browser console

### Integration Tests
- [ ] Scrape articles works
- [ ] Enhance article works
- [ ] View versions works
- [ ] All API calls succeed

---

## 🔧 Common Issues & Fixes

### Issue: Backend spins down
**Fix**: Use uptime monitor or upgrade to paid plan

### Issue: CORS errors
**Fix**: 
1. Check `CORS_ORIGIN` matches frontend URL exactly
2. Include `https://` protocol
3. No trailing slash

### Issue: Environment variables not working
**Fix**:
1. Restart service after adding variables
2. Check variable names match exactly (case-sensitive)
3. No spaces around `=` sign

### Issue: Build fails
**Fix**:
1. Check build logs
2. Verify Node.js version
3. Check all dependencies in package.json

---

## 📊 Monitoring

After deployment, monitor:
- [ ] Backend uptime
- [ ] API response times
- [ ] Error rates
- [ ] MongoDB connection status

---

## 🔄 Updates

To update your deployment:
1. Push changes to GitHub
2. Render auto-deploys (or manually trigger)
3. Monitor deployment logs
4. Test after deployment completes

---

## 📝 URLs to Save

- Backend URL: `https://________________.onrender.com`
- Frontend URL: `https://________________.onrender.com`
- MongoDB Atlas Dashboard: `https://cloud.mongodb.com`
- Render Dashboard: `https://dashboard.render.com`

