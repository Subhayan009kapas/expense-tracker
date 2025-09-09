// src/components/Navigation/Navigation.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

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
          <div className="brand-icon">💰</div>
          <span className="brand-text">ExpenseTracker</span>
        </Link>
        
        {/* Desktop Navigation */}
        {currentUser ? (
          <div className="nav-items">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </Link>
            <Link 
              to="/reports" 
              className={`nav-link ${isActive('/reports') ? 'active' : ''}`}
            >
              <span className="nav-icon">📈</span>
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
                <span className="logout-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="nav-items">
            <Link to="/login" className="nav-link">
              <span className="nav-icon">🔑</span>
              Login
            </Link>
            <Link to="/register" className="nav-link primary">
              <span className="nav-icon">✨</span>
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