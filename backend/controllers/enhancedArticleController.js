import EnhancedArticle from '../models/EnhancedArticle.js';
import Article from '../models/Article.js';

// Create enhanced article
export const createEnhancedArticle = async (req, res) => {
  try {
    const enhancedArticle = new EnhancedArticle(req.body);
    await enhancedArticle.save();

    res.status(201).json({
      success: true,
      data: enhancedArticle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get enhanced article by original article ID
export const getEnhancedArticleByOriginalId = async (req, res) => {
  try {
    const { originalId } = req.params;
    
    const enhancedArticle = await EnhancedArticle.findOne({ 
      originalArticleId: originalId 
    }).sort({ enhancedAt: -1 }); // Get latest enhancement
    
    if (!enhancedArticle) {
      return res.status(404).json({
        success: false,
        error: 'Enhanced article not found'
      });
    }

    res.json({
      success: true,
      data: enhancedArticle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all enhanced articles for an original article
export const getAllEnhancedArticlesByOriginalId = async (req, res) => {
  try {
    const { originalId } = req.params;
    
    const enhancedArticles = await EnhancedArticle.find({ 
      originalArticleId: originalId 
    }).sort({ enhancedAt: -1 });

    res.json({
      success: true,
      data: enhancedArticles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get article with versions (original + enhanced)
export const getArticleWithVersions = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get original article
    const originalArticle = await Article.findById(id);
    
    if (!originalArticle) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    // Get enhanced article
    const enhancedArticle = await EnhancedArticle.findOne({ 
      originalArticleId: id 
    }).sort({ enhancedAt: -1 });

    res.json({
      success: true,
      data: {
        original: originalArticle,
        enhanced: enhancedArticle || null,
        hasEnhanced: !!enhancedArticle
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

