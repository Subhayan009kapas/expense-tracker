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
              <div className="coin coin-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#fde68a"/>
                  <path d="M9 8.5C9 7.67 9.67 7 10.5 7H13.5C14.88 7 16 8.12 16 9.5C16 10.88 14.88 12 13.5 12H11.5C10.12 12 9 13.12 9 14.5C9 15.88 10.12 17 11.5 17H14" stroke="#a16207" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="coin coin-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="7" width="18" height="12" rx="2" fill="#bae6fd"/>
                  <circle cx="17" cy="13" r="2" fill="#0284c7"/>
                </svg>
              </div>
              <div className="coin coin-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 16L9 11L13 14L20 7" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="20" cy="7" r="2" fill="#7c3aed"/>
                  <circle cx="13" cy="14" r="2" fill="#7c3aed"/>
                  <circle cx="9" cy="11" r="2" fill="#7c3aed"/>
                  <circle cx="4" cy="16" r="2" fill="#7c3aed"/>
                </svg>
              </div>
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
