import { useState, useEffect } from 'react';
import { laravelArticleService, nodeArticleService } from './services/apiService';
import ArticleList from './components/ArticleList';
import ArticleModal from './components/ArticleModal';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('phase2'); // Default to Phase 2 since Node.js backend is ready
  const [laravelArticles, setLaravelArticles] = useState([]);
  const [nodeArticles, setNodeArticles] = useState([]);
  const [loading, setLoading] = useState({ phase1: false, phase2: false });
  const [error, setError] = useState({ phase1: null, phase2: null });
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleVersions, setArticleVersions] = useState(null);
  const [scraping, setScraping] = useState(false);
  const [enhancing, setEnhancing] = useState({});

  // Fetch Laravel articles (Phase 1)
  const fetchLaravelArticles = async () => {
    setLoading(prev => ({ ...prev, phase1: true }));
    setError(prev => ({ ...prev, phase1: null }));
    try {
      const data = await laravelArticleService.getAllArticles();
      // Handle different response structures
      setLaravelArticles(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch articles from Laravel API. Make sure Laravel API is running on http://localhost:8000';
      setError(prev => ({ ...prev, phase1: errorMessage }));
      console.error('Laravel API Error:', err);
      // Show helpful message for connection errors
      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED' || err.code === 'ECONNABORTED') {
        setError(prev => ({ 
          ...prev, 
          phase1: 'Laravel API is not running on http://localhost:8000. Please start your Laravel server or switch to Phase 2 tab to use the Node.js API.' 
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
    setScraping(true);
    try {
      await nodeArticleService.scrapeArticles();
      await fetchNodeArticles(); // Refresh the list
      alert('Articles scraped successfully!');
    } catch (err) {
      alert('Error scraping articles: ' + (err.message || 'Unknown error'));
    } finally {
      setScraping(false);
    }
  };

  // View article versions
  const handleViewVersions = async (articleId) => {
    try {
      const response = await nodeArticleService.getArticleVersions(articleId);
      setArticleVersions(response.data);
      setSelectedArticle(null);
    } catch (err) {
      alert('Error fetching article versions: ' + (err.message || 'Unknown error'));
    }
  };

  // View article details
  const handleViewArticle = async (article) => {
    setSelectedArticle(article);
    setArticleVersions(null);
    
    // Try to fetch versions if it's a Node.js article
    if (activeTab === 'phase2' && article._id) {
      try {
        const response = await nodeArticleService.getArticleWithVersions(article._id);
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

  // Enhance article using Task 3
  const handleEnhance = async (articleId) => {
    if (!window.confirm('This will enhance the article using Google Search and AI. This may take 1-2 minutes. Continue?')) {
      return;
    }
    
    setEnhancing(prev => ({ ...prev, [articleId]: true }));
    try {
      const response = await nodeArticleService.enhanceArticle(articleId);
      alert('Article enhancement started! It will be processed in the background. Please refresh in a few moments to see the enhanced version.');
      // Refresh articles after a delay
      setTimeout(() => {
        fetchNodeArticles();
      }, 5000);
    } catch (err) {
      alert('Error enhancing article: ' + (err.message || 'Unknown error'));
    } finally {
      setEnhancing(prev => ({ ...prev, [articleId]: false }));
    }
  };

  // Load articles when tab changes
  useEffect(() => {
    if (activeTab === 'phase1') {
      fetchLaravelArticles();
    } else {
      fetchNodeArticles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">
            <span className="gradient-text">BeyondChats</span> Articles
          </h1>
          <p className="app-subtitle">Article Management System</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'phase1' ? 'active' : ''}`}
              onClick={() => setActiveTab('phase1')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              Phase 1: Laravel API
            </button>
            <button
              className={`tab ${activeTab === 'phase2' ? 'active' : ''}`}
              onClick={() => setActiveTab('phase2')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Phase 2: Node.js API
            </button>
          </div>

          {activeTab === 'phase2' && (
            <div className="action-bar">
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
                    Scrape BeyondChats Articles
                  </>
                )}
              </button>
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
            </div>
          )}

          <div className="content-area">
            {activeTab === 'phase1' ? (
              <ArticleList
                articles={laravelArticles}
                loading={loading.phase1}
                error={error.phase1}
                onViewVersions={null}
                onEdit={null}
                onDelete={null}
                showActions={false}
                onArticleClick={handleViewArticle}
              />
            ) : (
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
              />
            )}
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

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px', 
          background: 'rgba(0,0,0,0.7)', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          <div>Phase: {activeTab}</div>
          <div>Laravel Articles: {laravelArticles.length}</div>
          <div>Node Articles: {nodeArticles.length}</div>
        </div>
      )}

    </div>
  );
}

export default App;
