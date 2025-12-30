# Task 3: Complete Setup Guide

## Overview

Task 3 creates an automated system that:
1. Fetches articles from your API
2. Searches article titles on Google
3. Scrapes top 2 blog/article results
4. Uses LLM to enhance articles matching top-ranking styles
5. Publishes enhanced articles with citations

## Project Structure

```
task3/
├── index.js                 # Main script
├── batchEnhance.js          # Batch processing script
├── package.json            # Dependencies
├── .env.example            # Environment template
├── services/
│   ├── googleSearch.js     # Google search service
│   ├── articleScraper.js   # Article scraping service
│   ├── llmService.js       # LLM integration
│   └── apiService.js       # API client
└── utils/
    └── citationFormatter.js # Citation formatting
```

## Quick Start

### 1. Install Dependencies

```bash
cd task3
npm install
```

### 2. Get API Keys

#### Google Search API (Choose one)

**Option A: SerpAPI (Easiest)**
1. Sign up at https://serpapi.com/
2. Get free API key (100 searches/month free)
3. Add to `.env`: `SERPAPI_KEY=your_key`

**Option B: Google Custom Search**
1. Go to https://console.cloud.google.com/
2. Create project and enable "Custom Search API"
3. Get API key
4. Go to https://cse.google.com/
5. Create custom search engine
6. Get Search Engine ID
7. Add to `.env`:
   ```
   GOOGLE_API_KEY=your_key
   GOOGLE_CSE_ID=your_cse_id
   ```

#### LLM API (Choose one)

**Option A: OpenAI (Recommended)**
1. Sign up at https://platform.openai.com/
2. Get API key
3. Add to `.env`:
   ```
   OPENAI_API_KEY=your_key
   OPENAI_MODEL=gpt-4
   ```

**Option B: Anthropic Claude**
1. Sign up at https://console.anthropic.com/
2. Get API key
3. Add to `.env`:
   ```
   ANTHROPIC_API_KEY=your_key
   ```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
API_BASE_URL=http://localhost:5000/api
SERPAPI_KEY=your_serpapi_key
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4
```

### 4. Run the Script

```bash
# Enhance a specific article
node index.js <article_id>

# Example
node index.js 507f1f77bcf86cd799439011
```

## Usage Examples

### Single Article Enhancement

```bash
# Get an article ID from your database
# Then run:
node index.js 507f1f77bcf86cd799439011
```

### Batch Processing

```bash
# Enhance multiple articles
node batchEnhance.js <id1> <id2> <id3>

# Enhance all articles
node batchEnhance.js
```

### Via API Endpoint (Optional)

Add to `backend/server.js`:
```javascript
import enhanceRoutes from './routes/enhanceRoutes.js';
app.use('/api/enhance', enhanceRoutes);
```

Then call:
```bash
curl -X POST http://localhost:5000/api/enhance/507f1f77bcf86cd799439011
```

## How It Works

### Step-by-Step Process

1. **Fetch Article**: Gets original article from your API
2. **Google Search**: Searches for article title
3. **Filter Results**: Finds top 2 blog/article links
   - Excludes: YouTube, Facebook, Twitter, etc.
   - Includes: Blogs, articles, Medium, WordPress, etc.
4. **Scrape Content**: Extracts main content from 2 articles
5. **LLM Enhancement**: 
   - Analyzes reference articles' style
   - Rewrites original article to match
   - Improves formatting and structure
6. **Add Citations**: Formats references at bottom
7. **Publish**: Updates via CRUD API (creates new version)

### Output Format

Enhanced articles include:
- ✅ Improved title
- ✅ Enhanced content matching top-ranking style
- ✅ Proper HTML formatting (headings, paragraphs, lists)
- ✅ Citations section at bottom with:
  - Reference article titles
  - Authors
  - Publication dates
  - Source URLs

## API Integration

The script uses your existing CRUD APIs:
- `GET /api/articles/:id` - Fetch article
- `PUT /api/articles/:id` - Update article (creates version)

## Troubleshooting

### "No search results found"
- Check Google Search API key
- Verify API quota not exceeded
- Try SerpAPI if Google Custom Search fails

### "LLM API error"
- Verify API key is correct
- Check API quota/limits
- Try different model (gpt-3.5-turbo if gpt-4 fails)

### "Scraping failed"
- Some websites block scrapers
- Script continues with available articles
- Check network connectivity

### "Article not found"
- Verify article ID is correct
- Check API is running
- Verify API_BASE_URL in .env

## Cost Estimates

### SerpAPI
- Free: 100 searches/month
- Paid: $50/month for 5,000 searches

### OpenAI
- GPT-4: ~$0.03 per article enhancement
- GPT-3.5-turbo: ~$0.01 per article enhancement

### Google Custom Search
- Free: 100 searches/day
- Paid: $5 per 1,000 searches

## Best Practices

1. **Rate Limiting**: Script includes delays to avoid overwhelming APIs
2. **Error Handling**: Continues processing even if some steps fail
3. **Versioning**: Creates new versions, doesn't overwrite originals
4. **Citations**: Always includes references for transparency

## Next Steps

1. Set up API keys
2. Test with one article
3. Review enhanced output
4. Adjust LLM prompts if needed
5. Run batch processing for all articles

## Support

Check the README.md in task3/ folder for detailed documentation.

