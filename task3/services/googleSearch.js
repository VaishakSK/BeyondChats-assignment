import axios from 'axios';

/**
 * Search Google for article title and return top 2 blog/article links
 * Uses SerpAPI (recommended) or Google Custom Search API
 */
export class GoogleSearchService {
  constructor() {
    this.serpApiKey = process.env.SERPAPI_KEY;
    this.googleApiKey = process.env.GOOGLE_API_KEY;
    this.googleCseId = process.env.GOOGLE_CSE_ID;
  }

  /**
   * Search using SerpAPI (recommended - more reliable)
   */
  async searchWithSerpAPI(query) {
    if (!this.serpApiKey) {
      throw new Error('SERPAPI_KEY not found in environment variables');
    }

    try {
      const response = await axios.get('https://serpapi.com/search.json', {
        params: {
          q: query,
          api_key: this.serpApiKey,
          engine: 'google',
          num: 10, // Get more results to filter
          safe: 'active'
        }
      });

      const results = response.data.organic_results || [];
      
      // Filter for blog/article links (exclude social media, video sites, etc.)
      const blogResults = results.filter(result => {
        const url = result.link?.toLowerCase() || '';
        const title = result.title?.toLowerCase() || '';
        
        // Exclude unwanted domains
        const excludeDomains = [
          'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com',
          'linkedin.com', 'pinterest.com', 'reddit.com', 'quora.com',
          'amazon.com', 'wikipedia.org', 'github.com'
        ];
        
        const isExcluded = excludeDomains.some(domain => url.includes(domain));
        
        // Include blog/article indicators
        const isBlog = url.includes('/blog/') || 
                      url.includes('/article/') || 
                      url.includes('/post/') ||
                      title.includes('blog') ||
                      title.includes('article');
        
        return !isExcluded && (isBlog || this.looksLikeArticle(url, title));
      });

      // Return first 2 blog/article results
      return blogResults.slice(0, 2).map(result => ({
        title: result.title,
        url: result.link,
        snippet: result.snippet
      }));
    } catch (error) {
      console.error('SerpAPI search error:', error.message);
      throw error;
    }
  }

  /**
   * Search using Google Custom Search API
   */
  async searchWithGoogleAPI(query) {
    if (!this.googleApiKey || !this.googleCseId) {
      throw new Error('GOOGLE_API_KEY and GOOGLE_CSE_ID required');
    }

    try {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: this.googleApiKey,
          cx: this.googleCseId,
          q: query,
          num: 10
        }
      });

      const results = response.data.items || [];
      
      // Filter for blog/article links
      const blogResults = results.filter(result => {
        const url = result.link?.toLowerCase() || '';
        return this.looksLikeArticle(url, result.title?.toLowerCase() || '');
      });

      return blogResults.slice(0, 2).map(result => ({
        title: result.title,
        url: result.link,
        snippet: result.snippet
      }));
    } catch (error) {
      console.error('Google API search error:', error.message);
      throw error;
    }
  }

  /**
   * Check if URL looks like a blog/article
   */
  looksLikeArticle(url, title) {
    const blogIndicators = ['/blog/', '/article/', '/post/', '/news/', '/story/'];
    const hasBlogPath = blogIndicators.some(indicator => url.includes(indicator));
    
    // Check common blog platforms
    const blogPlatforms = ['medium.com', 'wordpress.com', 'blogger.com', 'tumblr.com', 'substack.com'];
    const isBlogPlatform = blogPlatforms.some(platform => url.includes(platform));
    
    return hasBlogPath || isBlogPlatform;
  }

  /**
   * Main search method - tries SerpAPI first, falls back to Google API
   */
  async search(query) {
    console.log(`🔍 Searching Google for: "${query}"`);
    
    try {
      // Try SerpAPI first (more reliable)
      if (this.serpApiKey) {
        const results = await this.searchWithSerpAPI(query);
        if (results.length > 0) {
          console.log(`✅ Found ${results.length} blog/article results via SerpAPI`);
          return results;
        }
      }
      
      // Fallback to Google Custom Search API
      if (this.googleApiKey && this.googleCseId) {
        const results = await this.searchWithGoogleAPI(query);
        if (results.length > 0) {
          console.log(`✅ Found ${results.length} blog/article results via Google API`);
          return results;
        }
      }
      
      throw new Error('No search API configured. Please set SERPAPI_KEY or GOOGLE_API_KEY + GOOGLE_CSE_ID');
    } catch (error) {
      console.error('Search error:', error.message);
      throw error;
    }
  }
}

