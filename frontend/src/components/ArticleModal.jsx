import { useEffect, useState } from 'react';
import './ArticleModal.css';

const ArticleModal = ({ article, versions, onClose }) => {
  const [activeVersion, setActiveVersion] = useState('original'); // 'original' or 'enhanced'

  useEffect(() => {
    if (!onClose) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Set default version when versions data loads
  useEffect(() => {
    if (versions?.hasEnhanced) {
      setActiveVersion('enhanced'); // Default to enhanced if available
    } else {
      setActiveVersion('original');
    }
  }, [versions]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!article && !versions) return null;

  // Get the article to display based on active version
  const displayArticle = activeVersion === 'enhanced' && versions?.enhanced
    ? versions.enhanced
    : (versions?.original || article);

  const hasEnhanced = versions?.hasEnhanced || false;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose || (() => {})}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {displayArticle && (
          <div className="modal-article">
            {/* Version Tabs */}
            {hasEnhanced && (
              <div className="version-tabs">
                <button
                  className={`version-tab ${activeVersion === 'original' ? 'active' : ''}`}
                  onClick={() => setActiveVersion('original')}
                >
                  Original Version
                </button>
                <button
                  className={`version-tab ${activeVersion === 'enhanced' ? 'active' : ''}`}
                  onClick={() => setActiveVersion('enhanced')}
                >
                  Enhanced Version
                </button>
              </div>
            )}

            {displayArticle.imageUrl && (
              <div className="modal-image">
                <img src={displayArticle.imageUrl} alt={displayArticle.title} />
              </div>
            )}

            <div className="modal-header">
              <h2>{displayArticle.title}</h2>
              {activeVersion === 'enhanced' && (
                <span className="version-badge enhanced-badge">AI Enhanced</span>
              )}
              {activeVersion === 'original' && hasEnhanced && (
                <span className="version-badge">Original</span>
              )}
            </div>

            <div className="modal-meta">
              <span>
                <strong>Author:</strong> {displayArticle.author || 'Unknown'}
              </span>
              <span>
                <strong>
                  {activeVersion === 'enhanced' ? 'Enhanced' : 'Published'}:
                </strong> {formatDate(
                  activeVersion === 'enhanced' 
                    ? (displayArticle.enhancedAt || displayArticle.createdAt)
                    : (displayArticle.publishedDate || displayArticle.createdAt)
                )}
              </span>
              {activeVersion === 'enhanced' && displayArticle.modelUsed && (
                <span>
                  <strong>Model:</strong> {displayArticle.modelUsed}
                </span>
              )}
            </div>

            <div className="modal-body">
              {displayArticle.contentHtml ? (
                <div 
                  className="article-content-html"
                  dangerouslySetInnerHTML={{ __html: displayArticle.contentHtml }}
                />
              ) : (
                <div className="article-content-text">
                  {displayArticle.content?.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Reference Articles (only for enhanced version) */}
            {activeVersion === 'enhanced' && displayArticle.referenceArticles && displayArticle.referenceArticles.length > 0 && (
              <div className="modal-references">
                <h3>Reference Articles Used</h3>
                <ul className="references-list">
                  {displayArticle.referenceArticles.map((ref, index) => (
                    <li key={index}>
                      <a href={ref.url} target="_blank" rel="noopener noreferrer">
                        {ref.title}
                      </a>
                      {ref.author && <span className="ref-author"> by {ref.author}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {displayArticle.sourceUrl && (
              <a
                href={displayArticle.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-link"
              >
                View Original Article →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleModal;

