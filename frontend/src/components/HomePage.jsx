import './HomePage.css';

const HomePage = ({ onGetStarted }) => {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="container">
          <h1 className="home-title">
            <span className="gradient-text">BeyondChats</span> Article Manager
          </h1>
          <p className="home-subtitle">
            Automated web scraping, AI-powered content enhancement using Google Gemini, and version control for article management.
          </p>
          <button className="btn-get-started" onClick={onGetStarted}>
            Get Started
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div className="home-features">
        <div className="container">
          <h2 className="section-title">What We Do</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </div>
              <h3>Article Scraping</h3>
              <p>
                Automated web scraping from BeyondChats blog using Cheerio. Batch processing 
                supports 1-10 articles with real-time progress tracking. Processing time: 120-180 seconds minimum per batch.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3>AI Enhancement</h3>
              <p>
                Content enhancement via SerpAPI/Google Search and Google Gemini 2.5 Flash. 
                Extracts reference articles, performs semantic analysis, and generates 
                enhanced versions with citations.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
              </div>
              <h3>Version Management</h3>
              <p>
                MongoDB-based version control with side-by-side comparison. Tracks 
                reference articles, citations, and enhancement metadata for audit trails.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="home-how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Scrape Articles</h3>
                <p>
                  Select article count (1-10) and initiate scraping. The system fetches 
                  oldest articles from BeyondChats blog, extracts content via Cheerio, 
                  and stores in MongoDB. Processing time: 120-180 seconds minimum.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Enhance with AI</h3>
                <p>
                  Select any article and click "Enhance with AI". The system will search 
                  Google for similar high-quality articles, scrape their content, and use 
                  AI to improve your article's quality, structure, and formatting.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Compare Versions</h3>
                <p>
                  Click "View Versions" to see both the original and enhanced versions 
                  side-by-side. You can switch between them to see all the improvements 
                  made by the AI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="home-benefits">
        <div className="container">
          <h2 className="section-title">Why It's Useful</h2>
          <div className="benefits-list">
            <div className="benefit-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <div>
                <h4>Save Time</h4>
                <p>Automatically collect and enhance articles without manual work</p>
              </div>
            </div>
            <div className="benefit-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <div>
                <h4>Improve Quality</h4>
                <p>AI-powered enhancement matches top-ranking article standards</p>
              </div>
            </div>
            <div className="benefit-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <div>
                <h4>Track Progress</h4>
                <p>Real-time progress tracking for both scraping and enhancement</p>
              </div>
            </div>
            <div className="benefit-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <div>
                <h4>Easy Comparison</h4>
                <p>Side-by-side comparison of original and enhanced versions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

