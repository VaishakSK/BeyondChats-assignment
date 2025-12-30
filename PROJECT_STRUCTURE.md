# Complete Project Structure

## Directory Tree

```
beyondChats-assignment/
│
├── README.md                          # Main project documentation
├── PROJECT_STRUCTURE.md               # This file - detailed structure
│
├── frontend/                          # React Frontend Application
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/                # Reusable React Components
│   │   │   ├── ArticleCard.jsx       # Individual article card component
│   │   │   ├── ArticleCard.css       # Styles for article cards
│   │   │   ├── ArticleList.jsx       # List container for articles
│   │   │   ├── ArticleList.css      # Styles for article list
│   │   │   ├── ArticleModal.jsx      # Modal for viewing article details
│   │   │   └── ArticleModal.css     # Styles for article modal
│   │   ├── services/                 # API Service Layer
│   │   │   └── apiService.js        # Axios services for Laravel & Node APIs
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── App.jsx                   # Main application component
│   │   ├── App.css                   # Main application styles
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global CSS styles
│   ├── index.html                    # HTML template
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── eslint.config.js              # ESLint configuration
│   ├── .gitignore                    # Git ignore rules
│   ├── .env.example                  # Environment variables template
│   └── README.md                     # Frontend documentation
│
└── backend/                          # Node.js/Express Backend
    ├── controllers/                  # Request Handlers (Business Logic)
    │   ├── articleController.js     # CRUD operations for articles
    │   └── scrapeController.js      # Web scraping logic for BeyondChats
    ├── models/                       # MongoDB Schemas
    │   └── Article.js                # Article model with versioning
    ├── routes/                       # API Route Definitions
    │   ├── articleRoutes.js         # Article CRUD routes
    │   └── scrapeRoutes.js          # Scraping routes
    ├── server.js                     # Express server setup
    ├── package.json                  # Backend dependencies
    ├── .gitignore                    # Git ignore rules
    ├── .env.example                  # Environment variables template
    └── README.md                     # Backend documentation
```

## File Descriptions

### Frontend Files

#### Components
- **ArticleCard.jsx**: Displays individual article in a card format with hover effects
- **ArticleList.jsx**: Container component that renders a grid of article cards
- **ArticleModal.jsx**: Modal dialog for viewing full article details and version history

#### Services
- **apiService.js**: 
  - `laravelArticleService`: Functions to interact with Laravel API (Phase 1)
  - `nodeArticleService`: Functions to interact with Node.js API (Phase 2)

#### Main Files
- **App.jsx**: Main application with tab navigation between Phase 1 and Phase 2
- **App.css**: Modern CSS with gradients, animations, and responsive design

### Backend Files

#### Controllers
- **articleController.js**: 
  - `getAllArticles`: Fetch all articles with pagination
  - `getArticleById`: Fetch single article
  - `getArticleVersions`: Get original article and all updates
  - `createArticle`: Create new article
  - `updateArticle`: Update article (creates new version)
  - `deleteArticle`: Delete article

- **scrapeController.js**:
  - `scrapeBeyondChats`: Scrapes articles from BeyondChats blog and stores in MongoDB

#### Models
- **Article.js**: Mongoose schema with fields:
  - title, content, author, publishedDate
  - sourceUrl, imageUrl, excerpt, tags
  - isScraped, originalArticleId, version
  - timestamps (createdAt, updatedAt)

#### Routes
- **articleRoutes.js**: RESTful routes for article operations
- **scrapeRoutes.js**: Route for triggering web scraping

#### Server
- **server.js**: Express server configuration, MongoDB connection, middleware setup

## Data Flow

### Phase 1: Laravel API
```
Frontend (React) 
  → apiService.laravelArticleService 
  → Laravel API 
  → Display articles
```

### Phase 2: Node.js API
```
Frontend (React)
  → apiService.nodeArticleService
  → Node.js/Express API
  → MongoDB
  → Display articles
```

### Scraping Flow
```
Frontend (React)
  → POST /api/scrape/beyondchats
  → scrapeController.scrapeBeyondChats
  → Cheerio (HTML parsing)
  → Article Model (MongoDB)
  → Return scraped articles
```

## Environment Variables

### Frontend (.env)
```
VITE_LARAVEL_API_URL=http://localhost:8000/api
VITE_NODE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://vaishakkolhar123:vaishaksk@assignment.kjibzln.mongodb.net/?appName=assignment
CORS_ORIGIN=http://localhost:5173
```

## Key Features Implementation

### Versioning System
- Articles can have multiple versions
- `originalArticleId` links updates to original
- `version` field tracks version number
- `/api/articles/:id/versions` endpoint returns original + all updates

### Responsive Design
- Mobile-first approach
- Grid layout adapts to screen size
- Touch-friendly buttons and interactions
- Optimized for tablets and desktops

### Modern UI/UX
- Gradient backgrounds and text
- Smooth animations and transitions
- Hover effects on interactive elements
- Loading states and error handling
- Modal dialogs for detailed views

