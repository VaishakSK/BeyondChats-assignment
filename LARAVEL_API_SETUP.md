# Laravel API Setup Guide

This guide will help you set up a Laravel API to work with Phase 1 of the frontend.

## Prerequisites

- PHP >= 8.1
- Composer (PHP package manager)
- MySQL/PostgreSQL (or SQLite for development)

## Step 1: Install Laravel

If you don't have Laravel installed, create a new Laravel project:

```bash
# Install Laravel globally (if not already installed)
composer global require laravel/installer

# Create a new Laravel project
composer create-project laravel/laravel laravel-api

# Or use Laravel installer
laravel new laravel-api
```

## Step 2: Navigate to Laravel Project

```bash
cd laravel-api
```

## Step 3: Create Article Model and Migration

```bash
php artisan make:model Article -m
```

This creates:
- `app/Models/Article.php`
- `database/migrations/YYYY_MM_DD_create_articles_table.php`

## Step 4: Update Migration File

Edit `database/migrations/YYYY_MM_DD_create_articles_table.php`:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('author')->default('Unknown');
            $table->date('published_date')->nullable();
            $table->string('source_url')->nullable();
            $table->string('image_url')->nullable();
            $table->text('excerpt')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('is_scraped')->default(false);
            $table->unsignedBigInteger('original_article_id')->nullable();
            $table->integer('version')->default(1);
            $table->timestamps();

            $table->foreign('original_article_id')->references('id')->on('articles')->onDelete('cascade');
            $table->index('published_date');
            $table->index('source_url');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
```

## Step 5: Update Article Model

Edit `app/Models/Article.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'author',
        'published_date',
        'source_url',
        'image_url',
        'excerpt',
        'tags',
        'is_scraped',
        'original_article_id',
        'version',
    ];

    protected $casts = [
        'published_date' => 'date',
        'tags' => 'array',
        'is_scraped' => 'boolean',
    ];

    // Relationship: Get original article
    public function originalArticle()
    {
        return $this->belongsTo(Article::class, 'original_article_id');
    }

    // Relationship: Get all updates/versions
    public function updates()
    {
        return $this->hasMany(Article::class, 'original_article_id');
    }
}
```

## Step 6: Create Article Controller

```bash
php artisan make:controller ArticleController --api
```

Edit `app/Http/Controllers/ArticleController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * Display a listing of articles
     */
    public function index()
    {
        $articles = Article::orderBy('created_at', 'desc')->get();
        return response()->json($articles);
    }

    /**
     * Display the specified article
     */
    public function show($id)
    {
        $article = Article::find($id);
        
        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        return response()->json($article);
    }

    /**
     * Get article versions (original and updates)
     */
    public function versions($id)
    {
        $article = Article::find($id);
        
        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        // Find original article
        $originalArticle = $article->originalArticle ?? $article;
        
        // Get all updates
        $updates = $originalArticle->updates()->orderBy('created_at', 'desc')->get();

        return response()->json([
            'original' => $originalArticle,
            'updates' => $updates,
            'current' => $article
        ]);
    }

    /**
     * Store a newly created article
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'author' => 'nullable|string|max:255',
            'published_date' => 'nullable|date',
            'source_url' => 'nullable|url',
            'image_url' => 'nullable|url',
            'excerpt' => 'nullable|string',
            'tags' => 'nullable|array',
        ]);

        $article = Article::create($validated);

        return response()->json($article, 201);
    }

    /**
     * Update the specified article (creates new version)
     */
    public function update(Request $request, $id)
    {
        $article = Article::find($id);
        
        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'author' => 'nullable|string|max:255',
            'published_date' => 'nullable|date',
            'source_url' => 'nullable|url',
            'image_url' => 'nullable|url',
            'excerpt' => 'nullable|string',
            'tags' => 'nullable|array',
        ]);

        // Determine original article ID
        $originalId = $article->original_article_id ?? $article->id;
        
        // Get latest version number
        $latestVersion = Article::where('original_article_id', $originalId)
            ->orWhere('id', $originalId)
            ->max('version') ?? 0;

        // Create new version
        $newArticle = Article::create([
            ...$validated,
            'original_article_id' => $originalId,
            'version' => $latestVersion + 1,
        ]);

        return response()->json($newArticle);
    }

    /**
     * Remove the specified article
     */
    public function destroy($id)
    {
        $article = Article::find($id);
        
        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        $article->delete();

        return response()->json(['message' => 'Article deleted successfully']);
    }
}
```

## Step 7: Create API Routes

Edit `routes/api.php`:

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;

Route::middleware('api')->group(function () {
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/{id}', [ArticleController::class, 'show']);
    Route::get('/articles/{id}/versions', [ArticleController::class, 'versions']);
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::put('/articles/{id}', [ArticleController::class, 'update']);
    Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);
});
```

