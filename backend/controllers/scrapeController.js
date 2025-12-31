import axios from 'axios';
import * as cheerio from 'cheerio';
import Article from '../models/Article.js';

/**
 * Find the last page URL from pagination
 */
const findLastPage = async (baseUrl) => {
  try {
    const response = await axios.get(baseUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Try to find pagination links
    // Common patterns: "Last", ">>", page numbers, etc.
    let lastPageUrl = baseUrl;
    let maxPage = 1;

    // Look for pagination links
    $('a[href*="page"], a[href*="p="], .pagination a, .page-numbers a, nav a').each((i, elem) => {
      const href = $(elem).attr('href');
      const text = $(elem).text().trim().toLowerCase();
      
      // Check if it's a "last" or ">>" link
      if (text === 'last' || text === '>>' || text === '»' || text.includes('last')) {
        if (href) {
          lastPageUrl = href.startsWith('http') ? href : `https://beyondchats.com${href}`;
          return false; // break
        }
      }
      
      // Try to extract page number from href
      const pageMatch = href?.match(/[?&]page[=_](\d+)|page[=_](\d+)|[?&]p[=_](\d+)/i);
      if (pageMatch) {
        const pageNum = parseInt(pageMatch[1] || pageMatch[2] || pageMatch[3]);
        if (pageNum > maxPage) {
          maxPage = pageNum;
          lastPageUrl = href.startsWith('http') ? href : `https://beyondchats.com${href}`;
        }
      }
    });

    // If we found a max page number, construct the last page URL
    if (maxPage > 1) {
      // Try different URL patterns
      if (baseUrl.includes('?')) {
        lastPageUrl = `${baseUrl}&page=${maxPage}`;
      } else if (baseUrl.endsWith('/')) {
        lastPageUrl = `${baseUrl}?page=${maxPage}`;
      } else {
        lastPageUrl = `${baseUrl}/?page=${maxPage}`;
      }
    }

    return lastPageUrl;
  } catch (error) {
    console.error('Error finding last page:', error.message);
    return baseUrl; // Fallback to base URL
  }
};

/**
 * Extract article data from a single article page
 */
const extractArticleData = async (articleUrl) => {
  try {
    const response = await axios.get(articleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    
    // Remove unwanted elements before extracting content
    $('footer, .footer, #footer, nav, .nav, .navigation, .sidebar, .side-bar, .widget, .social-share, .share-buttons, .related-posts, .comments, .comment-section, script, style, iframe, .advertisement, .ads, [class*="ad-"], [id*="ad-"]').remove();
    
    // Extract title
    const title = $('article h1, .entry-title, .post-title, h1.entry-title, h1.post-title').first().text().trim() || 
                  $('h1').not('footer h1, .footer h1').first().text().trim() ||
                  $('title').text().trim().split('|')[0].trim().split('-')[0].trim();

    // Extract content with HTML formatting preserved
    let content = '';
    let contentHtml = '';
    
    // Try to find the main article container first
    const articleSelectors = [
      'article .entry-content',
      'article .post-content',
      'article .content',
      'article .article-content',
      '.entry-content',
      '.post-content',
      '.article-content',
      '[class*="entry-content"]',
      '[class*="post-content"]',
      'article main',
      'main article',
      'article'
    ];

    for (const selector of articleSelectors) {
      const $article = $(selector).first();
      if ($article.length > 0) {
        // Clone to preserve original
        const $articleClone = $article.clone();
        
        // Remove footer, sidebar, and other unwanted elements from article
        $articleClone.find('footer, .footer, nav, .nav, .sidebar, .widget, .social-share, .share-buttons, .related-posts, .comments, .comment-section, script, style, iframe, .advertisement, .ads, [class*="ad-"], [id*="ad-"]').remove();
        
        // Clean up inline styles and classes that might interfere
        $articleClone.find('*').each((i, el) => {
          const $el = $(el);
          // Remove inline styles that might cause issues
          $el.removeAttr('style');
          // Keep semantic HTML but clean up
          const tagName = $el.prop('tagName')?.toLowerCase();
          if (tagName && ['div', 'span'].includes(tagName)) {
            // Keep div/span but remove non-semantic classes
            const classes = $el.attr('class') || '';
            if (classes.includes('ad') || classes.includes('widget') || classes.includes('sidebar')) {
              $el.remove();
            }
          }
        });
        
        // Get HTML content (preserves formatting)
        contentHtml = $articleClone.html() || '';
        
        // Get plain text content for search/excerpt
        const paragraphs = $articleClone.find('p').map((i, el) => $(el).text().trim()).get();
        const textContent = $articleClone.text().trim();
        
        // Prefer paragraphs if available, otherwise use full text
        if (paragraphs.length > 0) {
          content = paragraphs.filter(p => p.length > 20).join('\n\n');
        } else {
          content = textContent;
        }
        
        // Clean up text content - remove excessive whitespace
        content = content.replace(/\s+/g, ' ').trim();
        
        if (content.length > 100 && contentHtml.length > 100) {
          break; // Found good content
        }
      }
    }

    // Fallback: try main content area
    if (!content || content.length < 100) {
      const $main = $('main').first();
      if ($main.length > 0) {
        const $mainClone = $main.clone();
        $mainClone.find('footer, .footer, nav, .nav, .sidebar, .widget, script, style').remove();
        
        contentHtml = $mainClone.html() || '';
        content = $mainClone.find('p').map((i, el) => $(el).text().trim()).get()
          .filter(p => p.length > 20)
          .join('\n\n');
        content = content.replace(/\s+/g, ' ').trim();
      }
    }

    // Final fallback: get body text but exclude footer
    if (!content || content.length < 100) {
      const $bodyClone = $('body').clone();
      $bodyClone.find('footer, .footer, nav, .nav, .sidebar, script, style').remove();
      
      const paragraphs = $bodyClone.find('p').map((i, el) => $(el).text().trim()).get()
        .filter(p => p.length > 20 && !p.toLowerCase().includes('copyright') && !p.toLowerCase().includes('all rights reserved'));
      content = paragraphs.join('\n\n');
      content = content.replace(/\s+/g, ' ').trim();
      
      // Try to get HTML from body as last resort
      if (!contentHtml) {
        const $bodyContent = $('body').clone();
        $bodyContent.find('footer, .footer, nav, .nav, .sidebar, script, style, header, .header').remove();
        contentHtml = $bodyContent.find('article, main, .content').first().html() || '';
      }
    }
    
    // Clean up HTML content - remove empty tags, fix relative URLs
    if (contentHtml) {
      // Fix relative image URLs
      contentHtml = contentHtml.replace(/src="\//g, 'src="https://beyondchats.com/');
      contentHtml = contentHtml.replace(/src='\//g, "src='https://beyondchats.com/");
      
      // Remove empty paragraphs and divs
      contentHtml = contentHtml.replace(/<p[^>]*>\s*<\/p>/gi, '');
      contentHtml = contentHtml.replace(/<div[^>]*>\s*<\/div>/gi, '');
      
      // Clean up excessive whitespace in HTML
      contentHtml = contentHtml.replace(/\s+/g, ' ').trim();
    }

    // Extract image - prefer featured image
    const imageUrl = $('article img, .featured-image img, .post-thumbnail img, .entry-featured-image img').first().attr('src') ||
                     $('meta[property="og:image"]').attr('content') ||
                     $('img').not('footer img, .footer img').first().attr('src') ||
                     '';

    // Extract author - look in article header/meta
    const author = $('article .author, .entry-author, .post-author, .by-author, [class*="author-name"]').first().text().trim() ||
                   $('meta[name="author"]').attr('content') ||
                   $('[rel="author"]').text().trim() ||
                   'Unknown';

    // Extract published date
    let publishedDate = new Date();
    const dateText = $('article time[datetime], .entry-date time[datetime], .post-date time[datetime]').first().attr('datetime') ||
                     $('meta[property="article:published_time"]').attr('content') ||
                     $('time[datetime]').first().attr('datetime') ||
                     $('[class*="date"] time').first().attr('datetime') ||
                     '';
    
    if (dateText) {
      const parsedDate = new Date(dateText);
      if (!isNaN(parsedDate.getTime())) {
        publishedDate = parsedDate;
      }
    }

    // Extract excerpt - prefer meta description
    const excerpt = $('meta[name="description"]').attr('content') ||
                    $('meta[property="og:description"]').attr('content') ||
                    $('.excerpt, .summary, .entry-summary').first().text().trim() ||
                    content.substring(0, 200).replace(/\s+/g, ' ').trim();

    // Validate content - ensure we have actual article content
    if (!title || !content || content.length < 50) {
      console.log(`⚠️  Skipping article: title=${!!title}, contentLength=${content.length}`);
      return null;
    }

    // Additional validation: check if content looks like footer text
    const footerKeywords = ['copyright', 'all rights reserved', 'privacy policy', 'terms of service', 'follow us', 'subscribe'];
    const contentLower = content.toLowerCase();
    const hasFooterContent = footerKeywords.some(keyword => contentLower.includes(keyword));
    
    // If content is mostly footer-like, try to extract better content
    if (hasFooterContent && content.length < 500) {
      // Try to get content before footer
      const $article = $('article, .entry-content, .post-content').first();
      if ($article.length > 0) {
        // Get content before any footer element
        const mainContent = $article.clone();
        mainContent.find('footer, .footer, [class*="footer"]').remove();
        const betterContent = mainContent.find('p').map((i, el) => $(el).text().trim()).get()
          .filter(p => p.length > 20 && !footerKeywords.some(kw => p.toLowerCase().includes(kw)))
          .join('\n\n');
        
        if (betterContent.length > 100) {
          content = betterContent.replace(/\s+/g, ' ').trim();
        }
      }
    }

    return {
      title: title.substring(0, 500),
      content: content.substring(0, 10000), // Plain text for search/excerpt
      contentHtml: contentHtml.substring(0, 50000), // HTML with formatting preserved
      author: author.substring(0, 200),
      publishedDate,
      sourceUrl: articleUrl,
      imageUrl: imageUrl.startsWith('http') ? imageUrl : (imageUrl ? `https://beyondchats.com${imageUrl}` : ''),
      excerpt: excerpt.substring(0, 500),
      isScraped: true,
      tags: []
    };
  } catch (error) {
    console.error(`Error extracting article from ${articleUrl}:`, error.message);
    return null;
  }
};

// In-memory store for scraping progress
const scrapingProgress = new Map();

/**
 * Scrape articles from BeyondChats blog
 * Gets N oldest articles from the last page (default: 5, max: 10)
 */
export const scrapeBeyondChats = async (req, res) => {
  try {
    const { count = 5 } = req.body;
    const articleCount = Math.min(Math.max(parseInt(count) || 5, 1), 10); // Between 1 and 10
    
    const baseUrl = 'https://beyondchats.com/blogs/';
    const scrapedArticles = [];
    const progressId = `scrape_${Date.now()}`;

    // Initialize progress
    const progress = {
      id: progressId,
      status: 'in-progress',
      total: articleCount,
      completed: 0,
      current: 'Finding last page...',
      articles: [],
      startedAt: new Date(),
      completedAt: null,
      error: null
    };
    scrapingProgress.set(progressId, progress);

    console.log(`🔍 Finding last page of BeyondChats blog (scraping ${articleCount} articles)...`);
    
    // Step 1: Find the last page
    progress.current = 'Finding last page...';
    scrapingProgress.set(progressId, progress);
    const lastPageUrl = await findLastPage(baseUrl);
    console.log(`📄 Last page URL: ${lastPageUrl}`);

    // Step 2: Fetch the last page
    progress.current = 'Fetching articles list...';
    scrapingProgress.set(progressId, progress);
    const response = await axios.get(lastPageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const articleLinks = [];

    // Step 3: Find all article links on the last page
    // Try multiple selectors to find article links
    const selectors = [
      'article a[href*="/blog"]',
      'article a[href*="/post"]',
      '.blog-post a',
      '.post-item a',
      '.entry-title a',
      'h2 a[href*="/blog"]',
      'h3 a[href*="/blog"]',
      '[class*="blog"] a[href*="/blog"]',
      '[class*="post"] a[href*="/post"]'
    ];

    for (const selector of selectors) {
      $(selector).each((i, elem) => {
        const href = $(elem).attr('href');
        if (href && (href.includes('/blog/') || href.includes('/post/'))) {
          const fullUrl = href.startsWith('http') ? href : `https://beyondchats.com${href}`;
          if (!articleLinks.includes(fullUrl)) {
            articleLinks.push(fullUrl);
          }
        }
      });
    }

    // Fallback: find any links that look like blog posts
    if (articleLinks.length === 0) {
      $('a[href*="/blog"], a[href*="/post"]').each((i, elem) => {
        const href = $(elem).attr('href');
        if (href && !href.includes('#') && !href.includes('mailto:')) {
          const fullUrl = href.startsWith('http') ? href : `https://beyondchats.com${href}`;
          if (!articleLinks.includes(fullUrl) && fullUrl.includes('beyondchats.com')) {
            articleLinks.push(fullUrl);
          }
        }
      });
    }

    console.log(`📰 Found ${articleLinks.length} article links on last page`);

    if (articleLinks.length === 0) {
      progress.status = 'error';
      progress.error = 'No articles found on the last page. The website structure may have changed.';
      progress.completedAt = new Date();
      scrapingProgress.set(progressId, progress);
      
      return res.status(404).json({
        success: false,
        error: 'No articles found on the last page. The website structure may have changed.',
        progressId
      });
    }

    // Step 4: Extract article data and dates
    progress.current = 'Extracting article data...';
    scrapingProgress.set(progressId, progress);
    const articlesWithDates = [];
    
    for (let i = 0; i < articleLinks.length; i++) {
      const link = articleLinks[i];
      progress.current = `Extracting article ${i + 1}/${articleLinks.length}...`;
      scrapingProgress.set(progressId, progress);
      
      const articleData = await extractArticleData(link);
      if (articleData) {
        articlesWithDates.push(articleData);
      }
      // Add small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Step 5: Sort by published date (oldest first) and get N oldest
    articlesWithDates.sort((a, b) => {
      return new Date(a.publishedDate) - new Date(b.publishedDate);
    });

    const oldestArticles = articlesWithDates.slice(0, articleCount);
    console.log(`📚 Found ${oldestArticles.length} oldest articles`);

    // Step 6: Store articles in database
    progress.current = 'Saving articles to database...';
    progress.total = oldestArticles.length;
    scrapingProgress.set(progressId, progress);
    
    for (let i = 0; i < oldestArticles.length; i++) {
      const articleData = oldestArticles[i];
      progress.current = `Saving article ${i + 1}/${oldestArticles.length}: ${articleData.title.substring(0, 50)}...`;
      progress.completed = i;
      scrapingProgress.set(progressId, progress);
      
      try {
        // Check if article already exists
        const existingArticle = await Article.findOne({ sourceUrl: articleData.sourceUrl });
        
        if (!existingArticle) {
          const article = new Article(articleData);
          await article.save();
          scrapedArticles.push(article);
          progress.articles.push({ title: article.title, status: 'saved' });
          console.log(`✅ Saved: ${article.title}`);
        } else {
          // Update existing article if needed
          Object.assign(existingArticle, articleData);
          await existingArticle.save();
          scrapedArticles.push(existingArticle);
          progress.articles.push({ title: existingArticle.title, status: 'updated' });
          console.log(`♻️  Updated: ${existingArticle.title}`);
        }
      } catch (error) {
        console.error(`❌ Error saving article ${articleData.title}:`, error.message);
        progress.articles.push({ title: articleData.title, status: 'error', error: error.message });
      }
    }

    // Mark as completed
    progress.status = 'completed';
    progress.completed = oldestArticles.length;
    progress.current = 'Completed';
    progress.completedAt = new Date();
    scrapingProgress.set(progressId, progress);

    // Clean up after 1 hour
    setTimeout(() => {
      scrapingProgress.delete(progressId);
    }, 3600000);

    res.json({
      success: true,
      message: `Successfully scraped and stored ${scrapedArticles.length} oldest articles from the last page`,
      data: scrapedArticles,
      totalFound: articlesWithDates.length,
      oldestCount: oldestArticles.length,
      progressId
    });
  } catch (error) {
    console.error('❌ Scraping error:', error);
    const progressId = `scrape_${Date.now()}`;
    const progress = scrapingProgress.get(progressId);
    if (progress) {
      progress.status = 'error';
      progress.error = error.message || 'Failed to scrape articles';
      progress.completedAt = new Date();
      scrapingProgress.set(progressId, progress);
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to scrape articles',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      progressId
    });
  }
};

/**
 * Get scraping progress
 */
export const getScrapingProgress = async (req, res) => {
  try {
    const { progressId } = req.params;
    const progress = scrapingProgress.get(progressId);
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'Scraping progress not found. The scraping may not have started or has been cleaned up.'
      });
    }
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get scraping progress'
    });
  }
};
