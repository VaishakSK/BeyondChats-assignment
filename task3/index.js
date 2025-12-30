import dotenv from 'dotenv';
import { GoogleSearchService } from './services/googleSearch.js';
import { ArticleScraper } from './services/articleScraper.js';
import { LLMService } from './services/llmService.js';
import { APIService } from './services/apiService.js';
import { CitationFormatter } from './utils/citationFormatter.js';

dotenv.config();

/**
 * Main function to enhance an article
 */
async function enhanceArticle(articleId) {
  try {
    console.log('🚀 Starting article enhancement process...\n');

    // Initialize services
    const apiService = new APIService(process.env.API_BASE_URL || 'http://localhost:5000/api');
    const googleSearch = new GoogleSearchService();
    const articleScraper = new ArticleScraper();
    const llmService = new LLMService();
    const citationFormatter = new CitationFormatter();

    // Step 1: Fetch article from API
    console.log(`📥 Step 1: Fetching article ${articleId} from API...`);
    const originalArticle = await apiService.getArticle(articleId);
    
    if (!originalArticle) {
      throw new Error(`Article ${articleId} not found`);
    }

    console.log(`✅ Found article: "${originalArticle.title}"\n`);

    // Step 2: Search Google for article title
    console.log('🔍 Step 2: Searching Google for similar articles...');
    const searchQuery = originalArticle.title;
    const searchResults = await googleSearch.search(searchQuery);
    
    if (searchResults.length === 0) {
      throw new Error('No blog/article results found on Google');
    }

    console.log(`✅ Found ${searchResults.length} relevant articles on Google\n`);

    // Step 3: Scrape content from top 2 results
    console.log('📄 Step 3: Scraping content from reference articles...');
    const urlsToScrape = searchResults.slice(0, 2).map(result => result.url);
    const referenceArticles = await articleScraper.scrapeArticles(urlsToScrape);
    
    if (referenceArticles.length === 0) {
      throw new Error('Failed to scrape content from reference articles');
    }

    console.log(`✅ Scraped ${referenceArticles.length} reference articles\n`);

    // Step 4: Enhance article using LLM
    console.log('🤖 Step 4: Enhancing article using LLM...');
    const enhancedArticle = await llmService.enhanceArticle(originalArticle, referenceArticles);
    
    console.log('✅ Article enhanced successfully\n');

    // Step 5: Add citations
    console.log('📚 Step 5: Adding citations...');
    const citationsHtml = citationFormatter.formatCitations(referenceArticles);
    const citationsText = citationFormatter.formatCitationsText(referenceArticles);
    
    // Append citations to content
    enhancedArticle.contentHtml = (enhancedArticle.contentHtml || enhancedArticle.content) + citationsHtml;
    enhancedArticle.content = enhancedArticle.content + citationsText;
    
    console.log('✅ Citations added\n');

    // Step 6: Update article via API (creates new version)
    console.log('💾 Step 6: Publishing enhanced article via API...');
    const updatedArticle = await apiService.updateArticle(articleId, {
      title: enhancedArticle.title,
      content: enhancedArticle.content,
      contentHtml: enhancedArticle.contentHtml,
      author: originalArticle.author || 'Enhanced by AI',
      publishedDate: originalArticle.publishedDate || new Date(),
      sourceUrl: originalArticle.sourceUrl,
      imageUrl: originalArticle.imageUrl || '',
      excerpt: enhancedArticle.content.substring(0, 200),
      tags: originalArticle.tags || [],
      isScraped: originalArticle.isScraped || false
    });

    console.log('✅ Enhanced article published successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Original Article: "${originalArticle.title}"`);
    console.log(`   - Enhanced Article: "${enhancedArticle.title}"`);
    console.log(`   - Reference Articles: ${referenceArticles.length}`);
    console.log(`   - New Version ID: ${updatedArticle._id || updatedArticle.id}`);
    console.log(`   - View at: ${process.env.API_BASE_URL || 'http://localhost:5000/api'}/articles/${updatedArticle._id || updatedArticle.id}`);

    return updatedArticle;
  } catch (error) {
    console.error('❌ Error enhancing article:', error.message);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  const articleId = process.env.ARTICLE_ID || process.argv[2];

  if (!articleId) {
    console.error('❌ Error: Article ID required');
    console.log('Usage: node index.js <article_id>');
    console.log('Or set ARTICLE_ID in .env file');
    process.exit(1);
  }

  try {
    await enhanceArticle(articleId);
    console.log('\n✅ Process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Process failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  main();
} else if (!process.argv[1] || process.argv[1].includes('index.js')) {
  main();
}

export { enhanceArticle };

