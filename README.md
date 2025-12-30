# BeyondChats Assignment

Full-stack article management system with React frontend and Node.js backend.

## Project Structure

```
beyondChats-assignment/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ArticleCard.jsx
│   │   │   ├── ArticleCard.css
│   │   │   ├── ArticleList.jsx
│   │   │   ├── ArticleList.css
│   │   │   ├── ArticleModal.jsx
│   │   │   └── ArticleModal.css
│   │   ├── services/         # API service layer
│   │   │   └── apiService.js
│   │   ├── App.jsx           # Main app component
│   │   ├── App.css           # Main app styles
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── backend/                  # Node.js/Express backend
    ├── controllers/          # Request handlers
    │   ├── articleController.js
    │   └── scrapeController.js
    ├── models/               # MongoDB models
    │   └── Article.js
    ├── routes/               # API routes
    │   ├── articleRoutes.js
    │   └── scrapeRoutes.js
    ├── server.js             # Express server
    ├── package.json
    └── .env.example
```

## Features

### Phase 1: Laravel API Integration
- ✅ Fetch articles from Laravel API
- ✅ Display original articles and their update versions
- ✅ Responsive, modern UI with animations
- ✅ Professional card-based layout

### Phase 2: Node.js API with MongoDB
- ✅ Scrape articles from BeyondChats blog (5 oldest articles)
- ✅ Store articles in MongoDB
- ✅ Full CRUD APIs for articles
- ✅ Article versioning system
- ✅ View article update history

## Setup Instructions

### Laravel API Setup (Phase 1)

For Phase 1, you need to set up a Laravel API. See **[LARAVEL_API_SETUP.md](./LARAVEL_API_SETUP.md)** for complete step-by-step instructions.

Quick start:
```bash
composer create-project laravel/laravel laravel-api
cd laravel-api
php artisan serve
```

### Backend Setup (Phase 2)

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://vaishakkolhar123:vaishaksk@assignment.kjibzln.mongodb.net/?appName=assignment
CORS_ORIGIN=http://localhost:5173
```

4. MongoDB Atlas connection is already configured - no local MongoDB needed

5. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_LARAVEL_API_URL=http://localhost:8000/api
VITE_NODE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Node.js Backend

#### Articles
- `GET /api/articles` - Get all articles (with pagination)
- `GET /api/articles/:id` - Get article by ID
- `GET /api/articles/:id/versions` - Get article versions (original + updates)
- `POST /api/articles` - Create new article
- `PUT /api/articles/:id` - Update article (creates new version)
- `DELETE /api/articles/:id` - Delete article

#### Scraping
- `POST /api/scrape/beyondchats` - Scrape articles from BeyondChats blog

### Laravel API (Phase 1)
- See `LARAVEL_API_SETUP.md` for complete setup instructions
- Update `VITE_LARAVEL_API_URL` in frontend `.env` with your Laravel API URL
- Required endpoints:
  - `GET /api/articles` - Get all articles
  - `GET /api/articles/:id` - Get article by ID
  - `GET /api/articles/:id/versions` - Get article versions

## Usage

1. **Phase 1**: Switch to "Phase 1: Laravel API" tab to view articles from your Laravel backend

2. **Phase 2**: 
   - Switch to "Phase 2: Node.js API" tab
   - Click "Scrape BeyondChats Articles" to fetch articles from BeyondChats blog
   - View, manage, and delete articles
   - Click on any article card to view details and version history

## Technologies Used

### Frontend
- React 19
- Vite
- Axios
- Modern CSS with animations and gradients
- Responsive design

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Cheerio for web scraping
- Axios for HTTP requests

## UI Features

- 🎨 Modern gradient designs
- ✨ Smooth animations and transitions
- 📱 Fully responsive layout
- 🎯 Interactive card-based article display
- 🔍 Modal view for article details
- 📊 Version history tracking
- 🎭 Hover effects and visual feedback

## Notes

- Make sure MongoDB is installed and running before starting the backend
- Update the Laravel API URL in frontend `.env` if your Laravel backend is on a different port
- The scraping functionality may need adjustments based on the actual HTML structure of BeyondChats blog

