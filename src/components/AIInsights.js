import React from 'react';
import './AIInsights.css';

const AIInsights = ({ insights }) => {
  if (!insights) {
    return (
      <div className="insights-loading">
        Analyzing your spending patterns...
      </div>
    );
  }

  return (
    <div className="ai-insights">
      <div className="insight-section">
        <div className="insight-icon">🤖</div>
        <div className="insight-content">
          <h3>AI Analysis</h3>
          <p>{insights.analysis}</p>
        </div>
      </div>

      {insights.topCategories && insights.topCategories.length > 0 && (
        <div className="insight-section">
          <div className="insight-icon">📊</div>
          <div className="insight-content">
            <h3>Top Spending Categories</h3>
            <div className="categories-list">
              {insights.topCategories.map((category, index) => (
                <span key={index} className="category-badge">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {insights.concerns && insights.concerns.length > 0 && (
        <div className="insight-section warning">
          <div className="insight-icon">⚠️</div>
          <div className="insight-content">
            <h3>Areas of Concern</h3>
            <ul>
              {insights.concerns.map((concern, index) => (
                <li key={index}>{concern}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {insights.recommendation && (
        <div className="insight-section recommendation">
          <div className="insight-icon">💡</div>
          <div className="insight-content">
            <h3>Recommendation</h3>
            <p>{insights.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
