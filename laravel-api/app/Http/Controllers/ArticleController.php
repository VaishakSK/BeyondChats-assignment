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

