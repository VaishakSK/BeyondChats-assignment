<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * Display a listing of articles with pagination
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);
        
        $articles = Article::orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
        
        return response()->json([
            'data' => $articles->items(),
            'pagination' => [
                'current_page' => $articles->currentPage(),
                'per_page' => $articles->perPage(),
                'total' => $articles->total(),
                'last_page' => $articles->lastPage(),
                'from' => $articles->firstItem(),
                'to' => $articles->lastItem(),
            ]
        ]);
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

    /**
     * Scrape all articles from BeyondChats blog
     */
    public function scrape(Request $request)
    {
        try {
            $baseUrl = 'https://beyondchats.com/blogs/';
            $scrapedArticles = [];
            
            // Use Guzzle HTTP client (Laravel includes it)
            $client = new \GuzzleHttp\Client();
            
            // Step 1: Find the last page
            $response = $client->get($baseUrl, [
                'headers' => [
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                ],
                'timeout' => 15
            ]);
            
            $html = $response->getBody()->getContents();
            $dom = new \DOMDocument();
            @$dom->loadHTML($html);
            $xpath = new \DOMXPath($dom);
            
            // Find pagination links to determine last page
            $lastPage = 1;
            $paginationLinks = $xpath->query("//a[contains(@href, 'page') or contains(@href, 'p=')]");
            foreach ($paginationLinks as $link) {
                $href = $link->getAttribute('href');
                $text = strtolower(trim($link->textContent));
                
                if ($text === 'last' || $text === '>>' || $text === '»') {
                    // Extract page number from href
                    if (preg_match('/[?&]page[=_](\d+)|page[=_](\d+)|[?&]p[=_](\d+)/i', $href, $matches)) {
                        $lastPage = max($lastPage, (int)($matches[1] ?? $matches[2] ?? $matches[3] ?? 1));
                    }
                } elseif (preg_match('/[?&]page[=_](\d+)|page[=_](\d+)|[?&]p[=_](\d+)/i', $href, $matches)) {
                    $pageNum = (int)($matches[1] ?? $matches[2] ?? $matches[3] ?? 1);
                    $lastPage = max($lastPage, $pageNum);
                }
            }
            
            // Step 2: Scrape all pages
            $allArticleLinks = [];
            for ($page = 1; $page <= $lastPage; $page++) {
                $pageUrl = $page === 1 ? $baseUrl : ($baseUrl . '?page=' . $page);
                
                try {
                    $pageResponse = $client->get($pageUrl, [
                        'headers' => [
                            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                        ],
                        'timeout' => 15
                    ]);
                    
                    $pageHtml = $pageResponse->getBody()->getContents();
                    $pageDom = new \DOMDocument();
                    @$pageDom->loadHTML($pageHtml);
                    $pageXpath = new \DOMXPath($pageDom);
                    
                    // Find article links
                    $links = $pageXpath->query("//a[contains(@href, '/blog/') or contains(@href, '/post/')]");
                    foreach ($links as $link) {
                        $href = $link->getAttribute('href');
                        if ($href && (strpos($href, '/blog/') !== false || strpos($href, '/post/') !== false)) {
                            $fullUrl = strpos($href, 'http') === 0 ? $href : 'https://beyondchats.com' . $href;
                            if (!in_array($fullUrl, $allArticleLinks)) {
                                $allArticleLinks[] = $fullUrl;
                            }
                        }
                    }
                } catch (\Exception $e) {
                    // Continue to next page if this one fails
                    continue;
                }
                
                // Small delay to avoid overwhelming the server
                usleep(500000); // 0.5 seconds
            }
            
            // Step 3: Extract article data from all links
            foreach ($allArticleLinks as $articleUrl) {
                try {
                    $articleResponse = $client->get($articleUrl, [
                        'headers' => [
                            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                        ],
                        'timeout' => 10
                    ]);
                    
                    $articleHtml = $articleResponse->getBody()->getContents();
                    $articleDom = new \DOMDocument();
                    @$articleDom->loadHTML($articleHtml);
                    $articleXpath = new \DOMXPath($articleDom);
                    
                    // Extract title
                    $titleNodes = $articleXpath->query("//article//h1 | //h1[not(ancestor::footer)] | //title");
                    $title = '';
                    if ($titleNodes->length > 0) {
                        $title = trim($titleNodes->item(0)->textContent);
                        if (strpos($title, '|') !== false) {
                            $title = trim(explode('|', $title)[0]);
                        }
                    }
                    
                    // Extract content
                    $contentNodes = $articleXpath->query("//article//p | //article//div[contains(@class, 'content')]//p");
                    $content = '';
                    $contentHtml = '';
                    foreach ($contentNodes as $node) {
                        $text = trim($node->textContent);
                        if (strlen($text) > 20) {
                            $content .= $text . "\n\n";
                            $contentHtml .= $articleDom->saveHTML($node);
                        }
                    }
                    
                    // Extract author
                    $authorNodes = $articleXpath->query("//*[contains(@class, 'author')] | //meta[@name='author']");
                    $author = 'Unknown';
                    if ($authorNodes->length > 0) {
                        $author = trim($authorNodes->item(0)->textContent ?? $authorNodes->item(0)->getAttribute('content') ?? 'Unknown');
                    }
                    
                    // Extract date
                    $dateNodes = $articleXpath->query("//time[@datetime] | //meta[@property='article:published_time']");
                    $publishedDate = now();
                    if ($dateNodes->length > 0) {
                        $dateStr = $dateNodes->item(0)->getAttribute('datetime') ?? $dateNodes->item(0)->getAttribute('content') ?? '';
                        if ($dateStr) {
                            try {
                                $publishedDate = \Carbon\Carbon::parse($dateStr);
                            } catch (\Exception $e) {
                                // Use current date if parsing fails
                            }
                        }
                    }
                    
                    // Extract image
                    $imageNodes = $articleXpath->query("//article//img[1] | //meta[@property='og:image']");
                    $imageUrl = '';
                    if ($imageNodes->length > 0) {
                        $imageUrl = $imageNodes->item(0)->getAttribute('src') ?? $imageNodes->item(0)->getAttribute('content') ?? '';
                        if ($imageUrl && strpos($imageUrl, 'http') !== 0) {
                            $imageUrl = 'https://beyondchats.com' . $imageUrl;
                        }
                    }
                    
                    // Extract excerpt
                    $excerptNodes = $articleXpath->query("//meta[@name='description'] | //meta[@property='og:description']");
                    $excerpt = substr(strip_tags($content), 0, 200);
                    if ($excerptNodes->length > 0) {
                        $excerpt = $excerptNodes->item(0)->getAttribute('content') ?? $excerpt;
                    }
                    
                    // Validate content
                    if (strlen($title) > 0 && strlen($content) > 100) {
                        // Check if article already exists
                        $existingArticle = Article::where('source_url', $articleUrl)->first();
                        
                        if (!$existingArticle) {
                            $article = Article::create([
                                'title' => substr($title, 0, 500),
                                'content' => substr($content, 0, 10000),
                                'author' => substr($author, 0, 200),
                                'published_date' => $publishedDate,
                                'source_url' => $articleUrl,
                                'image_url' => $imageUrl,
                                'excerpt' => substr($excerpt, 0, 500),
                                'is_scraped' => true,
                                'tags' => []
                            ]);
                            $scrapedArticles[] = $article;
                        } else {
                            // Update existing article
                            $existingArticle->update([
                                'title' => substr($title, 0, 500),
                                'content' => substr($content, 0, 10000),
                                'author' => substr($author, 0, 200),
                                'published_date' => $publishedDate,
                                'image_url' => $imageUrl,
                                'excerpt' => substr($excerpt, 0, 500),
                            ]);
                            $scrapedArticles[] = $existingArticle;
                        }
                    }
                } catch (\Exception $e) {
                    // Continue to next article if this one fails
                    continue;
                }
                
                // Small delay between articles
                usleep(500000); // 0.5 seconds
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully scraped ' . count($scrapedArticles) . ' articles',
                'data' => $scrapedArticles,
                'total_found' => count($allArticleLinks),
                'total_scraped' => count($scrapedArticles)
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

