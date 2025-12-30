import express from 'express';
import {
  createEnhancedArticle,
  getEnhancedArticleByOriginalId,
  getAllEnhancedArticlesByOriginalId,
  getArticleWithVersions
} from '../controllers/enhancedArticleController.js';

const router = express.Router();

// POST create enhanced article
router.post('/', createEnhancedArticle);

// GET enhanced article by original article ID (latest)
router.get('/original/:originalId', getEnhancedArticleByOriginalId);

// GET all enhanced articles for an original article
router.get('/original/:originalId/all', getAllEnhancedArticlesByOriginalId);

// GET article with versions (original + enhanced)
router.get('/versions/:id', getArticleWithVersions);

export default router;

