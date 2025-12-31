import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// In-memory store for enhancement progress
const enhancementProgress = new Map();

/**
 * Helper function to parse step from console output
 */
function parseStepFromOutput(output) {
  const stepPatterns = [
    { pattern: /Step 1.*Fetching article|📥 Step 1/i, step: 0, title: 'Fetching article from API' },
    { pattern: /Step 2.*Searching Google|🔍 Step 2/i, step: 1, title: 'Searching Google for similar articles' },
    { pattern: /Step 3.*Scraping content|📄 Step 3/i, step: 2, title: 'Scraping content from reference articles' },
    { pattern: /Step 4.*Enhancing article|🤖 Step 4/i, step: 3, title: 'Enhancing article using AI' },
    { pattern: /Step 5.*Adding citations|📚 Step 5/i, step: 4, title: 'Adding citations' },
    { pattern: /Step 6.*Saving enhanced|💾 Step 6/i, step: 5, title: 'Saving enhanced article' },
  ];

  const completedPatterns = [
    { pattern: /✅ Found article|✅ Found.*relevant articles|✅ Scraped.*reference article|✅ Article enhanced|✅ Citations added|✅ Enhanced article saved/i, step: null },
  ];

  // Check for step completion
  for (const { pattern } of completedPatterns) {
    if (pattern.test(output)) {
      // Find which step was completed by checking previous patterns
      for (let i = stepPatterns.length - 1; i >= 0; i--) {
        if (stepPatterns[i].pattern.test(output)) {
          return { step: stepPatterns[i].step, completed: true, title: stepPatterns[i].title };
        }
      }
    }
  }

  // Check for step start
  for (const { step, title, pattern } of stepPatterns) {
    if (pattern.test(output)) {
      return { step, completed: false, title, inProgress: true };
    }
  }

  return null;
}

/**
 * POST /api/enhance/:id - Enhance an article using Task 3
 * Runs the enhancement script as a separate process to avoid module conflicts
 */
router.post('/:id', async (req, res) => {
  try {
    const articleId = req.params.id;
    const task3Path = path.resolve(__dirname, '../task3');
    
    console.log(`🚀 API: Starting enhancement for article ${articleId}`);
    
    // Initialize progress tracking
    const progress = {
      articleId,
      status: 'in-progress',
      currentStep: 0,
      steps: [
        { title: 'Fetching article from API', status: 'pending', message: '', completedAt: null },
        { title: 'Searching Google for similar articles', status: 'pending', message: '', completedAt: null },
        { title: 'Scraping content from reference articles', status: 'pending', message: '', completedAt: null },
        { title: 'Enhancing article using AI', status: 'pending', message: '', completedAt: null },
        { title: 'Adding citations', status: 'pending', message: '', completedAt: null },
        { title: 'Saving enhanced article', status: 'pending', message: '', completedAt: null }
      ],
      error: null,
      startedAt: new Date(),
      completedAt: null
    };
    
    enhancementProgress.set(articleId, progress);
    
    // Run enhancement script as separate process
    const scriptPath = path.join(task3Path, 'index.js');
    const child = spawn('node', [scriptPath, articleId], {
      cwd: task3Path,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
      env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' }
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      console.log(output);
      
      // Parse progress from output
      const stepInfo = parseStepFromOutput(output);
      if (stepInfo) {
        const currentProgress = enhancementProgress.get(articleId);
        if (currentProgress) {
          if (stepInfo.completed) {
            // Mark step as completed
            if (currentProgress.steps[stepInfo.step]) {
              currentProgress.steps[stepInfo.step].status = 'completed';
              currentProgress.steps[stepInfo.step].completedAt = new Date();
              currentProgress.steps[stepInfo.step].message = 'Completed';
              
              // Mark next step as in-progress if not the last step
              if (stepInfo.step < currentProgress.steps.length - 1) {
                currentProgress.steps[stepInfo.step + 1].status = 'in-progress';
                currentProgress.steps[stepInfo.step + 1].message = 'Processing...';
              }
              
              currentProgress.currentStep = stepInfo.step + 1;
            }
          } else if (stepInfo.inProgress) {
            // Mark step as in-progress
            if (currentProgress.steps[stepInfo.step]) {
              currentProgress.steps[stepInfo.step].status = 'in-progress';
              currentProgress.steps[stepInfo.step].message = 'Processing...';
            }
          }
          
          enhancementProgress.set(articleId, currentProgress);
        }
      }
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error(data.toString());
    });

    child.on('error', (error) => {
      console.error(`❌ API: Failed to start enhancement:`, error.message);
      const currentProgress = enhancementProgress.get(articleId);
      if (currentProgress) {
        currentProgress.status = 'error';
        currentProgress.error = error.message;
        enhancementProgress.set(articleId, currentProgress);
      }
    });

    child.on('exit', (code) => {
      const currentProgress = enhancementProgress.get(articleId);
      if (currentProgress) {
        if (code === 0) {
          console.log(`✅ API: Article ${articleId} enhanced successfully`);
          currentProgress.status = 'completed';
          currentProgress.completedAt = new Date();
          
          // Mark all remaining steps as completed
          currentProgress.steps.forEach((step, index) => {
            if (step.status === 'pending' || step.status === 'in-progress') {
              step.status = 'completed';
              step.completedAt = new Date();
              step.message = 'Completed';
            }
          });
        } else {
          console.error(`❌ API: Enhancement failed for ${articleId} with code ${code}`);
          currentProgress.status = 'error';
          currentProgress.error = stderr || 'Enhancement process failed';
          
          // Mark current step as error
          const inProgressStep = currentProgress.steps.findIndex(s => s.status === 'in-progress');
          if (inProgressStep >= 0) {
            currentProgress.steps[inProgressStep].status = 'error';
            currentProgress.steps[inProgressStep].message = stderr || 'Error occurred';
          }
        }
        enhancementProgress.set(articleId, currentProgress);
        
        // Clean up after 1 hour
        setTimeout(() => {
          enhancementProgress.delete(articleId);
        }, 3600000);
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

/**
 * GET /api/enhance/:id/progress - Get enhancement progress
 */
router.get('/:id/progress', (req, res) => {
  try {
    const articleId = req.params.id;
    const progress = enhancementProgress.get(articleId);
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'Enhancement progress not found. The enhancement may not have started or has been cleaned up.'
      });
    }
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Progress route error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get enhancement progress'
    });
  }
});

export default router;

