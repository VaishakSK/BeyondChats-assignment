import './Header.css';

const Header = ({ onHomeClick, showHomeButton = false }) => {
  return (
    <header className="app-header">
      <div className="container">
        <div className="header-content">
          <h1 className="app-title" onClick={showHomeButton ? onHomeClick : undefined} style={{ cursor: showHomeButton ? 'pointer' : 'default' }}>
            <span className="gradient-text">BeyondChats</span> Articles
          </h1>
          <p className="app-subtitle">Article Management System</p>
          {showHomeButton && (
            <button className="btn-home" onClick={onHomeClick}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Home
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

