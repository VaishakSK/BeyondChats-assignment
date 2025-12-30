# Laravel API Setup Instructions

## Step 1: Install Composer (if not installed)

Download and install Composer from: https://getcomposer.org/download/

## Step 2: Create Laravel Project

If you don't have a Laravel project yet, create one:

```bash
composer create-project laravel/laravel laravel-api
cd laravel-api
```

## Step 3: Copy Files

Copy the following files from this directory to your Laravel project:

1. `app/Http/Controllers/ArticleController.php` → `laravel-api/app/Http/Controllers/`
2. `app/Models/Article.php` → `laravel-api/app/Models/`
3. `database/migrations/2024_01_01_000000_create_articles_table.php` → `laravel-api/database/migrations/`
4. `database/seeders/ArticleSeeder.php` → `laravel-api/database/seeders/`
5. `routes/api.php` → `laravel-api/routes/` (replace existing)
6. `config/cors.php` → `laravel-api/config/` (replace existing)

## Step 4: Install Dependencies

```bash
composer install
```

## Step 5: Configure Environment

```bash
# Copy .env.example to .env
cp .env.example .env

# Generate application key
php artisan key:generate
```

## Step 6: Set Up Database

For SQLite (easiest for development):

```bash
# Create database file
touch database/database.sqlite
```

Update `.env`:
```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/laravel-api/database/database.sqlite
```

Or use MySQL:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## Step 7: Run Migrations

```bash
php artisan migrate
```

## Step 8: Seed Sample Data (Optional)

```bash
php artisan db:seed --class=ArticleSeeder
```

## Step 9: Start Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000/api`

## Test the API

```bash
# Get all articles
curl http://localhost:8000/api/articles

# Get article by ID
curl http://localhost:8000/api/articles/1

# Get article versions
curl http://localhost:8000/api/articles/1/versions
```

## Troubleshooting

### CORS Issues
- Make sure `config/cors.php` allows `http://localhost:5173`
- Clear config cache: `php artisan config:clear`

### Database Issues
- Make sure database file exists (for SQLite)
- Check database permissions
- Verify .env configuration

### Route Not Found
- Clear route cache: `php artisan route:clear`
- Check `routes/api.php` is correct

