// src/components/Loader/Loader.jsx
import React from 'react';
import './Loader.css';

const Loader = ({ message = "Loading your financial data..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        {/* Animated Logo/Icon */}
        <div className="loader-logo">
          <div className="money-icon">
            <div className="dollar-sign">$</div>
            <div className="money-coins">
              <div className="coin coin-1">💰</div>
              <div className="coin coin-2">💸</div>
              <div className="coin coin-3">📊</div>
            </div>
          </div>
        </div>

        {/* Animated Text */}
        <div className="loader-text">
          <h2>Expense Tracker</h2>
          <p>{message}</p>
        </div>

        {/* Progress Bar */}
        <div className="loader-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
