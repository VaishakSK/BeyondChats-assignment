import axios from 'axios';

// Base URLs
// Phase 1 uses Node.js backend (no PHP/Laravel needed)
// If you have Laravel running, set VITE_LARAVEL_API_URL=http://localhost:8000/api
const LARAVEL_API_URL = import.meta.env.VITE_LARAVEL_API_URL || 'http://localhost:5000/api';
const NODE_API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:5000/api';

// Create axios instance for Node.js backend (used by both phases)
const nodeApi = axios.create({
  baseURL: NODE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Laravel API Services (Phase 1)
// Uses Node.js backend with Laravel-compatible response format
export const laravelArticleService = {
  // Fetch all articles - uses Node.js backend
  getAllArticles: async () => {
    try {
      const response = await nodeApi.get('/articles');
      // Node.js returns { success: true, data: [...] }
      // Laravel format expects direct array, so return data array
      return response.data.data || response.data || [];
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
      const response = await nodeApi.get(`/articles/${id}/versions`);
      // Return versions data (Laravel format)
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching article versions:', error);
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

