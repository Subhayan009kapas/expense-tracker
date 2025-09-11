// src/components/Navigation/Navigation.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

// Inline SVG Icons
const IconLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="url(#g1)"/>
    <path d="M9 8.5C9 7.67 9.67 7 10.5 7H13.5C14.88 7 16 8.12 16 9.5C16 10.88 14.88 12 13.5 12H11.5C10.12 12 9 13.12 9 14.5C9 15.88 10.12 17 11.5 17H14" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3b82f6"/>
        <stop offset="0.6" stopColor="#8b5cf6"/>
        <stop offset="1" stopColor="#06b6d4"/>
      </linearGradient>
    </defs>
  </svg>
);

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 13H9V20H4V13Z" fill="white" fillOpacity="0.9"/>
    <path d="M10 4H14V20H10V4Z" fill="white" fillOpacity="0.9"/>
    <path d="M15 9H20V20H15V9Z" fill="white" fillOpacity="0.9"/>
  </svg>
);

const IconReports = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 16L9 11L13 14L20 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="20" cy="7" r="1.8" fill="white"/>
    <circle cx="13" cy="14" r="1.8" fill="white"/>
    <circle cx="9" cy="11" r="1.8" fill="white"/>
    <circle cx="4" cy="16" r="1.8" fill="white"/>
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H15" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M10 12H21M21 12L18 9M21 12L18 15" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconLogin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 12H20M20 12L17 9M20 12L17 15" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H15" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.7"/>
  </svg>
);

const IconSparkle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L13.8 8.2L19 10L13.8 11.8L12 17L10.2 11.8L5 10L10.2 8.2L12 3Z" fill="white" fillOpacity="0.9"/>
  </svg>
);

const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/dashboard" className="nav-brand">
          <div className="brand-icon"><IconLogo /></div>
          <span className="brand-text">ExpenseTracker</span>
        </Link>
        
        {/* Desktop Navigation */}
        {currentUser ? (
          <div className="nav-items">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              <span className="nav-icon"><IconDashboard /></span>
              Dashboard
            </Link>
            <Link 
              to="/reports" 
              className={`nav-link ${isActive('/reports') ? 'active' : ''}`}
            >
              <span className="nav-icon"><IconReports /></span>
              Reports
            </Link>
            
            {/* User Menu */}
            <div className="user-menu">
              <div className="user-info">
                <div className="user-avatar">
                  {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name">{currentUser.name}</span>
              </div>
              <button onClick={logout} className="logout-btn">
                <span className="logout-icon"><IconLogout /></span>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="nav-items">
            <Link to="/login" className="nav-link">
              <span className="nav-icon"><IconLogin /></span>
              Login
            </Link>
            <Link to="/register" className="nav-link primary">
              <span className="nav-icon"><IconSparkle /></span>
              Sign Up
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {currentUser ? (
              <>
                <div className="mobile-user-info">
                  <div className="user-avatar">
                    {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="user-details">
                    <div className="user-name">{currentUser.name}</div>
                    <div className="user-email">{currentUser.email}</div>
                  </div>
                </div>
                
                <Link 
                  to="/dashboard" 
                  className={`mobile-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="nav-icon">📊</span>
                  Dashboard
                </Link>
                <Link 
                  to="/reports" 
                  className={`mobile-nav-link ${isActive('/reports') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="nav-icon">📈</span>
                  Reports
                </Link>
                
                <button 
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }} 
                  className="mobile-logout-btn"
                >
                  <span className="logout-icon">🚪</span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="nav-icon">🔑</span>
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="mobile-nav-link primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="nav-icon">✨</span>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;