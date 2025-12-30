import axios from 'axios';

/**
 * Service to interact with the article CRUD API
 */
export class APIService {
  constructor(baseUrl = 'http://localhost:5000/api') {
    this.baseUrl = baseUrl;
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
   * Update article (creates new version)
   */
  async updateArticle(articleId, articleData) {
    try {
      const response = await axios.put(`${this.baseUrl}/articles/${articleId}`, articleData);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error updating article ${articleId}:`, error.message);
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

