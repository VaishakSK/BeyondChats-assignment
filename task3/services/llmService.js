import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

/**
 * LLM Service for article enhancement
 * Uses Google Gemini API
 */
export class LLMService {
  constructor() {
    // Use environment variables (set in .env file)
    // Fallback to hardcoded key for development convenience
    this.geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || 'AIzaSyD6XRvNTFskOck-foWTmF3R-VzFQerMP8g';
    // Use gemini-2.5-flash (latest and fastest)
    this.geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  /**
   * Enhance article using Google Gemini
   */
  async enhanceWithGemini(originalArticle, referenceArticles) {
    if (!this.geminiApiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    const genAI = new GoogleGenerativeAI(this.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: this.geminiModel });

    // Prepare reference content
    const referenceContent = referenceArticles.map((ref, index) => 
      `Reference Article ${index + 1}:\nTitle: ${ref.title}\nContent: ${ref.content.substring(0, 3000)}`
    ).join('\n\n');

    const prompt = `You are an expert content writer. Your task is to enhance and rewrite an article to match the style, formatting, and quality of top-ranking articles on Google.

Original Article:
Title: ${originalArticle.title}
Content: ${originalArticle.content}

Reference Articles (top-ranking articles from Google):
${referenceContent}

Instructions:
1. Rewrite the original article to match the style, tone, and formatting of the reference articles
2. Improve the content quality, structure, and readability
3. Maintain the core message and key points from the original article
4. Use similar paragraph structure, heading styles, and formatting as the reference articles
5. Make the article more engaging and informative
6. Ensure proper formatting with headings, paragraphs, and lists where appropriate
7. Keep the article length similar to the reference articles

Return the enhanced article in the following format:
TITLE: [Enhanced title]
CONTENT: [Enhanced content with proper HTML formatting - use <h2>, <h3>, <p>, <ul>, <ol>, <strong>, <em> tags as needed]`;

    try {
      console.log(`🤖 Calling Gemini API (${this.geminiModel}) to enhance article...`);
      
      let result;
      try {
        result = await model.generateContent(prompt);
      } catch (modelError) {
        // If model not found, try alternative models
        if (modelError.message.includes('not found') || modelError.message.includes('404')) {
          console.log(`⚠️  Model ${this.geminiModel} not available, trying gemini-1.5-flash...`);
          const altModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
          result = await altModel.generateContent(prompt);
        } else {
          throw modelError;
        }
      }
      
      const response = result.response;
      const text = response.text();
      
      // Parse response
      const titleMatch = text.match(/TITLE:\s*(.+?)(?:\n|CONTENT:)/i);
      const contentMatch = text.match(/CONTENT:\s*([\s\S]+)/i);
      
      const enhancedTitle = titleMatch ? titleMatch[1].trim() : originalArticle.title;
      const enhancedContent = contentMatch ? contentMatch[1].trim() : text;

      console.log('✅ Article enhanced successfully');
      
      return {
        title: enhancedTitle,
        content: this.extractPlainText(enhancedContent),
        contentHtml: enhancedContent
      };
    } catch (error) {
      console.error('Gemini API error:', error.message);
      throw error;
    }
  }

  /**
   * Extract plain text from HTML
   */
  extractPlainText(html) {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Main enhance method - uses Gemini API
   */
  async enhanceArticle(originalArticle, referenceArticles) {
    try {
      if (this.geminiApiKey) {
        return await this.enhanceWithGemini(originalArticle, referenceArticles);
      } else {
        throw new Error('No LLM API configured. Please set GEMINI_API_KEY or GOOGLE_API_KEY');
      }
    } catch (error) {
      console.error('LLM enhancement error:', error.message);
      throw error;
    }
  }
}

