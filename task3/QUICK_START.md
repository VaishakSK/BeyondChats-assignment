# Task 3 Quick Start

## 🚀 5-Minute Setup

### Step 1: Install
```bash
cd task3
npm install
```

### Step 2: Get Free API Keys

**Google Search (SerpAPI - Free tier available)**
1. Go to https://serpapi.com/users/sign_up
2. Sign up (free: 100 searches/month)
3. Copy your API key

**OpenAI (Paid, but has free credits)**
1. Go to https://platform.openai.com/signup
2. Sign up and add payment method
3. Get API key from https://platform.openai.com/api-keys

### Step 3: Configure
```bash
cp .env.example .env
```

Edit `.env`:
```env
API_BASE_URL=http://localhost:5000/api
SERPAPI_KEY=paste_your_serpapi_key_here
OPENAI_API_KEY=paste_your_openai_key_here
OPENAI_MODEL=gpt-4
```

### Step 4: Run
```bash
# Get an article ID from your database, then:
node index.js <article_id>
```

## Example

```bash
# 1. Start your backend (if not running)
cd ../backend
npm run dev

# 2. In another terminal, enhance an article
cd task3
node index.js 507f1f77bcf86cd799439011
```

## What Happens

1. ✅ Fetches article from your API
2. ✅ Searches Google for similar articles
3. ✅ Scrapes top 2 blog results
4. ✅ Uses AI to enhance article
5. ✅ Adds citations
6. ✅ Publishes as new version

## Troubleshooting

**"SERPAPI_KEY not found"**
→ Add your key to `.env` file

**"OPENAI_API_KEY not found"**
→ Add your key to `.env` file

**"Article not found"**
→ Check article ID is correct
→ Make sure backend is running

**"No search results"**
→ Check SerpAPI quota
→ Verify API key is correct

