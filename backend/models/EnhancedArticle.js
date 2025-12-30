import mongoose from 'mongoose';

const enhancedArticleSchema = new mongoose.Schema({
  originalArticleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  contentHtml: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: 'Enhanced by AI'
  },
  publishedDate: {
    type: Date,
    default: Date.now
  },
  sourceUrl: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  excerpt: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  // Reference articles used for enhancement
  referenceArticles: [{
    title: String,
    url: String,
    author: String,
    publishedDate: Date
  }],
  // Citations added to the article
  citations: {
    type: String,
    default: ''
  },
  citationsHtml: {
    type: String,
    default: ''
  },
  // Metadata
  enhancedAt: {
    type: Date,
    default: Date.now
  },
  modelUsed: {
    type: String,
    default: 'gemini-2.5-flash'
  },
  searchQuery: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
enhancedArticleSchema.index({ originalArticleId: 1, enhancedAt: -1 });
enhancedArticleSchema.index({ enhancedAt: -1 });

const EnhancedArticle = mongoose.model('EnhancedArticle', enhancedArticleSchema);

export default EnhancedArticle;

