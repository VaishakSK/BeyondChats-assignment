# Implementation Details

This document provides detailed information about how the BeyondChats Article Management System is implemented.

## Architecture Overview

The system follows a **three-tier architecture**:
1. **Frontend Layer**: React application with component-based UI
2. **Backend Layer**: Node.js/Express REST API
3. **Data Layer**: MongoDB Atlas (cloud database)

## Phase 1: Laravel API Integration

### Implementation
- **Frontend Service**: `frontend/src/services/apiService.js`
  - `laravelArticleService` - Handles Laravel API calls
  - Adapts Node.js backend responses to Laravel format
  - Fetches articles and versions

### Key Components
- **ArticleList**: Displays articles in card grid
- **ArticleCard**: Individual article card component
- **ArticleModal**: Detailed article view modal

### Data Flow
```
Frontend → apiService → Node.js Backend → MongoDB → Response
```

## Phase 2: Node.js Backend with MongoDB

### Backend Structure

#### Models
- **Article Model** (`backend/models/Article.js`)
  - Schema: title, content, contentHtml, author, publishedDate, sourceUrl, etc.
  - Versioning support with `originalArticleId` and `version` fields
  - Indexes for performance

#### Controllers
- **articleController.js**
  - `getAllArticles`: Paginated article listing
  - `getArticleById`: Single article retrieval
  - `getArticleVersions`: Version history
  - `createArticle`: New article creation
  - `updateArticle`: Article update (creates new version)
  - `deleteArticle`: Article deletion

- **scrapeController.js**
  - `scrapeBeyondChats`: Main scraping function
  - Finds last page of blog
  - Extracts 5 oldest articles
  - Removes unwanted elements (footer, nav, etc.)
  - Preserves HTML formatting
  - Stores in MongoDB

#### Routes
- `/api/articles` - Article CRUD operations
- `/api/articles/:id/versions` - Version history
- `/api/scrape/beyondchats` - Trigger scraping

### Scraping Implementation

**Process**:
1. Fetch blog pagination to find last page
2. Extract article links from last page
3. Sort by published date (oldest first)
4. Select top 5 articles
5. For each article:
   - Remove footer, nav, sidebar, ads
   - Extract title, content, author, date
   - Preserve HTML formatting
   - Clean relative URLs
   - Validate content quality
6. Store in MongoDB

**Content Extraction**:
- Uses multiple CSS selectors for compatibility
- Falls back to body extraction if needed
- Validates minimum content length (100 chars)
- Preserves HTML structure

## Phase 3: AI Article Enhancement

### System Architecture

```
User Action → Frontend → Backend API → Task 3 Script
                                          ↓
                                    Google Search
                                          ↓
                                    Scrape Articles
                                          ↓
                                    Gemini AI
                                          ↓
                                    Save Enhanced Article
```

### Task 3 Implementation

#### Services

**1. GoogleSearchService** (`backend/task3/services/googleSearch.js`)
- Uses SerpAPI for Google searches
- Filters results for blog/article links
- Excludes social media, videos, etc.
- Returns top 2 relevant articles

**2. ArticleScraper** (`backend/task3/services/articleScraper.js`)
- Enhanced HTTP headers to avoid 403 errors
- 25+ CSS selectors for content extraction
- Fallback logic for different website structures
- Handles relative URLs and HTML cleanup
- Minimum content validation (100 chars)

**3. LLMService** (`backend/task3/services/llmService.js`)
- Uses Google Gemini 2.5 Flash
- Fallback to gemini-1.5-flash if needed
- Custom prompts for article enhancement
- Parses AI response (title + content)
- Extracts plain text from HTML

**4. APIService** (`backend/task3/services/apiService.js`)
- Fetches original articles
- Creates enhanced articles in database
- Handles API errors

**5. CitationFormatter** (`backend/task3/utils/citationFormatter.js`)
- Formats reference articles as citations
- HTML and plain text formats
- Includes title, author, date, URL

### Enhancement Process

1. **Fetch Original Article**
   - Gets article from `/api/articles/:id`
   - Validates article exists

2. **Search Google**
   - Searches article title on Google
   - Uses SerpAPI for reliable results
   - Filters for blog/article links

3. **Scrape Reference Articles**
   - Scrapes top 2 results
   - Tries up to 5 URLs if needed
   - Extracts main content with HTML

