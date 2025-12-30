import { useEffect } from 'react';
import './ArticleModal.css';

const ArticleModal = ({ article, versions, onClose }) => {
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

  const formatDate = (dateString) => {
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

  const displayArticle = article || (versions?.current || versions?.original);
  const updates = versions?.updates || [];

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
            {displayArticle.imageUrl && (
              <div className="modal-image">
                <img src={displayArticle.imageUrl} alt={displayArticle.title} />
              </div>
            )}

            <div className="modal-header">
              <h2>{displayArticle.title}</h2>
              {displayArticle.version && (
                <span className="version-badge">Version {displayArticle.version}</span>
              )}
            </div>

            <div className="modal-meta">
              <span>
                <strong>Author:</strong> {displayArticle.author || 'Unknown'}
              </span>
              <span>
                <strong>Published:</strong> {formatDate(displayArticle.publishedDate || displayArticle.createdAt)}
              </span>
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

            {updates.length > 0 && (
              <div className="modal-versions">
                <h3>Update History</h3>
                <div className="versions-list">
                  {versions.original && versions.original._id !== displayArticle._id && (
                    <div className="version-item">
                      <span className="version-number">Original</span>
                      <span className="version-date">
                        {formatDate(versions.original.createdAt)}
                      </span>
                    </div>
                  )}
                  {updates.map((update, index) => (
                    <div key={update._id} className="version-item">
                      <span className="version-number">v{update.version}</span>
                      <span className="version-date">
                        {formatDate(update.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
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

