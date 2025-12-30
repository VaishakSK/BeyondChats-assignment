# Task 3: Article Enhancement System

Automated system to enhance articles using Google Search results and LLM APIs.

## Features

- 🔍 Searches article titles on Google
- 📄 Fetches and scrapes top 2 blog/article results
- 🤖 Enhances articles using LLM (OpenAI/Anthropic)
- 💾 Publishes enhanced articles via CRUD API
- 📚 Automatically adds citations

## Setup

### 1. Install Dependencies

```bash
cd task3
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Required configuration:

#### API Configuration
```env
API_BASE_URL=http://localhost:5000/api
```

#### Google Search (Choose one)

**Option 1: SerpAPI (Recommended)**
- Sign up at https://serpapi.com/
- Get your API key
```env
SERPAPI_KEY=your_serpapi_key_here
```

**Option 2: Google Custom Search API**
- Create a project at https://console.cloud.google.com/
- Enable Custom Search API
- Create a Custom Search Engine at https://cse.google.com/
```env
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_custom_search_engine_id
```

#### LLM Configuration (Choose one)

**Option 1: OpenAI (Recommended)**
```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4
```

**Option 2: Anthropic Claude**
```env
ANTHROPIC_API_KEY=your_anthropic_key
```

## Usage

### Command Line

```bash
# Enhance a specific article
node index.js <article_id>

# Example
node index.js 507f1f77bcf86cd799439011
```

### Using Environment Variable

```bash
# Set article ID in .env
ARTICLE_ID=507f1f77bcf86cd799439011

# Run script
node index.js
```

### Programmatic Usage

```javascript
import { enhanceArticle } from './index.js';

await enhanceArticle('article_id_here');
```

## How It Works

1. **Fetch Article**: Gets the original article from your API
2. **Google Search**: Searches for the article title on Google
3. **Filter Results**: Finds top 2 blog/article links (excludes social media, videos, etc.)
4. **Scrape Content**: Extracts main content from the 2 reference articles
5. **LLM Enhancement**: Uses AI to rewrite the article matching the style of top-ranking articles
6. **Add Citations**: Automatically adds references at the bottom
7. **Publish**: Updates the article via CRUD API (creates new version)

## Output

The enhanced article will:
- ✅ Match the style and formatting of top-ranking articles
- ✅ Have improved content quality and structure
- ✅ Include proper HTML formatting (headings, paragraphs, lists)
- ✅ Have citations at the bottom referencing the source articles
- ✅ Be saved as a new version in your database

## API Endpoints Used

- `GET /api/articles/:id` - Fetch original article
- `PUT /api/articles/:id` - Update article (creates new version)

## Requirements

- Node.js 16+
- Active internet connection
- API keys for:
  - Google Search (SerpAPI or Google Custom Search)
  - LLM (OpenAI or Anthropic)
- Backend API running on configured URL

## Troubleshooting

### No search results found
- Check your Google Search API key
- Verify your search query is valid
- Try using SerpAPI instead of Google Custom Search

### LLM API errors
- Verify your API key is correct
- Check your API quota/limits
- Try a different model (e.g., gpt-3.5-turbo instead of gpt-4)

### Scraping fails
- Some websites block scrapers
- Check if URLs are accessible
- The script will continue with available articles

## Example Output

```
🚀 Starting article enhancement process...

📥 Step 1: Fetching article 507f1f77bcf86cd799439011 from API...
✅ Found article: "Getting Started with React"

🔍 Step 2: Searching Google for similar articles...
✅ Found 2 relevant articles on Google

📄 Step 3: Scraping content from reference articles...
✅ Scraped 2 reference articles

🤖 Step 4: Enhancing article using LLM...
✅ Article enhanced successfully

📚 Step 5: Adding citations...
✅ Citations added

💾 Step 6: Publishing enhanced article via API...
✅ Enhanced article published successfully!

📊 Summary:
   - Original Article: "Getting Started with React"
   - Enhanced Article: "Complete Guide to Getting Started with React in 2024"
   - Reference Articles: 2
   - New Version ID: 507f1f77bcf86cd799439012
```

