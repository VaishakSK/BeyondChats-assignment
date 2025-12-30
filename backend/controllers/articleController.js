import Article from '../models/Article.js';

// Get all articles
export const getAllArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const articles = await Article.find()
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    const total = await Article.countDocuments();

    res.json({
      success: true,
      data: articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get article by ID
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get article versions (original and updates)
export const getArticleVersions = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    // Find original article if this is an update
    let originalArticle = null;
    if (article.originalArticleId) {
      originalArticle = await Article.findById(article.originalArticleId);
    } else {
      originalArticle = article;
    }

    // Find all versions/updates of this article
    const updates = await Article.find({
      originalArticleId: originalArticle._id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        original: originalArticle,
        updates: updates,
        current: article
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new article
export const createArticle = async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();

    res.status(201).json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update article (creates a new version)
export const updateArticle = async (req, res) => {
  try {
    const originalArticle = await Article.findById(req.params.id);
    
    if (!originalArticle) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    // Create a new version of the article
    const updateData = {
      ...req.body,
      originalArticleId: originalArticle.originalArticleId || originalArticle._id,
      version: originalArticle.version + 1
    };

    const updatedArticle = new Article(updateData);
    await updatedArticle.save();

    res.json({
      success: true,
      data: updatedArticle,
      message: 'Article updated successfully (new version created)'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete article
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

