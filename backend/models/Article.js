import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
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
    default: 'Unknown'
  },
  publishedDate: {
    type: Date,
    default: Date.now
  },
  sourceUrl: {
    type: String,
    required: true,
    unique: true
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
  isScraped: {
    type: Boolean,
    default: false
  },
  originalArticleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    default: null
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Index for faster queries
articleSchema.index({ publishedDate: -1 });
articleSchema.index({ sourceUrl: 1 });

const Article = mongoose.model('Article', articleSchema);

export default Article;

