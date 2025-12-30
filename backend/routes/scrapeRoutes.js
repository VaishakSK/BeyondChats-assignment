import express from 'express';
import { scrapeBeyondChats } from '../controllers/scrapeController.js';

const router = express.Router();

// POST scrape articles from BeyondChats
router.post('/beyondchats', scrapeBeyondChats);

export default router;

