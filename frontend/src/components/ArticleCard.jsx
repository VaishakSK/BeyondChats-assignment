import { useState } from 'react';
import './ArticleCard.css';

const ArticleCard = ({ article, onViewVersions, onEdit, onDelete, onEnhance, showActions = false, onClick, isEnhancing = false, isEnhancementActive = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick(article);
    }
  };

  return (
    <div
      className={`article-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {article.imageUrl && (
        <div className="article-image">
          <img src={article.imageUrl} alt={article.title} />
        </div>
      )}
      
      <div className="article-content">
        <div className="article-header">
          <h3 className="article-title">{article.title}</h3>
          {article.version && article.version > 1 && (
            <span className="version-badge">v{article.version}</span>
          )}
        </div>
        
        {article.excerpt && (
          <p className="article-excerpt">{article.excerpt}</p>
        )}
        
        <div className="article-meta">
          <span className="article-author">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            {article.author || 'Unknown'}
          </span>
          <span className="article-date">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {formatDate(article.publishedDate || article.createdAt)}
          </span>
        </div>

        {showActions && (
          <div className="article-actions" onClick={(e) => e.stopPropagation()}>
            {onEnhance && (
              <button 
                className="btn btn-enhance"
                onClick={() => onEnhance(article._id || article.id)}
                disabled={isEnhancing || isEnhancementActive}
              >
                {isEnhancing ? (
                  <>
                    <div className="spinner-small"></div>
                    Enhancing...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                    Enhance with AI
                  </>
                )}
              </button>
            )}
            {onViewVersions && (
              <button 
                className="btn btn-secondary"
                onClick={() => onViewVersions(article._id || article.id)}
              >
                View Versions
              </button>
            )}
            {onEdit && (
              <button 
                className="btn btn-primary"
                onClick={() => onEdit(article)}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button 
                className="btn btn-danger"
                onClick={() => onDelete(article._id || article.id)}
              >
                Delete
              </button>
            )}
          </div>
        )}

        {article.sourceUrl && (
          <a 
            href={article.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="article-link"
            onClick={(e) => e.stopPropagation()}
          >
            Read Original →
          </a>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;

