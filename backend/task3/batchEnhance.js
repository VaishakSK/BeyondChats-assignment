import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { enhanceArticle } from './index.js';
import { APIService } from './services/apiService.js';

// Load environment variables from backend's .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Try to load .env from backend/task3 first, then fallback to backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Enhance multiple articles in batch
 */
async function batchEnhanceArticles(articleIds = null) {
  try {
    const apiService = new APIService(process.env.API_BASE_URL || 'http://localhost:5000/api');
    
    let articlesToEnhance = articleIds;
    
    // If no IDs provided, fetch all articles
    if (!articlesToEnhance || articlesToEnhance.length === 0) {
      console.log('📥 Fetching all articles from API...');
      const allArticles = await apiService.getAllArticles();
      articlesToEnhance = allArticles.map(article => article._id || article.id);
      console.log(`✅ Found ${articlesToEnhance.length} articles to enhance\n`);
    }

    const results = {
      success: [],
      failed: []
    };

    for (let i = 0; i < articlesToEnhance.length; i++) {
      const articleId = articlesToEnhance[i];
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Processing article ${i + 1}/${articlesToEnhance.length}: ${articleId}`);
      console.log('='.repeat(60));

      try {
        await enhanceArticle(articleId);
        results.success.push(articleId);
        console.log(`✅ Article ${articleId} enhanced successfully`);
      } catch (error) {
        console.error(`❌ Failed to enhance article ${articleId}:`, error.message);
        results.failed.push({ id: articleId, error: error.message });
      }

      // Add delay between articles
      if (i < articlesToEnhance.length - 1) {
        console.log('\n⏳ Waiting 5 seconds before next article...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Batch Processing Summary');
    console.log('='.repeat(60));
    console.log(`✅ Successfully enhanced: ${results.success.length} articles`);
    console.log(`❌ Failed: ${results.failed.length} articles`);
    
    if (results.failed.length > 0) {
      console.log('\nFailed articles:');
      results.failed.forEach(({ id, error }) => {
        console.log(`  - ${id}: ${error}`);
      });
    }

    return results;
  } catch (error) {
    console.error('❌ Batch processing error:', error.message);
    throw error;
  }
}

// Main execution
async function main() {
  const articleIds = process.argv.slice(2).filter(arg => arg && !arg.startsWith('--'));
  
  try {
    await batchEnhanceArticles(articleIds.length > 0 ? articleIds : null);
    console.log('\n✅ Batch processing completed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Batch processing failed:', error.message);
    process.exit(1);
  }
}

main();

