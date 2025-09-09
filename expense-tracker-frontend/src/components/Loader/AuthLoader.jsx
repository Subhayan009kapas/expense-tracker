// src/components/Loader/AuthLoader.jsx
import React from 'react';
import './AuthLoader.css';

const AuthLoader = ({ message = "Authenticating..." }) => {
  return (
    <div className="auth-loader-overlay">
      <div className="auth-loader-container">
        <div className="auth-loader-icon">
          <div className="auth-spinner"></div>
        </div>
        <div className="auth-loader-text">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLoader;
