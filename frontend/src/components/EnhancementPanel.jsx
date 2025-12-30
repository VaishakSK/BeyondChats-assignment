import { useEffect, useState } from 'react';
import './EnhancementPanel.css';

const EnhancementPanel = ({ isActive, currentArticle, steps, onClose }) => {
  if (!isActive) return null;

  const allCompleted = steps.length > 0 && steps.every(step => step.status === 'completed');
  const hasError = steps.some(step => step.status === 'error');
  const isInProgress = steps.some(step => step.status === 'in-progress');

  return (
    <div className="enhancement-panel">
      <div className={`enhancement-panel-header ${allCompleted ? 'completed' : hasError ? 'error' : ''}`}>
        <h3>
          {allCompleted ? '✓ Enhancement Complete' : hasError ? '✗ Enhancement Failed' : 'Enhancement Progress'}
        </h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      {currentArticle && (
        <div className="current-article-info">
          <h4>{currentArticle.title}</h4>
          <p className="article-meta">
            {allCompleted ? 'Article enhanced successfully!' : hasError ? 'Enhancement encountered an error' : isInProgress ? 'Enhancing article...' : 'Preparing to enhance...'}
          </p>
        </div>
      )}

      {allCompleted && (
        <div className="completion-message">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <p>All steps completed successfully!</p>
        </div>
      )}

      <div className="steps-container">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`step-item ${step.status}`}
          >
            <div className={`step-icon ${step.status === 'completed' ? 'completed-animation' : ''}`}>
              {step.status === 'completed' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="checkmark">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
              {step.status === 'in-progress' && (
                <div className="spinner-small"></div>
              )}
              {step.status === 'pending' && (
                <div className="step-number">{index + 1}</div>
              )}
              {step.status === 'error' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              )}
            </div>
            <div className="step-content">
              <div className="step-title">{step.title}</div>
              {step.message && (
                <div className="step-message">{step.message}</div>
              )}
              {step.details && (
                <div className="step-details">{step.details}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancementPanel;

