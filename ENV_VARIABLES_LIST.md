# Complete List of Environment Variables

This document lists all environment variables used across the project.

## Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | ✅ **Yes** | None | MongoDB connection string (exits if not set) |
| `PORT` | ❌ No | `5000` | Server port number |
| `CORS_ORIGIN` | ❌ No | `http://localhost:5173` | Allowed CORS origin for frontend |
| `NODE_ENV` | ❌ No | `development` | Node environment (development/production) |

### Example `backend/.env`:
```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?appName=assignment
NODE_ENV=development
```

---

## Task 3 (`backend/task3/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SERPAPI_KEY` | ✅ **Yes*** | None | SerpAPI key for Google searches (required if not using Google Custom Search) |
| `GEMINI_API_KEY` | ✅ **Yes** | None | Google Gemini API key for article enhancement |
| `GOOGLE_API_KEY` | ✅ **Yes*** | None | Alternative to SERPAPI_KEY (required if using Google Custom Search) |
| `GOOGLE_CSE_ID` | ✅ **Yes*** | None | Google Custom Search Engine ID (required if using Google Custom Search) |
| `API_BASE_URL` | ❌ No | `http://localhost:5000/api` | Base URL for the backend API |
| `GEMINI_MODEL` | ❌ No | `gemini-2.5-flash` | Gemini model to use for enhancement |
| `ARTICLE_ID` | ❌ No | None | Article ID for direct script execution (optional) |
| `NODE_ENV` | ❌ No | `development` | Node environment |

**Note**: Either `SERPAPI_KEY` OR (`GOOGLE_API_KEY` + `GOOGLE_CSE_ID`) is required.

### Example `backend/task3/.env`:
```env
API_BASE_URL=http://localhost:5000/api
SERPAPI_KEY=your_serpapi_key_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
NODE_ENV=development
```

### Alternative (using Google Custom Search instead of SerpAPI):
```env
API_BASE_URL=http://localhost:5000/api
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CSE_ID=your_custom_search_engine_id_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

---

## Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_NODE_API_URL` | ❌ No | `http://localhost:5000/api` | Node.js backend API URL |
| `VITE_LARAVEL_API_URL` | ❌ No | `http://localhost:5000/api` | Laravel API URL (falls back to Node.js API) |
| `NODE_ENV` | ❌ No | `development` | Node environment (used for debug info) |

**Note**: Frontend environment variables are optional. The app works with defaults.

### Example `frontend/.env`:
```env
VITE_NODE_API_URL=http://localhost:5000/api
VITE_LARAVEL_API_URL=http://localhost:8000/api
```

---

## Summary by Priority

### 🔴 **Required (Application won't work without these)**:

1. **Backend**:
   - `MONGODB_URI` - MongoDB connection string

2. **Task 3**:
   - `GEMINI_API_KEY` - Gemini API key for article enhancement
   - `SERPAPI_KEY` OR (`GOOGLE_API_KEY` + `GOOGLE_CSE_ID`) - For Google searches

### 🟡 **Optional (Has sensible defaults)**:

1. **Backend**:
   - `PORT` - Defaults to 5000
   - `CORS_ORIGIN` - Defaults to http://localhost:5173
   - `NODE_ENV` - Defaults to development

2. **Task 3**:
   - `API_BASE_URL` - Defaults to http://localhost:5000/api
   - `GEMINI_MODEL` - Defaults to gemini-2.5-flash
   - `ARTICLE_ID` - Only for direct script execution
   - `NODE_ENV` - Defaults to development

3. **Frontend**:
   - `VITE_NODE_API_URL` - Defaults to http://localhost:5000/api
   - `VITE_LARAVEL_API_URL` - Defaults to http://localhost:5000/api
   - `NODE_ENV` - Used for conditional rendering

---

## Quick Reference

### Minimum Required Setup:

**`backend/.env`**:
```env
MONGODB_URI=your_mongodb_connection_string
```

**`backend/task3/.env`**:
```env
SERPAPI_KEY=your_serpapi_key
GEMINI_API_KEY=your_gemini_api_key
```

That's it! Everything else has defaults.

---

## Where Each Variable is Used

- **Backend** (`backend/server.js`):
  - `MONGODB_URI` - MongoDB connection
  - `PORT` - Server port
  - `CORS_ORIGIN` - CORS configuration
  - `NODE_ENV` - Environment detection

- **Task 3** (`backend/task3/services/`):
  - `SERPAPI_KEY`, `GOOGLE_API_KEY`, `GOOGLE_CSE_ID` - `googleSearch.js`
  - `GEMINI_API_KEY`, `GEMINI_MODEL` - `llmService.js`
  - `API_BASE_URL` - `apiService.js`
  - `ARTICLE_ID` - `index.js` (command line argument)

- **Frontend** (`frontend/src/services/apiService.js`):
  - `VITE_NODE_API_URL` - Node.js API endpoint
  - `VITE_LARAVEL_API_URL` - Laravel API endpoint (optional)

