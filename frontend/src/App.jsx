import { useState, useEffect } from 'react';
import { laravelArticleService, nodeArticleService } from './services/apiService';
import ArticleList from './components/ArticleList';
import ArticleModal from './components/ArticleModal';
import EnhancementPanel from './components/EnhancementPanel';
import ScrapingPanel from './components/ScrapingPanel';
import HomePage from './components/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('phase2'); // Default to Phase 2 - Phase 1 (Laravel) is hidden
  const [_laravelArticles, setLaravelArticles] = useState([]);
  const [nodeArticles, setNodeArticles] = useState([]);
  const [loading, setLoading] = useState({ phase1: false, phase2: false });
  const [error, setError] = useState({ phase1: null, phase2: null });
  const [_laravelPagination, setLaravelPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 });
  const [currentLaravelPage, setCurrentLaravelPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleVersions, setArticleVersions] = useState(null);
  const [scraping, setScraping] = useState(false);
  const [enhancing, setEnhancing] = useState({});
  const [enhancementActive, setEnhancementActive] = useState(false);
  const [currentEnhancingArticle, setCurrentEnhancingArticle] = useState(null);
  const [enhancementSteps, setEnhancementSteps] = useState([]);
  const [enhancementProgressInterval, setEnhancementProgressInterval] = useState(null);
  const [scrapingCount, setScrapingCount] = useState('5');
  const [scrapingActive, setScrapingActive] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState(null);
  const [scrapingProgressInterval, setScrapingProgressInterval] = useState(null);
  const [showHomePage, setShowHomePage] = useState(true);

  // Fetch Laravel articles (Phase 1) with pagination
  const _fetchLaravelArticles = async (page = currentLaravelPage) => {
    setLoading(prev => ({ ...prev, phase1: true }));
    setError(prev => ({ ...prev, phase1: null }));
    try {
      const response = await laravelArticleService.getAllArticles(page, 10);
      // Handle Laravel pagination response
      if (response.data && response.pagination) {
        setLaravelArticles(response.data);
        setLaravelPagination(response.pagination);
        setCurrentLaravelPage(page);
      } else {
        // Fallback for non-paginated response
        setLaravelArticles(Array.isArray(response) ? response : (response.data || []));
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch articles. Make sure the backend server is running on http://localhost:5000';
      setError(prev => ({ ...prev, phase1: errorMessage }));
      console.error('API Error:', err);
      // Show helpful message for connection errors
      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED' || err.code === 'ECONNABORTED') {
        setError(prev => ({ 
          ...prev, 
          phase1: 'Backend server is not running. Please start the Node.js backend server on http://localhost:5000. Run: cd backend && npm run dev' 
        }));
      }
    } finally {
      setLoading(prev => ({ ...prev, phase1: false }));
    }
  };

  // Fetch Node.js articles (Phase 2)
  const fetchNodeArticles = async () => {
    setLoading(prev => ({ ...prev, phase2: true }));
    setError(prev => ({ ...prev, phase2: null }));
    try {
      const response = await nodeArticleService.getAllArticles();
      setNodeArticles(response.data || []);
    } catch (err) {
      setError(prev => ({ ...prev, phase2: err.message || 'Failed to fetch articles from Node.js API' }));
      console.error('Node.js API Error:', err);
    } finally {
      setLoading(prev => ({ ...prev, phase2: false }));
    }
  };

  // Scrape articles from BeyondChats
  const handleScrape = async () => {
    // Parse the input value
    const inputValue = parseInt(scrapingCount);
    
    // Validate the input
    if (isNaN(inputValue) || inputValue < 1) {
      alert('Please enter a valid number greater than 0.');
      return;
    }
    
    if (inputValue > 10) {
      alert('Error: Maximum 10 articles can be scraped at once. Please enter a number between 1 and 10.');
      return;
    }
    
    const count = inputValue;
    setScraping(true);
    setScrapingActive(true);
    
    // Initialize progress
    const initialProgress = {
      status: 'in-progress',
      total: count,
      completed: 0,
      current: 'Starting...',
      articles: [],
      startedAt: new Date(),
      completedAt: null,
      error: null
    };
    setScrapingProgress(initialProgress);
    
    try {
      const response = await nodeArticleService.scrapeArticles(count);
      const progressId = response.progressId;
      
      if (progressId) {
        // Start polling for progress
        const pollProgress = async () => {
          try {
            const progressResponse = await nodeArticleService.getScrapingProgress(progressId);
            
            if (progressResponse.success && progressResponse.data) {
              const progress = progressResponse.data;
              setScrapingProgress(progress);
              
              // Check if scraping is completed
              if (progress.status === 'completed') {
                // Clear polling interval
                if (scrapingProgressInterval) {
                  clearInterval(scrapingProgressInterval);
                  setScrapingProgressInterval(null);
                }
                
                // Don't auto-refresh - user must click refresh button
                // Reset after a delay
                setTimeout(() => {
                  setScrapingActive(false);
                  setScrapingProgress(null);
                }, 3000);
              } else if (progress.status === 'error') {
                // Clear polling interval on error
                if (scrapingProgressInterval) {
                  clearInterval(scrapingProgressInterval);
                  setScrapingProgressInterval(null);
                }
                
                // Keep panel open to show error
              }
            }
          } catch (err) {
            console.error('Error polling scraping progress:', err);
          }
        };
        
        // Poll every 2 seconds
        const progressInterval = setInterval(pollProgress, 2000);
        setScrapingProgressInterval(progressInterval);
        
        // Initial poll
        pollProgress();
      } else {
        // Fallback: no progress tracking
        // Don't auto-refresh - user must click refresh button
        setScrapingActive(false);
        setScrapingProgress(null);
        alert('Articles scraped successfully! Please click Refresh to see the new articles.');
      }
    } catch (err) {
      if (scrapingProgressInterval) {
        clearInterval(scrapingProgressInterval);
        setScrapingProgressInterval(null);
      }
      setScrapingActive(false);
      setScrapingProgress(null);
      alert('Error scraping articles: ' + (err.message || 'Unknown error'));
    } finally {
      setScraping(false);
    }
  };

  // View article versions
  const handleViewVersions = async (articleId) => {
    try {
      // Use getArticleWithVersions to get both original and enhanced versions
      const response = await nodeArticleService.getArticleWithVersions(articleId);
      if (response.success && response.data) {
        setArticleVersions({
          original: response.data.original,
          enhanced: response.data.enhanced,
          hasEnhanced: response.data.hasEnhanced
        });
        setSelectedArticle(null);
      } else {
        // Fallback to original article if no enhanced version
        const article = nodeArticles.find(a => (a._id || a.id) === articleId);
        if (article) {
          setArticleVersions({
            original: article,
            enhanced: null,
            hasEnhanced: false
          });
          setSelectedArticle(null);
        }
      }
    } catch (err) {
      console.error('Error fetching article versions:', err);
      // Fallback: show original article
      const article = nodeArticles.find(a => (a._id || a.id) === articleId);
      if (article) {
        setArticleVersions({
          original: article,
          enhanced: null,
          hasEnhanced: false
        });
        setSelectedArticle(null);
      } else {
        alert('Error fetching article versions: ' + (err.message || 'Unknown error'));
      }
    }
  };

  // View article details
  const handleViewArticle = async (article) => {
    setSelectedArticle(article);
    setArticleVersions(null);
    
    // Try to fetch versions if it's a Node.js article
    if (activeTab === 'phase2' && article._id) {
      try {
        // Try fetching versions with retry mechanism in case enhanced article is still being saved
        let response;
        let retries = 3;
        let delay = 200; // Start with 200ms delay
        
        for (let attempt = 0; attempt < retries; attempt++) {
          try {
            response = await nodeArticleService.getArticleWithVersions(article._id);
            // If we got a response (even without enhanced version), use it
            break;
          } catch (err) {
            // If it's the last attempt, throw the error
            if (attempt === retries - 1) {
              throw err;
            }
            // Wait before retrying (enhanced article might still be saving to database)
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 1.5; // Exponential backoff: 200ms, 300ms, 450ms
          }
        }
        
        // Transform response to match modal expectations
        setArticleVersions({
          original: response.data.original,
          enhanced: response.data.enhanced,
          hasEnhanced: response.data.hasEnhanced
        });
      } catch (err) {
        console.error('Error fetching versions:', err);
        // If no enhanced version, just show original
        setArticleVersions({
          original: article,
          enhanced: null,
          hasEnhanced: false
        });
      }
    }
  };

  // Delete article
  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }
    try {
      await nodeArticleService.deleteArticle(articleId);
      await fetchNodeArticles();
      alert('Article deleted successfully!');
    } catch (err) {
      alert('Error deleting article: ' + (err.message || 'Unknown error'));
    }
  };

  // Delete all articles
  const handleDeleteAll = async () => {
    const articleCount = nodeArticles.length;
    if (articleCount === 0) {
      alert('No articles to delete.');
      return;
    }

    const confirmMessage = `Are you sure you want to delete ALL ${articleCount} article(s)?\n\nThis action cannot be undone and will also delete all enhanced versions.`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    // Double confirmation for safety
    if (!window.confirm('This is your last chance. Are you absolutely sure you want to delete ALL articles?')) {
      return;
    }

    try {
      const response = await nodeArticleService.deleteAllArticles();
      await fetchNodeArticles();
      alert(`Successfully deleted ${response.deletedArticles || articleCount} article(s) and ${response.deletedEnhanced || 0} enhanced version(s).`);
    } catch (err) {
      alert('Error deleting articles: ' + (err.message || 'Unknown error'));
    }
  };

  // Enhance article using Task 3
  const handleEnhance = async (articleId) => {
    // Prevent multiple enhancements
    if (enhancementActive) {
      alert('Another article is currently being enhanced. Please wait for it to complete.');
      return;
    }

    if (!window.confirm('This will enhance the article using Google Search and AI. This may take 1-2 minutes. Continue?')) {
      return;
    }

    // Find the article being enhanced
    const article = nodeArticles.find(a => (a._id || a.id) === articleId);
    
    // Initialize enhancement state
    setEnhancementActive(true);
    setCurrentEnhancingArticle(article);
    setEnhancing(prev => ({ ...prev, [articleId]: true }));
    
    // Initialize steps
    const initialSteps = [
      { title: 'Fetching article from API', status: 'pending', message: '', completedAt: null },
      { title: 'Searching Google for similar articles', status: 'pending', message: '', completedAt: null },
      { title: 'Scraping content from reference articles', status: 'pending', message: '', completedAt: null },
      { title: 'Enhancing article using AI', status: 'pending', message: '', completedAt: null },
      { title: 'Adding citations', status: 'pending', message: '', completedAt: null },
      { title: 'Saving enhanced article', status: 'pending', message: '', completedAt: null }
    ];
    setEnhancementSteps(initialSteps);

    try {
      // Start enhancement
      await nodeArticleService.enhanceArticle(articleId);
      
      // Start polling for progress
      const pollProgress = async () => {
        try {
          const progressResponse = await nodeArticleService.getEnhancementProgress(articleId);
          
          if (progressResponse.success && progressResponse.data) {
            const progress = progressResponse.data;
            
            // Update steps with real progress
            setEnhancementSteps(progress.steps || initialSteps);
            
            // Check if enhancement is completed
            if (progress.status === 'completed') {
              // Clear polling interval
              if (enhancementProgressInterval) {
                clearInterval(enhancementProgressInterval);
                setEnhancementProgressInterval(null);
              }
              
              // Reset enhancing state
              setEnhancing(prev => {
                const newState = { ...prev };
                delete newState[articleId];
                return newState;
              });
              
              // Refresh articles immediately
              fetchNodeArticles();
              
              // Also pre-fetch versions to make them available immediately
              // Retry mechanism to ensure enhanced article is saved in database
              const fetchVersionsWithRetry = async (retries = 5, delay = 500) => {
                for (let i = 0; i < retries; i++) {
                  try {
                    const versionResponse = await nodeArticleService.getArticleWithVersions(articleId);
                    if (versionResponse.data && versionResponse.data.hasEnhanced) {
                      // Enhanced article is available, update the article in the list
                      setNodeArticles(prev => {
                        return prev.map(article => {
                          if ((article._id || article.id) === articleId) {
                            // Mark that this article has an enhanced version
                            return { ...article, hasEnhanced: true };
                          }
                          return article;
                        });
                      });
                      break; // Success, exit retry loop
                    }
                  } catch {
                    // If not found, wait and retry
                    if (i < retries - 1) {
                      await new Promise(resolve => setTimeout(resolve, delay));
                    }
                  }
                }
              };
              
              // Start fetching versions with retry (don't await, let it run in background)
              fetchVersionsWithRetry();
              
              // Panel stays open - user must close manually
            } else if (progress.status === 'error') {
              // Clear polling interval on error
              if (enhancementProgressInterval) {
                clearInterval(enhancementProgressInterval);
                setEnhancementProgressInterval(null);
              }
              
              // Reset enhancing state
              setEnhancing(prev => {
                const newState = { ...prev };
                delete newState[articleId];
                return newState;
              });
              
              // Don't show alert - error is shown in the panel
            }
          }
        } catch (err) {
          // If progress not found, it might have been cleaned up (completed)
          // Check if we should stop polling
          console.error('Error polling progress:', err);
        }
      };
      
      // Poll every 2 seconds
      const progressInterval = setInterval(pollProgress, 2000);
      setEnhancementProgressInterval(progressInterval);
      
      // Initial poll
      pollProgress();
      
    } catch (err) {
      // Mark current step as error
      setEnhancementSteps(prev => {
        const newSteps = [...prev];
        const currentStepIndex = newSteps.findIndex(s => s.status === 'in-progress' || s.status === 'pending');
        if (currentStepIndex >= 0) {
          newSteps[currentStepIndex] = { ...newSteps[currentStepIndex], status: 'error', message: err.message || 'Error occurred' };
        }
        return newSteps;
      });
      
      alert('Error starting enhancement: ' + (err.message || 'Unknown error'));
      setEnhancing(prev => ({ ...prev, [articleId]: false }));
    }
  };

  // Close enhancement panel
  const handleCloseEnhancementPanel = () => {
    // Check if enhancement is still in progress
    const isInProgress = enhancementSteps.some(step => step.status === 'in-progress' || step.status === 'pending');
    
    if (isInProgress) {
      if (!window.confirm('Enhancement is still in progress. Are you sure you want to close the panel? The enhancement will continue in the background.')) {
        return;
      }
    }
    
    setEnhancementActive(false);
    setCurrentEnhancingArticle(null);
    setEnhancementSteps([]);
    if (enhancementProgressInterval) {
      clearInterval(enhancementProgressInterval);
      setEnhancementProgressInterval(null);
    }
    
    // Reset enhancing state for all articles
    setEnhancing({});
  };

  // Load articles when tab changes
  useEffect(() => {
    // Phase 1 (Laravel) is hidden - always load Phase 2 articles
    fetchNodeArticles();
  }, [activeTab]);

  // Close scraping panel
  const handleCloseScrapingPanel = () => {
    if (scrapingProgress?.status === 'in-progress') {
      if (!window.confirm('Scraping is still in progress. Are you sure you want to close the panel? The scraping will continue in the background.')) {
        return;
      }
    }
    setScrapingActive(false);
    setScrapingProgress(null);
    if (scrapingProgressInterval) {
      clearInterval(scrapingProgressInterval);
      setScrapingProgressInterval(null);
    }
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (enhancementProgressInterval) {
        clearInterval(enhancementProgressInterval);
      }
      if (scrapingProgressInterval) {
        clearInterval(scrapingProgressInterval);
      }
    };
  }, [enhancementProgressInterval, scrapingProgressInterval]);

  if (showHomePage) {
    return (
      <div className="app">
        <HomePage onGetStarted={() => setShowHomePage(false)} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header onHomeClick={() => setShowHomePage(true)} showHomeButton={true} />

      <main className="app-main">
        <div className="container">
          {/* Tabs - Phase 1 (Laravel) is hidden, only showing Phase 2 */}
          {/* Phase 1 tab hidden - code kept for future use */}
          <div className="tabs" style={{ display: 'none' }}>
            <button
              className={`tab ${activeTab === 'phase1' ? 'active' : ''}`}
              onClick={() => setActiveTab('phase1')}
              style={{ display: 'none' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              Phase 1: Laravel API
            </button>
          </div>

          {/* Phase 1 action bar - hidden, code kept for future use */}
          {/* {activeTab === 'phase1' && (
            <div className="action-bar">
              <button
                className="btn-scrape"
                onClick={async () => {
                  setScraping(true);
                  try {
                    await laravelArticleService.scrapeArticles();
                    await fetchLaravelArticles(1);
                    alert('Articles scraped successfully!');
                  } catch (err) {
                    alert('Error scraping articles: ' + (err.message || 'Unknown error'));
                  } finally {
                    setScraping(false);
                  }
                }}
                disabled={scraping}
              >
                {scraping ? (
                  <>
                    <div className="spinner-small"></div>
                    Scraping...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Scrape All BeyondChats Articles
                  </>
                )}
              </button>
              <button
                className="btn-refresh"
                onClick={() => fetchLaravelArticles(currentLaravelPage)}
                disabled={loading.phase1}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                Refresh
              </button>
            </div>
          )} */}

          {activeTab === 'phase2' && (
            <div className="action-bar">
              <div className="scrape-controls">
                <label htmlFor="scrape-count" style={{ marginRight: '10px', fontWeight: '500' }}>
                  Number of articles (max 10):
                </label>
                <input
                  id="scrape-count"
                  type="number"
                  min="1"
                  value={scrapingCount}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Allow empty string for clearing, or valid numbers
                    if (inputValue === '' || (!isNaN(parseInt(inputValue)) && parseInt(inputValue) >= 0)) {
                      setScrapingCount(inputValue === '' ? '' : inputValue);
                    }
                  }}
                  onBlur={(e) => {
                    // Ensure minimum value of 1 when field loses focus
                    const val = parseInt(e.target.value);
                    if (isNaN(val) || val < 1) {
                      setScrapingCount(5);
                    }
                  }}
                  disabled={scraping}
                  placeholder="5"
                  style={{
                    width: '80px',
                    padding: '8px',
                    marginRight: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
                <button
                  className="btn-scrape"
                  onClick={handleScrape}
                  disabled={scraping}
                >
                  {scraping ? (
                    <>
                      <div className="spinner-small"></div>
                      Scraping...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Scrape Articles
                    </>
                  )}
                </button>
              </div>
              <button
                className="btn-refresh"
                onClick={fetchNodeArticles}
                disabled={loading.phase2}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                Refresh
              </button>
              <button
                className="btn-delete-all"
                onClick={handleDeleteAll}
                disabled={loading.phase2 || nodeArticles.length === 0}
                title={nodeArticles.length === 0 ? 'No articles to delete' : 'Delete all articles'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Delete All
              </button>
            </div>
          )}

          <div className={`content-area ${enhancementActive ? 'with-enhancement-panel' : ''} ${scrapingActive ? 'with-scraping-panel' : ''}`}>
            {/* Phase 1 content - hidden, code kept for future use */}
            {/* {activeTab === 'phase1' ? (
              <ArticleList
                articles={laravelArticles}
                loading={loading.phase1}
                error={error.phase1}
                onViewVersions={null}
                onEdit={null}
                onDelete={null}
                showActions={false}
                onArticleClick={handleViewArticle}
                pagination={laravelPagination}
                onPageChange={(page) => fetchLaravelArticles(page)}
              />
            ) : ( */}
              <ArticleList
                articles={nodeArticles}
                loading={loading.phase2}
                error={error.phase2}
                onViewVersions={handleViewVersions}
                onEdit={null}
                onDelete={handleDelete}
                onEnhance={handleEnhance}
                showActions={true}
                onArticleClick={handleViewArticle}
                enhancing={enhancing}
                isEnhancementActive={enhancementActive}
              />
            {/* )} */}
          </div>
        </div>
      </main>

      {(selectedArticle || articleVersions) && (
        <ArticleModal
          article={selectedArticle}
          versions={articleVersions}
          onClose={() => {
            setSelectedArticle(null);
            setArticleVersions(null);
          }}
        />
      )}

      {/* Enhancement Panel */}
      <EnhancementPanel
        isActive={enhancementActive}
        currentArticle={currentEnhancingArticle}
        steps={enhancementSteps}
        onClose={handleCloseEnhancementPanel}
      />

      {/* Scraping Panel */}
      <ScrapingPanel
        isActive={scrapingActive}
        progress={scrapingProgress}
        onClose={handleCloseScrapingPanel}
      />

      {/* Debug info - remove in production */}
      {import.meta.env.DEV && (
        <div style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: enhancementActive ? '420px' : '10px',
          background: 'rgba(0,0,0,0.7)', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999,
          transition: 'right 0.3s ease'
        }}>
          <div>Phase: {activeTab}</div>
          {/* <div>Laravel Articles: {laravelArticles.length}</div> */}
          <div>Node Articles: {nodeArticles.length}</div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
