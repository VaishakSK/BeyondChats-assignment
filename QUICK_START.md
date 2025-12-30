# Quick Start Guide

Get the BeyondChats Article Management System up and running in minutes!

## 🚀 3-Step Setup

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Task 3 (Article Enhancement)
cd ../task3
npm install
```

### Step 2: Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend runs on `http://localhost:5173`

### Step 3: Use the Application

1. Open `http://localhost:5173` in your browser
2. **Phase 2 Tab**:
   - Click "Scrape BeyondChats Articles" to fetch articles
   - Click "Enhance with AI" to improve articles
   - Click articles to view Original/Enhanced versions

## ✅ Pre-Configured

- ✅ MongoDB Atlas connection
- ✅ SerpAPI key
- ✅ Gemini API key

**No configuration needed!** Everything is ready to use.

## 🎯 Quick Actions

### Scrape Articles
1. Go to Phase 2 tab
2. Click "Scrape BeyondChats Articles"
3. Wait ~30 seconds
4. Articles appear in list

### Enhance Article
1. Click "Enhance with AI" on any article
2. Wait 1-2 minutes
3. Click the article to view
4. Switch between "Original" and "Enhanced" tabs

### View Versions
1. Click any article card
2. See version tabs (if enhanced)
3. Switch between Original/Enhanced
4. View reference articles in enhanced version

## 🐛 Troubleshooting

**Backend won't start?**
- Check if port 5000 is available
- Verify MongoDB connection

**Frontend shows errors?**
- Make sure backend is running
- Check browser console for details

**Enhancement fails?**
- Check backend console for errors
- Verify API keys are valid
- Wait a bit and try again

## 📚 Need More Details?

- See `README.md` for full documentation
- See `IMPLEMENTATION.md` for technical details

## 🎉 You're Ready!

Everything is configured and ready to use. Just start the services and begin managing articles!
