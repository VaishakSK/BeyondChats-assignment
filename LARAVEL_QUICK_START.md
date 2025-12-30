# Laravel API Quick Start

I've created a complete Laravel API setup in the `laravel-api/` folder. Here's how to set it up:

## Prerequisites

- PHP >= 8.1
- Composer installed

## Setup Steps

### 1. Create Laravel Project (if you don't have one)

```bash
composer create-project laravel/laravel laravel-api
cd laravel-api
```

### 2. Copy Files

Copy all files from the `laravel-api/` folder in this project to your Laravel project:
- `app/Http/Controllers/ArticleController.php`
- `app/Models/Article.php`
- `database/migrations/2024_01_01_000000_create_articles_table.php`
- `database/seeders/ArticleSeeder.php`
- `routes/api.php`
- `config/cors.php`

### 3. Install and Configure

```bash
# Install dependencies
composer install

# Create .env file
cp .env.example .env

# Generate key
php artisan key:generate

# Create SQLite database
touch database/database.sqlite
```

### 4. Update .env

```env
DB_CONNECTION=sqlite
DB_DATABASE=C:/Users/vaish/OneDrive/Desktop/beyondChats-assignment/laravel-api/database/database.sqlite
```

(Update the path to match your actual path)

### 5. Run Migrations and Seed

```bash
php artisan migrate
php artisan db:seed --class=ArticleSeeder
```

### 6. Start Server

```bash
php artisan serve
```

The API will run on `http://localhost:8000`

## Test

Visit: http://localhost:8000/api/articles

You should see JSON with sample articles.

## What's Included

✅ Complete Article model with versioning
✅ Full CRUD controller
✅ API routes
✅ Database migration
✅ Sample data seeder
✅ CORS configuration for frontend

## Files Created

All necessary Laravel files are in the `laravel-api/` folder. Just copy them to your Laravel project!

