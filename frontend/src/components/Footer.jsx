import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>BeyondChats Articles</h4>
            <p>Intelligent Article Management with AI-Powered Enhancement</p>
          </div>
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Article Scraping</li>
              <li>AI Enhancement</li>
              <li>Version Comparison</li>
              <li>Progress Tracking</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Technology</h4>
            <ul>
              <li>React + Vite</li>
              <li>Node.js + Express</li>
              <li>MongoDB</li>
              <li>Google Gemini AI</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} BeyondChats Article Manager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