4. **Enhance with AI**
   - Prepares prompt with original + references
   - Calls Gemini API
   - Parses enhanced title and content
   - Handles model fallbacks

5. **Add Citations**
   - Formats reference articles
   - Appends to content (HTML + text)

6. **Save Enhanced Article**
   - Creates entry in `EnhancedArticle` collection
   - Links to original via `originalArticleId`
   - Stores metadata (model, date, search query)
   - Stores reference articles array

### Enhanced Article Model

```javascript
{
  originalArticleId: ObjectId,      // Link to original
  title: String,                     // Enhanced title
  content: String,                   // Enhanced content (text)
  contentHtml: String,              // Enhanced content (HTML)
  author: String,
  publishedDate: Date,
  sourceUrl: String,
  imageUrl: String,
  excerpt: String,
  tags: [String],
  referenceArticles: [{              // Reference articles used
    title: String,
    url: String,
    author: String,
    publishedDate: Date
  }],
  citations: String,                  // Plain text citations
  citationsHtml: String,             // HTML citations
  enhancedAt: Date,                  // When enhanced
  modelUsed: String,                 // AI model used
  searchQuery: String               // Google search query
}
```

## Frontend Implementation

### Component Structure

**App.jsx**
- Main application component
- Tab navigation (Phase 1 / Phase 2)
- State management for articles
- API integration
- Error handling

**ArticleList.jsx**
- Container for article cards
- Loading and error states
- Empty state handling
- Action button integration

**ArticleCard.jsx**
- Individual article display
- Action buttons (View, Enhance, Delete)
- Click handlers
- Loading states

**ArticleModal.jsx**
- Detailed article view
- Version tabs (Original/Enhanced)
- HTML content rendering
- Reference articles display
- Metadata display

### State Management

- Uses React hooks (useState, useEffect)
- Separate state for Phase 1 and Phase 2 articles
- Loading and error states per phase
- Selected article and versions state
- Enhancement progress tracking

### API Integration

**apiService.js** provides:
- `laravelArticleService`: Phase 1 API calls
- `nodeArticleService`: Phase 2 API calls
  - CRUD operations
  - Scraping trigger
  - Enhancement trigger
  - Version fetching

## Database Design

### Articles Collection
- Stores original and scraped articles
- Versioning via `originalArticleId` and `version`
- Indexed on `publishedDate` and `sourceUrl`

### EnhancedArticles Collection
- Stores AI-enhanced articles
- Linked to originals via `originalArticleId`
- Indexed on `originalArticleId` and `enhancedAt`
- Contains full enhancement metadata

## Error Handling

### Backend
- Try-catch blocks in all controllers
- Proper HTTP status codes
- Detailed error messages
- MongoDB connection error handling

### Frontend
- Error boundaries for React errors
- API error handling with user-friendly messages
- Loading states during async operations
- Graceful degradation

### Task 3
- Comprehensive error handling at each step
- Retry logic for scraping
- Model fallback for AI
- Detailed logging

## Security Considerations

- CORS configured for frontend origin
- Input validation in controllers
- MongoDB injection prevention (Mongoose)
- Error messages don't expose sensitive data
- API keys stored in code (consider environment variables for production)

## Performance Optimizations

- MongoDB indexes on frequently queried fields
- Pagination for article lists
- Efficient scraping with delays
- HTML content caching in frontend
- Lazy loading of article details

## Testing the System

### Manual Testing Steps

1. **Backend**
   - Start server: `cd backend && npm run dev`
   - Test health: `GET http://localhost:5000/api/health`

2. **Frontend**
   - Start dev server: `cd frontend && npm run dev`
   - Open `http://localhost:5173`
   - Test Phase 1 and Phase 2 tabs

3. **Scraping**
   - Click "Scrape BeyondChats Articles"
   - Verify articles appear in list
   - Check article content quality

4. **Enhancement**
   - Click "Enhance with AI" on an article
   - Wait for completion
   - View article and switch versions
   - Verify enhanced content and citations

## Known Limitations

1. **Scraping**: Some websites may block scrapers (403 errors)
2. **Content Extraction**: May not work perfectly for all website structures
3. **AI Enhancement**: Depends on API availability and quotas
4. **Version Display**: Requires enhanced article to exist

## Future Improvements

- Add authentication/authorization
- Implement article editing UI
- Add search and filter functionality
- Improve scraping success rate
- Add more AI model options
- Implement caching for better performance
- Add unit and integration tests