## Step 8: Configure CORS

Edit `config/cors.php` (or create if it doesn't exist):

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

Or install Laravel CORS package:

```bash
composer require fruitcake/laravel-cors
```

## Step 9: Configure Database

Edit `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Or use SQLite for quick testing:

```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite
```

Create SQLite database:

```bash
touch database/database.sqlite
```

## Step 10: Run Migrations

```bash
php artisan migrate
```

## Step 11: Seed Sample Data (Optional)

Create a seeder:

```bash
php artisan make:seeder ArticleSeeder
```

Edit `database/seeders/ArticleSeeder.php`:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        // Create original article
        $original = Article::create([
            'title' => 'Getting Started with Laravel',
            'content' => 'Laravel is a powerful PHP framework...',
            'author' => 'John Doe',
            'published_date' => now(),
            'excerpt' => 'Learn the basics of Laravel framework',
            'version' => 1,
        ]);

        // Create updated version
        Article::create([
            'title' => 'Getting Started with Laravel (Updated)',
            'content' => 'Laravel is a powerful PHP framework with many features...',
            'author' => 'John Doe',
            'published_date' => now(),
            'excerpt' => 'Learn the basics of Laravel framework - Updated version',
            'original_article_id' => $original->id,
            'version' => 2,
        ]);

        // Create more sample articles
        Article::create([
            'title' => 'Understanding React Hooks',
            'content' => 'React Hooks allow you to use state and other features...',
            'author' => 'Jane Smith',
            'published_date' => now()->subDays(5),
            'excerpt' => 'A comprehensive guide to React Hooks',
            'version' => 1,
        ]);
    }
}
```

Run seeder:

```bash
php artisan db:seed --class=ArticleSeeder
```

## Step 12: Start Laravel Development Server

```bash
php artisan serve
```

The server will start on `http://localhost:8000`

## Step 13: Test the API

Test the endpoints:

```bash
# Get all articles
curl http://localhost:8000/api/articles

# Get article by ID
curl http://localhost:8000/api/articles/1

# Get article versions
curl http://localhost:8000/api/articles/1/versions
```

## Step 14: Update Frontend .env

Make sure your frontend `.env` file has:

```env
VITE_LARAVEL_API_URL=http://localhost:8000/api
VITE_NODE_API_URL=http://localhost:5000/api
```

## Quick Setup Script

For a faster setup, you can use this one-liner to create the necessary files:

```bash
# Create Laravel project
composer create-project laravel/laravel laravel-api
cd laravel-api

# Create model and migration
php artisan make:model Article -m
php artisan make:controller ArticleController --api

# Run migrations
php artisan migrate

# Start server
php artisan serve
```

Then manually update the files as shown above.

## Troubleshooting

### Port 8000 Already in Use

If port 8000 is busy, use a different port:

```bash
php artisan serve --port=8001
```

Then update frontend `.env`:
```env
VITE_LARAVEL_API_URL=http://localhost:8001/api
```

### CORS Issues

- Make sure CORS is configured in `config/cors.php`
- Check that `allowed_origins` includes `http://localhost:5173`
- Clear config cache: `php artisan config:clear`

### Database Connection Issues

- Verify database credentials in `.env`
- Make sure database exists
- Check database server is running

### API Not Responding

- Check if server is running: `php artisan serve`
- Verify routes: `php artisan route:list`
- Check Laravel logs: `storage/logs/laravel.log`

## API Endpoints Summary

- `GET /api/articles` - Get all articles
- `GET /api/articles/{id}` - Get article by ID
- `GET /api/articles/{id}/versions` - Get article versions
- `POST /api/articles` - Create article
- `PUT /api/articles/{id}` - Update article (creates version)
- `DELETE /api/articles/{id}` - Delete article

