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
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      
      // Remove unwanted elements
      $('footer, .footer, nav, .nav, .navigation, .sidebar, .widget, .social-share, .share-buttons, .related-posts, .comments, .comment-section, script, style, iframe, .advertisement, .ads, [class*="ad-"], [id*="ad-"]').remove();
      
      // Extract title
      const title = $('article h1, h1.entry-title, h1.post-title, h1').first().text().trim() ||
                   $('title').text().trim().split('|')[0].trim();
      
      // Extract content with HTML formatting
      let contentHtml = '';
      let content = '';
      
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
          const $articleClone = $article.clone();
          $articleClone.find('footer, .footer, nav, .nav, .sidebar, .widget, script, style').remove();
          
          contentHtml = $articleClone.html() || '';
          content = $articleClone.text().trim();
          
          if (content.length > 100) {
            break;
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

      // Clean up HTML
      if (contentHtml) {
        contentHtml = contentHtml.replace(/src="\//g, (match, url) => {
          try {
            const baseUrl = new URL(url);
            return `src="${baseUrl.origin}${match}`;
          } catch {
            return match;
          }
        });
        contentHtml = contentHtml.replace(/<p[^>]*>\s*<\/p>/gi, '');
        contentHtml = contentHtml.replace(/\s+/g, ' ').trim();
      }

      if (!title || !content || content.length < 50) {
        console.warn(`⚠️  Insufficient content from ${url}`);
        return null;
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

