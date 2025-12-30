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
// CORS configuration - supports multiple origins for production
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    // In production, check against allowed origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
// MONGODB_URI must be set in .env file
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('❌ MONGODB_URI is not set in .env file');
  console.error('Please create a .env file in the backend directory with: MONGODB_URI=your_connection_string');
  process.exit(1);
}

mongoose.connect(mongoUri)
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

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

