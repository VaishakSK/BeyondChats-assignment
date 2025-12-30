import axios from 'axios';

/**
 * Service to interact with the article CRUD API
 */
export class APIService {
  constructor(baseUrl = null) {
    this.baseUrl = baseUrl || process.env.API_BASE_URL || 'http://localhost:5000/api';
  }

  /**
   * Fetch article by ID
   */
  async getArticle(articleId) {
    try {
      const response = await axios.get(`${this.baseUrl}/articles/${articleId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching article ${articleId}:`, error.message);
      throw error;
    }
  }

  /**
   * Create enhanced article
   */
  async createEnhancedArticle(enhancedArticleData) {
    try {
      const response = await axios.post(`${this.baseUrl}/enhanced-articles`, enhancedArticleData);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error creating enhanced article:`, error.message);
      throw error;
    }
  }

  /**
   * Get all articles
   */
  async getAllArticles() {
    try {
      const response = await axios.get(`${this.baseUrl}/articles`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching articles:', error.message);
      throw error;
    }
  }
}

