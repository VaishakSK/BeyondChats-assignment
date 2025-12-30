import axios from 'axios';

// Base URLs
// Phase 1 uses Node.js backend (no PHP/Laravel needed)
// If you have Laravel running, set VITE_LARAVEL_API_URL=http://localhost:8000/api
// By default, both phases use the Node.js API
const LARAVEL_API_URL = import.meta.env.VITE_LARAVEL_API_URL || 'http://localhost:5000/api';
const NODE_API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:5000/api';

// Create axios instance for Node.js backend (used by both phases)
const nodeApi = axios.create({
  baseURL: NODE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for Laravel API
const laravelApi = axios.create({
  baseURL: LARAVEL_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Laravel API Services (Phase 1)
// Note: By default, this uses Node.js API as fallback (no Laravel required)
export const laravelArticleService = {
  // Fetch all articles with pagination
  getAllArticles: async (page = 1, perPage = 10) => {
    try {
      // Try Laravel API first if URL is set to port 8000, otherwise use Node.js API
      if (LARAVEL_API_URL.includes('8000')) {
        const response = await laravelApi.get('/articles', {
          params: { page, per_page: perPage }
        });
        return response.data;
      } else {
        // Use Node.js API (default)
        const response = await nodeApi.get('/articles', {
          params: { page, limit: perPage }
        });
        // Transform Node.js response to match Laravel format
        return {
          data: response.data.data || response.data,
          pagination: response.data.pagination || {
            current_page: page,
            per_page: perPage,
            total: response.data.pagination?.total || (response.data.data || response.data).length,
            last_page: response.data.pagination?.pages || 1
          }
        };
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  // Fetch article by ID
  getArticleById: async (id) => {
    try {
      const response = await nodeApi.get(`/articles/${id}`);
      // Return article data directly (Laravel format)
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  },

  // Fetch article versions (original and updates)
  getArticleVersions: async (id) => {
    try {
      if (LARAVEL_API_URL.includes('8000')) {
        const response = await laravelApi.get(`/articles/${id}/versions`);
        return response.data;
      } else {
        // Use Node.js API
        const response = await nodeApi.get(`/articles/${id}/versions`);
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching article versions:', error);
      throw error;
    }
  },

  // Scrape articles from BeyondChats
  scrapeArticles: async () => {
    try {
      if (LARAVEL_API_URL.includes('8000')) {
        const response = await laravelApi.post('/articles/scrape');
        return response.data;
      } else {
        // Use Node.js API scraping endpoint
        const response = await nodeApi.post('/scrape/beyondchats');
        return response.data;
      }
    } catch (error) {
      console.error('Error scraping articles:', error);
      throw error;
    }
  },
};

// Node.js API Services (Phase 2)
export const nodeArticleService = {
  // Fetch all articles from Node.js API
  getAllArticles: async (page = 1, limit = 10) => {
    try {
      const response = await nodeApi.get('/articles', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching articles from Node.js API:', error);
      throw error;
    }
  },

  // Fetch article by ID
  getArticleById: async (id) => {
    try {
      const response = await nodeApi.get(`/articles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching article from Node.js API:', error);
      throw error;
    }
  },

  // Fetch article versions
  getArticleVersions: async (id) => {
    try {
      const response = await nodeApi.get(`/articles/${id}/versions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching article versions from Node.js API:', error);
      throw error;
    }
  },

  // Create article
  createArticle: async (articleData) => {
    try {
      const response = await nodeApi.post('/articles', articleData);
      return response.data;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  },

  // Update article
  updateArticle: async (id, articleData) => {
    try {
      const response = await nodeApi.put(`/articles/${id}`, articleData);
      return response.data;
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  },

  // Delete article
  deleteArticle: async (id) => {
    try {
      const response = await nodeApi.delete(`/articles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  },

  // Scrape articles from BeyondChats
  scrapeArticles: async () => {
    try {
      const response = await nodeApi.post('/scrape/beyondchats');
      return response.data;
    } catch (error) {
      console.error('Error scraping articles:', error);
      throw error;
    }
  },

  // Enhance article using Task 3 (Google Search + LLM)
  enhanceArticle: async (articleId) => {
    try {
      const response = await nodeApi.post(`/enhance/${articleId}`);
      return response.data;
    } catch (error) {
      console.error('Error enhancing article:', error);
      throw error;
    }
  },

  // Get enhancement progress
  getEnhancementProgress: async (articleId) => {
    try {
      const response = await nodeApi.get(`/enhance/${articleId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Error fetching enhancement progress:', error);
      throw error;
    }
  },

  // Get article with versions (original + enhanced)
  getArticleWithVersions: async (articleId) => {
    try {
      const response = await nodeApi.get(`/enhanced-articles/versions/${articleId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching article with versions:', error);
      throw error;
    }
  },
};

