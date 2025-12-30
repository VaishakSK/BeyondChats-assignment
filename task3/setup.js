import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = `# API Configuration
API_BASE_URL=http://localhost:5000/api

# Google Search Configuration - SerpAPI
# Get your key from: https://serpapi.com/
SERPAPI_KEY=your_serpapi_key_here

# LLM Configuration - Google Gemini
# Get your key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
`;

const envPath = path.join(__dirname, '.env');

try {
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('📝 API keys configured:');
    console.log('   - SerpAPI: ✅');
    console.log('   - Gemini API: ✅');
  } else {
    console.log('⚠️  .env file already exists. Skipping creation.');
    console.log('📝 Make sure it contains the API keys.');
  }
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
}

