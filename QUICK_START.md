# Quick Start Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (installed and running)
- npm or yarn

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy the content below)
# PORT=5000
# MONGODB_URI=mongodb+srv://vaishakkolhar123:vaishaksk@assignment.kjibzln.mongodb.net/?appName=assignment
# CORS_ORIGIN=http://localhost:5173

# Start the backend server
npm run dev
```

Backend should now be running on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Create .env file (copy the content below)
# VITE_LARAVEL_API_URL=http://localhost:8000/api
# VITE_NODE_API_URL=http://localhost:5000/api

# Start the frontend development server
npm run dev
```

Frontend should now be running on `http://localhost:5173`

### 3. Testing Phase 2 (Node.js API)

1. Open `http://localhost:5173` in your browser
2. Click on the "Phase 2: Node.js API" tab
3. Click "Scrape BeyondChats Articles" button
4. Wait for articles to be scraped and displayed
5. Click on any article card to view details
6. Use "View Versions" to see update history
7. Use "Delete" to remove articles

### 4. Laravel API Setup (Phase 1)

**Important:** You need to set up a Laravel API for Phase 1. See `LARAVEL_API_SETUP.md` for complete instructions.

Quick setup:

```bash
# Install Laravel (if not already installed)
composer global require laravel/installer

# Create new Laravel project
composer create-project laravel/laravel laravel-api
cd laravel-api

# Create Article model and migration
php artisan make:model Article -m
php artisan make:controller ArticleController --api

# Run migrations
php artisan migrate

# Start Laravel server
php artisan serve
```

**For detailed setup instructions, see `LARAVEL_API_SETUP.md`**

### 5. Testing Phase 1 (Laravel API)

1. Make sure your Laravel API is running on `http://localhost:8000`
2. Update `VITE_LARAVEL_API_URL` in frontend `.env` if needed
3. Click on the "Phase 1: Laravel API" tab
4. Articles from Laravel API should be displayed

## Troubleshooting

### MongoDB Connection Error
- Verify MONGODB_URI in backend `.env` file
- Check your internet connection (MongoDB Atlas requires internet)
- Ensure MongoDB Atlas cluster is running and accessible

### CORS Errors
- Make sure CORS_ORIGIN in backend `.env` matches frontend URL
- Default: `http://localhost:5173`

### API Connection Errors
- Check if backend is running on port 5000
- Check if Laravel API is running (for Phase 1)
- Verify API URLs in frontend `.env` file

### Scraping Not Working
- The scraping function may need adjustments based on BeyondChats website structure
- Check browser console for errors
- Verify network connectivity

## Common Commands

### Backend
```bash
npm start      # Production mode
npm run dev    # Development mode with nodemon
```

### Frontend
```bash
npm run dev    # Development server
npm run build  # Production build
npm run preview # Preview production build
```

## Next Steps

1. Customize the scraping logic in `backend/controllers/scrapeController.js` based on actual BeyondChats HTML structure
2. Add authentication if needed
3. Implement article editing functionality in the frontend
4. Add more filtering and search options
5. Deploy to production

