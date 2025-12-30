import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/**
 * POST /api/enhance/:id - Enhance an article using Task 3 script
 * Note: This requires task3 folder to be set up with proper API keys
 */
router.post('/:id', async (req, res) => {
  try {
    const articleId = req.params.id;
    const task3Path = path.join(__dirname, '../../task3');
    
    console.log(`🚀 API: Starting enhancement for article ${articleId}`);
    
    // Run enhancement script in background
    const scriptPath = path.join(task3Path, 'index.js');
    const child = spawn('node', [scriptPath, articleId], {
      cwd: task3Path,
      stdio: 'inherit',
      shell: true
    });

    child.on('error', (error) => {
      console.error(`❌ API: Failed to start enhancement:`, error.message);
    });

    child.on('exit', (code) => {
      if (code === 0) {
        console.log(`✅ API: Article ${articleId} enhanced successfully`);
      } else {
        console.error(`❌ API: Enhancement failed for ${articleId} with code ${code}`);
      }
    });

    // Return immediately (async processing)
    res.json({
      success: true,
      message: `Article enhancement started for article ${articleId}. Processing in background...`,
      articleId: articleId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;

