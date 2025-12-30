# BeyondChats Backend API

Node.js/Express backend with MongoDB for article management and web scraping.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```
PORT=5000
MONGODB_URI=mongodb+srv://vaishakkolhar123:vaishaksk@assignment.kjibzln.mongodb.net/?appName=assignment
CORS_ORIGIN=http://localhost:5173
```

3. The MongoDB Atlas connection is already configured. No local MongoDB installation needed.

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Articles
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get article by ID
- `GET /api/articles/:id/versions` - Get article versions (original + updates)
- `POST /api/articles` - Create new article
- `PUT /api/articles/:id` - Update article (creates new version)
- `DELETE /api/articles/:id` - Delete article

### Scraping
- `POST /api/scrape/beyondchats` - Scrape articles from BeyondChats blog

## Usage

To scrape articles from BeyondChats:
```bash
curl -X POST http://localhost:5000/api/scrape/beyondchats
```

