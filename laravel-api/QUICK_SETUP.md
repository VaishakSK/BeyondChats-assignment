# Quick Laravel API Setup

## Option 1: If Laravel is NOT installed

1. **Install Composer** (if not installed): https://getcomposer.org/download/

2. **Create Laravel project:**
   ```bash
   composer create-project laravel/laravel laravel-api
   cd laravel-api
   ```

3. **Copy files from this directory:**
   - Copy all files from `laravel-api/` folder to your new `laravel-api/` project

4. **Follow steps below**

## Option 2: If you already have a Laravel project

Just copy the files from this `laravel-api/` directory to your Laravel project.

## Setup Steps

1. **Install dependencies:**
   ```bash
   composer install
   ```

2. **Create .env file:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Set up SQLite database:**
   ```bash
   touch database/database.sqlite
   ```
   
   Update `.env`:
   ```env
   DB_CONNECTION=sqlite
   DB_DATABASE=C:/Users/vaish/OneDrive/Desktop/beyondChats-assignment/laravel-api/database/database.sqlite
   ```
   (Update the path to your actual path)

4. **Run migrations:**
   ```bash
   php artisan migrate
   ```

5. **Seed sample data:**
   ```bash
   php artisan db:seed --class=ArticleSeeder
   ```

6. **Start server:**
   ```bash
   php artisan serve
   ```

## Test

Open: http://localhost:8000/api/articles

You should see JSON data with articles.

