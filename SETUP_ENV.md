# Environment Variables Setup Guide

This project requires environment variables to be set in `.env` files. **All API keys and secrets have been removed from the codebase** for security.

## Required .env Files

### 1. Backend (`backend/.env`)

Create `backend/.env` with the following:

```env
# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:5173

# MongoDB Connection (REQUIRED)
# Get your MongoDB connection string from MongoDB Atlas or your local MongoDB instance
MONGODB_URI=your_mongodb_connection_string_here
```

**How to get MongoDB URI:**
- **MongoDB Atlas**: Go to your cluster → Connect → Connect your application → Copy connection string
- **Local MongoDB**: `mongodb://localhost:27017/your_database_name`

### 2. Task 3 (`backend/task3/.env`)

Create `backend/task3/.env` with the following:

```env
# API Base URL
API_BASE_URL=http://localhost:5000/api

# Google Search Configuration - SerpAPI (REQUIRED)
# Get your key from: https://serpapi.com/
SERPAPI_KEY=your_serpapi_key_here

# Alternative: Google Custom Search API (if not using SerpAPI)
# GOOGLE_API_KEY=your_google_api_key_here
# GOOGLE_CSE_ID=your_custom_search_engine_id_here

# LLM Configuration - Google Gemini (REQUIRED)
# Get your key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

**How to get API keys:**
- **SerpAPI**: Sign up at https://serpapi.com/ and get your API key from the dashboard
- **Gemini API**: Go to https://makersuite.google.com/app/apikey and create a new API key

## Quick Setup

1. **Copy example files** (if they exist):
   ```bash
   cp backend/.env.example backend/.env
   cp backend/task3/.env.example backend/task3/.env
   ```

2. **Edit the `.env` files** and add your actual API keys and connection strings

3. **Never commit `.env` files** - they're already in `.gitignore`

## Verification

After setting up your `.env` files:

1. **Backend**: Start the server - it will exit with an error if `MONGODB_URI` is missing
2. **Task 3**: Try enhancing an article - it will show clear errors if API keys are missing

## Security Notes

- ✅ All hardcoded API keys have been removed from the codebase
- ✅ Code will throw clear errors if required environment variables are missing
- ✅ `.env` files are in `.gitignore` and won't be committed
- ⚠️ Never share your `.env` files or commit them to version control
- ⚠️ Use different API keys for development and production

