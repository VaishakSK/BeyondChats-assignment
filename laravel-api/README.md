# Laravel API for BeyondChats Assignment

Quick setup guide for the Laravel API.

## Prerequisites

- PHP >= 8.1
- Composer installed

## Quick Setup

1. **Install dependencies:**
   ```bash
   composer install
   ```

2. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

3. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

4. **Create SQLite database:**
   ```bash
   touch database/database.sqlite
   ```

5. **Update .env:**
   ```env
   DB_CONNECTION=sqlite
   DB_DATABASE=/absolute/path/to/your/project/laravel-api/database/database.sqlite
   ```

6. **Run migrations:**
   ```bash
   php artisan migrate
   ```

7. **Seed sample data (optional):**
   ```bash
   php artisan db:seed --class=ArticleSeeder
   ```

8. **Start the server:**
   ```bash
   php artisan serve
   ```

The API will be available at `http://localhost:8000/api`

## API Endpoints

- `GET /api/articles` - Get all articles
- `GET /api/articles/{id}` - Get article by ID
- `GET /api/articles/{id}/versions` - Get article versions
- `POST /api/articles` - Create article
- `PUT /api/articles/{id}` - Update article (creates version)
- `DELETE /api/articles/{id}` - Delete article

## CORS Configuration

CORS is configured to allow requests from `http://localhost:5173` (frontend).

