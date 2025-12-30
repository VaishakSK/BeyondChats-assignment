# BeyondChats Frontend

React-based frontend for displaying articles from Laravel and Node.js APIs.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```
VITE_LARAVEL_API_URL=http://localhost:8000/api
VITE_NODE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

## Features

### Phase 1: Laravel API Integration
- Fetches articles from Laravel API
- Displays original articles and their update versions
- Responsive card-based layout

### Phase 2: Node.js API Integration
- Fetches articles from Node.js/MongoDB backend
- Scrape articles from BeyondChats blog
- Full CRUD operations (Create, Read, Update, Delete)
- View article versions and update history

## Technologies

- React 19
- Vite
- Axios for API calls
- Modern CSS with animations and gradients
