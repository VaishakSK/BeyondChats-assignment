import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrape main content from article URLs
 */
export class ArticleScraper {
  /**
   * Scrape article content from a URL
   */
  async scrapeArticle(url) {
    try {
      console.log(`📄 Scraping article from: ${url}`);
      
      // Enhanced headers to avoid 403 errors
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      };

      let response;
      try {
        response = await axios.get(url, {
          headers,
          timeout: 20000,
          maxRedirects: 5,
          validateStatus: (status) => status < 500 // Accept 4xx but not 5xx
        });
      } catch (error) {
        // If 403, try with simpler headers
        if (error.response && error.response.status === 403) {
          console.log(`⚠️  Got 403, retrying with simpler headers...`);
          response = await axios.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            timeout: 20000,
            maxRedirects: 5
          });
        } else {
          throw error;
        }
      }

      const $ = cheerio.load(response.data);
      
      // Remove unwanted elements
      $('footer, .footer, nav, .nav, .navigation, .sidebar, .widget, .social-share, .share-buttons, .related-posts, .comments, .comment-section, script, style, iframe, .advertisement, .ads, [class*="ad-"], [id*="ad-"]').remove();
      
      // Extract title
      const title = $('article h1, h1.entry-title, h1.post-title, h1').first().text().trim() ||
                   $('title').text().trim().split('|')[0].trim();
      
      // Extract content with HTML formatting
      let contentHtml = '';
      let content = '';
      
      // Expanded selectors for better content extraction
      const articleSelectors = [
        'article .entry-content',
        'article .post-content',
        'article .content',
        'article .article-content',
        'article .post-body',
        'article .article-body',
        'article .entry-body',
        '.entry-content',
        '.post-content',
        '.article-content',
        '.post-body',
        '.article-body',
        '.entry-body',
        '[class*="entry-content"]',
        '[class*="post-content"]',
        '[class*="article-content"]',
        '[class*="post-body"]',
        '[class*="article-body"]',
        'article main',
        'main article',
        'article section',
        'section article',
        '[role="article"]',
        '.article',
        'article',
        'main .content',
        'main'
      ];

      // Try each selector until we find substantial content
      for (const selector of articleSelectors) {
        const $article = $(selector).first();
        if ($article.length > 0) {
          const $articleClone = $article.clone();
          
          // Remove unwanted elements more thoroughly
          $articleClone.find('footer, .footer, nav, .nav, .navigation, .sidebar, .widget, .social-share, .share-buttons, .related-posts, .comments, .comment-section, script, style, iframe, .advertisement, .ads, [class*="ad-"], [id*="ad-"], .newsletter, .subscribe, .author-box, .breadcrumb').remove();
          
          contentHtml = $articleClone.html() || '';
          content = $articleClone.text().trim();
          
          // Check if we have substantial content (at least 200 chars)
          if (content.length >= 200) {
            break;
          }
        }
      }

      // If still no content, try extracting from body with more aggressive cleaning
      if (content.length < 200) {
        const $body = $('body').clone();
        $body.find('header, footer, nav, .header, .footer, .nav, .navigation, .sidebar, .widget, .social-share, .share-buttons, .related-posts, .comments, .comment-section, script, style, iframe, .advertisement, .ads, [class*="ad-"], [id*="ad-"], .newsletter, .subscribe, .author-box, .breadcrumb, .menu, .navigation-menu').remove();
        
        // Try to find main content area
        const $mainContent = $body.find('main, [role="main"], .main-content, .content-area').first();
        if ($mainContent.length > 0) {
          contentHtml = $mainContent.html() || '';
          content = $mainContent.text().trim();
        } else {
          // Last resort: get all paragraphs from body
          const $paragraphs = $body.find('p');
          if ($paragraphs.length > 0) {
            contentHtml = $paragraphs.map((i, el) => $(el).html()).get().join('\n');
            content = $paragraphs.map((i, el) => $(el).text()).get().join(' ').trim();
          }
        }
      }

      // Extract author
      const author = $('article .author, .entry-author, .post-author, .by-author').first().text().trim() ||
                    $('meta[name="author"]').attr('content') ||
                    'Unknown';

      // Extract published date
      let publishedDate = null;
      const dateText = $('article time[datetime], .entry-date time[datetime]').first().attr('datetime') ||
                      $('meta[property="article:published_time"]').attr('content') ||
                      '';
      
      if (dateText) {
        const parsedDate = new Date(dateText);
        if (!isNaN(parsedDate.getTime())) {
          publishedDate = parsedDate;
        }
      }

      // Clean up HTML and fix relative URLs
      if (contentHtml) {
        try {
          const baseUrl = new URL(url);
          const origin = baseUrl.origin;
          
          // Fix relative image and link URLs
          contentHtml = contentHtml.replace(/src="\//g, `src="${origin}/`);
          contentHtml = contentHtml.replace(/href="\//g, `href="${origin}/`);
          contentHtml = contentHtml.replace(/src="([^"]+)"/g, (match, src) => {
            if (src.startsWith('//')) {
              return `src="https:${src}"`;
            } else if (src.startsWith('/')) {
              return `src="${origin}${src}"`;
            }
            return match;
          });
        } catch (e) {
          // If URL parsing fails, just continue
        }
        
        // Remove empty paragraphs and clean up whitespace
        contentHtml = contentHtml.replace(/<p[^>]*>\s*<\/p>/gi, '');
        contentHtml = contentHtml.replace(/\s+/g, ' ').trim();
      }

      // More lenient validation - allow shorter content if we have something
      const minContentLength = 100; // Reduced from strict validation
      
      if (!content || content.length < minContentLength) {
        console.warn(`⚠️  Insufficient content from ${url} (${content.length} chars, need ${minContentLength})`);
        // Log what we found for debugging
        if (content) {
          console.log(`   Found content preview: ${content.substring(0, 100)}...`);
        }
        return null;
      }

      // Ensure we have a title
      if (!title || title.length < 3) {
        console.warn(`⚠️  No valid title found for ${url}, using fallback`);
        title = 'Article';
      }

      return {
        title: title.substring(0, 500),
        content: content.substring(0, 20000),
        contentHtml: contentHtml.substring(0, 100000),
        author: author.substring(0, 200),
        publishedDate,
        sourceUrl: url
      };
    } catch (error) {
      console.error(`❌ Error scraping ${url}:`, error.message);
      return null;
    }
  }

  /**
   * Scrape multiple articles
   */
  async scrapeArticles(urls) {
    const results = [];
    
    for (const url of urls) {
      const article = await this.scrapeArticle(url);
      if (article) {
        results.push(article);
      }
      // Add delay to avoid overwhelming servers
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }
}

