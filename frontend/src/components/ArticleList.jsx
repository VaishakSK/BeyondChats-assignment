import { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import './ArticleList.css';

const ArticleList = ({ 
  articles, 
  loading, 
  error, 
  onViewVersions, 
  onEdit, 
  onDelete,
  showActions = false,
  onArticleClick
}) => {
  if (loading) {
    return (
      <div className="article-list-loading">
        <div className="spinner"></div>
        <p>Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-list-error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>Error loading articles</h3>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="article-list-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <h3>No articles found</h3>
        <p>Start by scraping articles or create a new one</p>
      </div>
    );
  }

  return (
    <div className="article-list">
      {articles.map((article) => (
        <ArticleCard
          key={article._id || article.id}
          article={article}
          onViewVersions={onViewVersions}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions={showActions}
          onClick={onArticleClick}
        />
      ))}
    </div>
  );
};

export default ArticleList;

