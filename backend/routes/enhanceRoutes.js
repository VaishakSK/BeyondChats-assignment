import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/**
 * POST /api/enhance/:id - Enhance an article using Task 3
 * Runs the enhancement script as a separate process to avoid module conflicts
 */
router.post('/:id', async (req, res) => {
  try {
    const articleId = req.params.id;
    const task3Path = path.resolve(__dirname, '../../task3');
    
    console.log(`🚀 API: Starting enhancement for article ${articleId}`);
    
    // Run enhancement script as separate process
    const scriptPath = path.join(task3Path, 'index.js');
    // Use shell: false and proper argument escaping for security
    const child = spawn('node', [scriptPath, articleId], {
      cwd: task3Path,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
      env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' }
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
      console.log(data.toString());
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error(data.toString());
    });

    child.on('error', (error) => {
      console.error(`❌ API: Failed to start enhancement:`, error.message);
    });

    child.on('exit', (code) => {
      if (code === 0) {
        console.log(`✅ API: Article ${articleId} enhanced successfully`);
      } else {
        console.error(`❌ API: Enhancement failed for ${articleId} with code ${code}`);
        if (stderr) {
          console.error('Error details:', stderr);
        }
      }
    });

    // Return immediately (async processing)
    res.json({
      success: true,
      message: `Article enhancement started for article ${articleId}. Processing in background...`,
      articleId: articleId
    });
  } catch (error) {
    console.error('Enhancement route error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to start article enhancement'
    });
  }
});

export default router;

