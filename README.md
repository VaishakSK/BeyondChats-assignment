# BeyondChats Article Management System

A comprehensive full-stack article management system with AI-powered content enhancement capabilities. This project implements a React frontend, Node.js/Express backend with MongoDB, and an automated article enhancement system using Google Search and Gemini AI.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Phases](#project-phases)

## 🎯 Overview

This project is a complete article management system built in three phases:

1. **Phase 1**: React frontend that fetches and displays articles from Laravel APIs
2. **Phase 2**: Node.js backend with MongoDB for scraping, storing, and managing articles with full CRUD operations
3. **Phase 3**: AI-powered article enhancement system that improves articles using Google Search results and Gemini AI

## ✨ Features

### Phase 1: Laravel API Integration
- ✅ Fetch articles from Laravel API endpoints
- ✅ Display original articles and their update versions
- ✅ Responsive, modern UI with smooth animations
- ✅ Professional card-based article layout

### Phase 2: Node.js API with MongoDB
- ✅ Scrape articles from BeyondChats blog (5 oldest articles)
- ✅ Store articles in MongoDB Atlas
- ✅ Full CRUD APIs for article management
- ✅ Article versioning system
- ✅ View article update history
- ✅ Beautiful, user-friendly frontend interface

### Phase 3: AI Article Enhancement
- ✅ Google Search integration (SerpAPI)
- ✅ Automatic content scraping from top-ranking articles
- ✅ AI-powered article enhancement using Gemini 2.5 Flash
- ✅ Automatic citation generation
- ✅ Separate database collection for enhanced articles
- ✅ Version comparison (Original vs Enhanced)
- ✅ Reference articles tracking

## 📁 Project Structure

```
beyondChats-assignment/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ArticleCard.jsx
│   │   │   ├── ArticleList.jsx
│   │   │   ├── ArticleModal.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── services/           # API service layer
│   │   │   └── apiService.js
│   │   ├── App.jsx             # Main app component
│   │   ├── App.css             # App styles
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Node.js/Express backend
│   ├── controllers/            # Request handlers
│   │   ├── articleController.js
│   │   ├── enhancedArticleController.js
│   │   └── scrapeController.js
│   ├── models/                 # MongoDB models
│   │   ├── Article.js
│   │   └── EnhancedArticle.js
│   ├── routes/                 # API routes
│   │   ├── articleRoutes.js
│   │   ├── enhancedArticleRoutes.js
│   │   ├── enhanceRoutes.js
│   │   └── scrapeRoutes.js
│   ├── server.js               # Express server
│   └── package.json
│
├── backend/
│   ├── task3/                   # Article enhancement system
│   ├── services/
│   │   ├── googleSearch.js     # Google Search integration
│   │   ├── articleScraper.js   # Web scraping service
│   │   ├── llmService.js       # Gemini AI integration
│   │   └── apiService.js       # API client
│   ├── utils/
│   │   └── citationFormatter.js
│   ├── index.js                # Main enhancement script
│   └── package.json
│
└── README.md                    # This file
```

## 🛠 Technology Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls
- **Modern CSS** - Gradients, animations, responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database (MongoDB Atlas)
- **Mongoose** - MongoDB object modeling
- **Cheerio** - HTML parsing and web scraping
- **Axios** - HTTP requests

### Task 3 (Article Enhancement)
- **Google Generative AI** - Gemini 2.5 Flash for content enhancement
- **SerpAPI** - Google Search API
- **Cheerio** - Web scraping from search results
- **Axios** - HTTP client

### Database
- **MongoDB Atlas** - Cloud-hosted MongoDB
- **Two Collections**:
  - `articles` - Original and scraped articles
  - `enhancedarticles` - AI-enhanced articles with metadata

## 🔄 How It Works

### Phase 1: Article Display
1. Frontend fetches articles from Laravel API (or Node.js backend)
2. Displays articles in a responsive card layout
3. Shows original articles and their update versions
4. Modal view for detailed article content

### Phase 2: Article Scraping & Management
1. User clicks "Scrape BeyondChats Articles"
2. Backend finds the last page of BeyondChats blog
3. Extracts 5 oldest articles
4. Stores articles in MongoDB with full metadata
5. Frontend displays articles with CRUD operations

### Phase 3: AI Article Enhancement
1. User clicks "Enhance with AI" on any article
2. System searches Google for similar articles
3. Scrapes content from top 2 blog/article results
4. Uses Gemini AI to enhance article matching top-ranking style
5. Adds citations and reference articles
6. Saves enhanced article to separate collection
7. Frontend shows version tabs (Original/Enhanced)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (or local MongoDB)
- API keys (already configured in code):
  - SerpAPI key
  - Gemini API key

### Installation

1. **Clone the repository** (if applicable)

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

4. **Install Task 3 Dependencies**
```bash
cd backend/task3
npm install
```

### Configuration

**Environment Variables Required**:

1. **Backend** (`backend/.env`):
   ```env
   PORT=5000
   CORS_ORIGIN=http://localhost:5173
   MONGODB_URI=your_mongodb_connection_string
   ```

2. **Task 3** (`backend/task3/.env`):
   ```env
   API_BASE_URL=http://localhost:5000/api
   SERPAPI_KEY=your_serpapi_key
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-2.5-flash
   ```

**Setup Steps**:
1. Copy `.env.example` files to `.env` in each directory (`backend/`, `backend/task3/`)
2. Fill in your actual API keys and MongoDB connection string
3. Never commit `.env` files to version control (they're in `.gitignore`)

**Getting API Keys**:
- **SerpAPI**: Get your key from https://serpapi.com/
- **Gemini API**: Get your key from https://makersuite.google.com/app/apikey
- **MongoDB**: Get connection string from MongoDB Atlas or use local MongoDB

### Running the Application

1. **Start Backend Server**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

2. **Start Frontend**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

3. **Using the Application**
   - Open `http://localhost:5173` in your browser
   - **Phase 1 Tab**: View articles from API
   - **Phase 2 Tab**: 
     - Click "Scrape BeyondChats Articles" to fetch articles
     - Click "Enhance with AI" to improve articles
     - View, manage, and delete articles
     - Click articles to view Original/Enhanced versions

## 📡 API Documentation

### Articles API

#### Get All Articles
```
GET /api/articles
Query Parameters:
  - page: Page number (default: 1)
  - limit: Items per page (default: 10)
  - sort: Sort order (default: -createdAt)
```

#### Get Article by ID
```
GET /api/articles/:id
```

#### Get Article Versions
```
GET /api/articles/:id/versions
Returns: Original article and all update versions
```

#### Create Article
```
POST /api/articles
Body: { title, content, author, sourceUrl, ... }
```

#### Update Article
```
PUT /api/articles/:id
Creates a new version of the article
```

#### Delete Article
```
DELETE /api/articles/:id
```

### Scraping API

#### Scrape BeyondChats Articles
```
POST /api/scrape/beyondchats
Scrapes 5 oldest articles from BeyondChats blog
```

### Enhanced Articles API

#### Create Enhanced Article
```
POST /api/enhanced-articles
Body: { originalArticleId, title, content, referenceArticles, ... }
```

#### Get Article with Versions
```
GET /api/enhanced-articles/versions/:id
Returns: { original, enhanced, hasEnhanced }
```

#### Get Enhanced Article by Original ID
```
GET /api/enhanced-articles/original/:originalId
Returns: Latest enhanced version
```

### Enhancement API

#### Enhance Article
```
POST /api/enhance/:id
Starts background enhancement process
```

## 📊 Project Phases

### Phase 1: Laravel API Integration
- **Status**: ✅ Complete
- **Purpose**: Display articles from Laravel API
- **Implementation**: React frontend with API service layer
- **Note**: Uses Node.js backend as Laravel API proxy

### Phase 2: Node.js Backend with MongoDB
- **Status**: ✅ Complete
- **Purpose**: Scrape, store, and manage articles
- **Implementation**: 
  - Express.js backend
  - MongoDB with Mongoose
  - Web scraping with Cheerio
  - Full CRUD operations
  - Article versioning

### Phase 3: AI Article Enhancement
- **Status**: ✅ Complete
- **Purpose**: Enhance articles using AI
- **Implementation**:
  - Google Search integration (SerpAPI)
  - Content scraping from search results
  - Gemini AI for content enhancement
  - Citation generation
  - Separate enhanced articles collection
  - Version comparison UI

## 🎨 UI Features

- **Modern Design**: Gradient backgrounds, smooth animations
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Interactive Cards**: Hover effects, click-to-view details
- **Version Tabs**: Switch between Original and Enhanced versions
- **Loading States**: Spinners and progress indicators
- **Error Handling**: User-friendly error messages
- **Modal Views**: Detailed article display with HTML rendering

## 🔑 Key Features

1. **Article Versioning**: Track original and enhanced versions separately
2. **Web Scraping**: Automatically fetch articles from BeyondChats blog
3. **AI Enhancement**: Improve articles using Google Search and Gemini AI
4. **Citation System**: Automatic reference article citations
5. **CRUD Operations**: Full create, read, update, delete functionality
6. **Modern UI**: Beautiful, responsive design with animations

## 📝 Notes

- MongoDB Atlas is pre-configured - no local MongoDB needed
- API keys are hardcoded in services (SerpAPI, Gemini)
- The scraping functionality handles various website structures
- Enhanced articles are stored separately from originals
- Version comparison allows viewing Original vs Enhanced side-by-side

## 🎯 Usage Examples

### Scraping Articles
1. Go to Phase 2 tab
2. Click "Scrape BeyondChats Articles"
3. Wait for scraping to complete
4. View scraped articles in the list

### Enhancing Articles
1. Go to Phase 2 tab
2. Click "Enhance with AI" on any article
3. Wait 1-2 minutes for processing
4. Click the article to view
5. Switch between "Original Version" and "Enhanced Version" tabs

### Viewing Versions
1. Click on any article card
2. If enhanced version exists, see version tabs
3. Click "Original Version" or "Enhanced Version"
4. View reference articles in enhanced version

## 🚧 Future Enhancements

- User authentication and authorization
- Article editing in frontend
- Search and filter functionality
- Pagination UI improvements
- Image upload capability
- Admin dashboard
- Real-time updates with WebSockets
- Multiple enhancement models support

## 📄 License

ISC

## 👤 Author

BeyondChats Assignment Project
