import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import articleRoutes from './routes/articleRoutes.js';
import scrapeRoutes from './routes/scrapeRoutes.js';
import enhanceRoutes from './routes/enhanceRoutes.js';
import enhancedArticleRoutes from './routes/enhancedArticleRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
// Use MONGODB_URI from .env file or fallback (for development)
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://vaishakkolhar123:vaishaksk@assignment.kjibzln.mongodb.net/?appName=assignment';
mongoose.connect(mongoUri)
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// Routes
app.use('/api/articles', articleRoutes);
app.use('/api/scrape', scrapeRoutes);
app.use('/api/enhance', enhanceRoutes); // Task 3: Article enhancement
app.use('/api/enhanced-articles', enhancedArticleRoutes); // Enhanced articles

// Note: Laravel mock routes are not needed since we're using the same backend
// Phase 1 frontend now uses Node.js API endpoints directly

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

