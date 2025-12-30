import { GoogleSearchService } from './services/googleSearch.js';
import { ArticleScraper } from './services/articleScraper.js';
import { LLMService } from './services/llmService.js';
import { APIService } from './services/apiService.js';
import { CitationFormatter } from './utils/citationFormatter.js';

/**
 * Main function to enhance an article
 */
async function enhanceArticle(articleId) {
  try {
    console.log('🚀 Starting article enhancement process...\n');

    // Initialize services (API keys are configured in service constructors)
    const apiService = new APIService();
    const googleSearch = new GoogleSearchService();
    const articleScraper = new ArticleScraper();
    const llmService = new LLMService();
    const citationFormatter = new CitationFormatter();

    // Verify LLMService has the enhanceArticle method
    if (typeof llmService.enhanceArticle !== 'function') {
      throw new Error('LLMService.enhanceArticle is not a function. Available methods: ' + Object.getOwnPropertyNames(Object.getPrototypeOf(llmService)).join(', '));
    }

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

    // Step 3: Scrape content from top 2 results (try more if needed)
    console.log('📄 Step 3: Scraping content from reference articles...');
    let urlsToScrape = searchResults.slice(0, 2).map(result => result.url);
    let referenceArticles = await articleScraper.scrapeArticles(urlsToScrape);
    
    // If we didn't get enough articles, try more URLs
    if (referenceArticles.length === 0 && searchResults.length > 2) {
      console.log(`⚠️  No articles scraped from first 2 URLs, trying more...`);
      urlsToScrape = searchResults.slice(0, Math.min(5, searchResults.length)).map(result => result.url);
      referenceArticles = await articleScraper.scrapeArticles(urlsToScrape);
    }
    
    if (referenceArticles.length === 0) {
      throw new Error(`Failed to scrape content from any reference articles. Tried ${urlsToScrape.length} URLs.`);
    }

    console.log(`✅ Scraped ${referenceArticles.length} reference article(s) from ${urlsToScrape.length} URL(s)\n`);

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

    // Step 6: Save enhanced article to database
    console.log('💾 Step 6: Saving enhanced article to database...');
    const savedEnhancedArticle = await apiService.createEnhancedArticle({
      originalArticleId: articleId,
      title: enhancedArticle.title,
      content: enhancedArticle.content,
      contentHtml: enhancedArticle.contentHtml,
      author: originalArticle.author || 'Enhanced by AI',
      publishedDate: originalArticle.publishedDate || new Date(),
      sourceUrl: originalArticle.sourceUrl,
      imageUrl: originalArticle.imageUrl || '',
      excerpt: enhancedArticle.content.substring(0, 200),
      tags: originalArticle.tags || [],
      referenceArticles: referenceArticles.map(ref => ({
        title: ref.title,
        url: ref.sourceUrl,
        author: ref.author || 'Unknown',
        publishedDate: ref.publishedDate || null
      })),
      citations: citationsText,
      citationsHtml: citationsHtml,
      modelUsed: 'gemini-2.5-flash',
      searchQuery: searchQuery
    });

    console.log('✅ Enhanced article saved successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Original Article: "${originalArticle.title}"`);
    console.log(`   - Enhanced Article: "${enhancedArticle.title}"`);
    console.log(`   - Reference Articles: ${referenceArticles.length}`);
    console.log(`   - Enhanced Article ID: ${savedEnhancedArticle._id || savedEnhancedArticle.id}`);
    console.log(`   - View at: ${process.env.API_BASE_URL || 'http://localhost:5000/api'}/enhanced-articles/versions/${articleId}`);

    return savedEnhancedArticle;
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
const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || 
                     process.argv[1]?.includes('index.js') ||
                     !process.argv[1];

if (isMainModule) {
  main();
}

export { enhanceArticle };

