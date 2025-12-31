import './ScrapingPanel.css';

const ScrapingPanel = ({ isActive, progress, onClose }) => {
  if (!isActive || !progress) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'in-progress':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        );
    }
  };

  const progressPercentage = progress.total > 0 
    ? Math.round((progress.completed / progress.total) * 100) 
    : 0;

  return (
    <div className={`scraping-panel ${isActive ? 'active' : ''}`}>
      <div className="scraping-panel-header">
        <h3>Scraping Progress</h3>
        <button className="scraping-panel-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="scraping-panel-content">
        <div className="scraping-status" style={{ color: getStatusColor(progress.status) }}>
          <div className="scraping-status-icon">
            {getStatusIcon(progress.status)}
          </div>
          <div className="scraping-status-text">
            <strong>{progress.status === 'completed' ? 'Completed' : progress.status === 'error' ? 'Error' : 'In Progress'}</strong>
            <span>{progress.current}</span>
          </div>
        </div>

        <div className="scraping-progress-bar">
          <div className="scraping-progress-fill" style={{ 
            width: `${progressPercentage}%`,
            backgroundColor: getStatusColor(progress.status)
          }}></div>
        </div>

        <div className="scraping-stats">
          <div className="scraping-stat">
            <span className="scraping-stat-label">Completed:</span>
            <span className="scraping-stat-value">{progress.completed} / {progress.total}</span>
          </div>
          <div className="scraping-stat">
            <span className="scraping-stat-label">Progress:</span>
            <span className="scraping-stat-value">{progressPercentage}%</span>
          </div>
        </div>

        {progress.articles && progress.articles.length > 0 && (
          <div className="scraping-articles">
            <h4>Articles:</h4>
            <ul className="scraping-articles-list">
              {progress.articles.map((article, index) => (
                <li key={index} className={`scraping-article-item ${article.status}`}>
                  <span className="scraping-article-status">
                    {article.status === 'saved' ? '✓' : article.status === 'updated' ? '↻' : '✗'}
                  </span>
                  <span className="scraping-article-title">{article.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {progress.error && (
          <div className="scraping-error">
            <strong>Error:</strong> {progress.error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrapingPanel;

