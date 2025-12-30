# Deploying to Render - Complete Guide

This guide will walk you through deploying both the backend and frontend to Render.

## 📋 Prerequisites

1. **Render Account**: Sign up at https://render.com (free tier available)
2. **GitHub Repository**: Push your code to GitHub
3. **MongoDB Atlas**: Free cluster at https://www.mongodb.com/cloud/atlas
4. **API Keys**: SerpAPI and Gemini API keys

---

## 🗄️ Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier M0)
4. Create a database user:
   - Database Access → Add New Database User
   - Username: `your_username`
   - Password: `your_password` (save this!)
5. Whitelist IP addresses:
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for Render
6. Get connection string:
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/database?appName=assignment`

---

## 🔧 Step 2: Prepare Your Code

### 2.1 Update CORS for Production

The backend needs to accept requests from your Render frontend URL.

### 2.2 Create Render Configuration (Optional)

You can use `render.yaml` for automated setup, or deploy manually.

---

## 🚀 Step 3: Deploy Backend to Render

### Option A: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Connect your GitHub account
   - Select your repository
   - Click "Connect"

3. **Configure Backend Service**
   - **Name**: `beyondchats-backend` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

4. **Environment Variables**
   Click "Add Environment Variable" and add:
   ```
   MONGODB_URI=your_mongodb_connection_string_from_atlas
   PORT=10000
   CORS_ORIGIN=https://your-frontend-app.onrender.com
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://beyondchats-backend.onrender.com`)

### Option B: Using render.yaml (Automated)

See the `render.yaml` file in the root directory for automated deployment.

---

## 🎨 Step 4: Deploy Frontend to Render

1. **Go to Render Dashboard**
   - Click "New +" → "Static Site"

2. **Configure Frontend**
   - **Name**: `beyondchats-frontend` (or your choice)
   - **Repository**: Same GitHub repository
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Environment Variables**
   Add these environment variables:
   ```
   VITE_NODE_API_URL=https://your-backend-url.onrender.com/api
   ```

   **Important**: Replace `your-backend-url` with your actual backend URL from Step 3.

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment (3-5 minutes)
   - Your frontend will be live at `https://your-frontend-name.onrender.com`

---

## 🔄 Step 5: Update Backend CORS

After deploying frontend, update backend CORS:

1. Go to your backend service on Render
2. Go to "Environment" tab
3. Update `CORS_ORIGIN` to your frontend URL:
   ```
   CORS_ORIGIN=https://your-frontend-name.onrender.com
   ```
4. Click "Save Changes" - Render will automatically redeploy

---

## 🔐 Step 6: Set Up Task 3 Environment Variables

Since Task 3 runs as part of the backend, add these to your **backend** service environment variables:

1. Go to your backend service on Render
2. Go to "Environment" tab
3. Add these variables:
   ```
   SERPAPI_KEY=your_serpapi_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   API_BASE_URL=https://your-backend-url.onrender.com/api
   ```

---

## ✅ Step 7: Verify Deployment

1. **Test Backend Health**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Test Frontend**
   - Visit your frontend URL
   - Should load the application
   - Try scraping articles
   - Try enhancing an article

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend won't start
- **Solution**: Check logs in Render dashboard
- Verify `MONGODB_URI` is correct
- Ensure MongoDB Atlas IP whitelist includes Render IPs

**Problem**: CORS errors
- **Solution**: Update `CORS_ORIGIN` to match your frontend URL exactly
- Include `https://` in the URL

**Problem**: MongoDB connection fails
- **Solution**: 
  - Verify connection string format
  - Check database user credentials
  - Ensure IP whitelist includes `0.0.0.0/0`

### Frontend Issues

**Problem**: Frontend shows "Cannot connect to API"
- **Solution**: 
  - Verify `VITE_NODE_API_URL` is set correctly
  - Check backend is running (visit health endpoint)
  - Ensure backend CORS allows your frontend URL

**Problem**: Build fails
- **Solution**: 
  - Check build logs in Render
  - Ensure all dependencies are in `package.json`
  - Verify Node.js version compatibility

### Enhancement Issues

**Problem**: Article enhancement fails
- **Solution**:
  - Verify `SERPAPI_KEY` and `GEMINI_API_KEY` are set in backend environment
  - Check backend logs for API errors
  - Ensure API keys are valid

---

## 📝 Environment Variables Summary

### Backend Service on Render:
```
MONGODB_URI=mongodb+srv://...
PORT=10000
CORS_ORIGIN=https://your-frontend.onrender.com
NODE_ENV=production
SERPAPI_KEY=your_serpapi_key
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-2.5-flash
API_BASE_URL=https://your-backend.onrender.com/api
```

### Frontend Service on Render:
```
VITE_NODE_API_URL=https://your-backend.onrender.com/api
```

---

## 🔄 Auto-Deploy

Render automatically deploys when you push to your connected branch:
- Push to `main` → Auto-deploys both services
- Check deployment logs in Render dashboard

---

## 💰 Free Tier Limitations

- **Backend**: 
  - Spins down after 15 minutes of inactivity
  - First request after spin-down takes ~30 seconds
  - 750 hours/month free

- **Frontend**: 
  - No spin-down
  - Unlimited requests
  - 100 GB bandwidth/month

**Tip**: Use a free uptime monitor (like UptimeRobot) to ping your backend every 5 minutes to prevent spin-down.

---

## 🎉 You're Live!

Your application is now deployed and accessible worldwide!

- **Frontend**: `https://your-frontend-name.onrender.com`
- **Backend**: `https://your-backend-name.onrender.com`

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [Environment Variables Guide](./SETUP_ENV.md)

