import express from 'express';
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  deleteAllArticles,
  getArticleVersions
} from '../controllers/articleController.js';

const router = express.Router();

// GET all articles
router.get('/', getAllArticles);

// DELETE all articles (must be before /:id route)
router.delete('/all', deleteAllArticles);

// GET article by ID
router.get('/:id', getArticleById);

// GET article versions (original and updates)
router.get('/:id/versions', getArticleVersions);

// POST create new article
router.post('/', createArticle);

// PUT update article
router.put('/:id', updateArticle);

// DELETE article
router.delete('/:id', deleteArticle);

export default router;

