import express from 'express';
import { scrapeBeyondChats, getScrapingProgress } from '../controllers/scrapeController.js';

const router = express.Router();

// POST scrape articles from BeyondChats
router.post('/beyondchats', scrapeBeyondChats);

// GET scraping progress
router.get('/progress/:progressId', getScrapingProgress);

export default router;

