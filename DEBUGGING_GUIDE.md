# Debugging Guide - White Screen Issues

## Issues Fixed

### 1. ✅ Missing Axios Dependency
**Problem:** Axios was listed in package.json but not installed
**Solution:** Installed axios with `npm install axios`

### 2. ✅ Error Handling
**Problem:** API errors could crash the app
**Solution:** 
- Added ErrorBoundary component to catch React errors
- Improved error messages for API failures
- Added helpful messages when Laravel API is not running

### 3. ✅ Default Tab
**Problem:** App defaulted to Phase 1 (Laravel) which might not be running
**Solution:** Changed default to Phase 2 (Node.js API) which is working

## How to Debug White Screen Issues

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Common errors:
   - `Cannot find module 'axios'` → Run `npm install` in frontend folder
   - `Network Error` → Backend not running
   - `CORS error` → Check CORS configuration

### Step 2: Check Network Tab
1. Open DevTools → Network tab
2. Refresh the page
3. Look for failed requests (red status codes)
4. Check if API calls are being made

### Step 3: Verify Dependencies
```bash
cd frontend
npm install
```

### Step 4: Check if Backend is Running
```bash
# Test Node.js backend
curl http://localhost:5000/api/health

# Test Laravel backend (if set up)
curl http://localhost:8000/api/articles
```

### Step 5: Check Environment Variables
Make sure `frontend/.env` exists:
```env
VITE_LARAVEL_API_URL=http://localhost:8000/api
VITE_NODE_API_URL=http://localhost:5000/api
```

### Step 6: Clear Cache and Restart
```bash
# Stop the dev server (Ctrl+C)
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Common Issues and Solutions

### Issue: White Screen with No Errors
**Solution:**
1. Check if `#root` element exists in `index.html`
2. Check browser console for React errors
3. Verify all imports are correct
4. Check if ErrorBoundary is catching errors

### Issue: "Cannot find module" Errors
**Solution:**
```bash
cd frontend
npm install
```

### Issue: API Connection Errors
**Solution:**
1. Make sure backend is running on port 5000
2. Check CORS settings in backend
3. Verify API URLs in frontend `.env`

### Issue: Laravel API Not Found
**Solution:**
- Switch to Phase 2 tab (Node.js API)
- Or set up Laravel API following `LARAVEL_API_SETUP.md`

## Testing Checklist

- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 5173
- [ ] Axios is installed (`npm list axios`)
- [ ] No console errors
- [ ] Network requests are successful
- [ ] Phase 2 tab shows articles (after scraping)
- [ ] Error messages are user-friendly

## Quick Fixes

### If you see a white screen:
1. Open browser console (F12)
2. Check for errors
3. If you see "axios" error: `cd frontend && npm install axios`
4. If you see network errors: Check if backend is running
5. Refresh the page

### If Phase 1 shows errors:
- This is expected if Laravel API is not set up
- Switch to Phase 2 tab to use Node.js API
- Or follow `LARAVEL_API_SETUP.md` to set up Laravel

## Current Status

✅ **Fixed Issues:**
- Axios dependency installed
- Error boundary added
- Better error handling
- Default tab set to Phase 2

✅ **Working:**
- Node.js backend (Phase 2)
- Frontend UI
- Article scraping
- CRUD operations

⚠️ **Requires Setup:**
- Laravel API (Phase 1) - See `LARAVEL_API_SETUP.md`

## Next Steps

1. **Test Phase 2:**
   - Open http://localhost:5173
   - Click "Phase 2: Node.js API" tab
   - Click "Scrape BeyondChats Articles"
   - Verify articles appear

2. **Set up Phase 1 (Optional):**
   - Follow `LARAVEL_API_SETUP.md`
   - Create Laravel API
   - Test Phase 1 tab

3. **If still having issues:**
   - Check browser console
   - Check network tab
   - Verify all services are running
   - Review error messages

