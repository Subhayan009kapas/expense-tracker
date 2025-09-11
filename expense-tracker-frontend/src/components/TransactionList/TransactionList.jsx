// src/components/TransactionList/TransactionList.jsx
import React, { useState, useEffect } from 'react';
import { getTransactions, deleteTransaction } from '../../services/api';
import './TransactionList.css';

const TransactionList = ({ filters, refresh }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, [filters, refresh]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactions(filters);
      setTransactions(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch transactions');
      console.error('Error fetching transactions:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        setTransactions(transactions.filter(t => t._id !== id));
      } catch (error) {
        setError('Failed to delete transaction');
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortedTransactions = () => {
    let filtered = transactions;
    
    if (filterType !== 'all') {
      filtered = transactions.filter(t => t.type === filterType);
    }
    
    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'date':
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const formatAmount = (amount, type) => {
    return (
      <span className={`amount ${type}`}>
        {type === 'expense' ? '-' : '+'}${amount.toFixed(2)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Inline SVG icons for categories
  const CategoryIcon = ({ category }) => {
    switch (category) {
      case 'Food':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 3V12" stroke="#64748b" strokeWidth="1.6" strokeLinecap="round"/>
            <path d="M11 3V12" stroke="#64748b" strokeWidth="1.6" strokeLinecap="round"/>
            <path d="M7 12C7 15 9 17 12 17C15 17 17 15 17 12V3" stroke="#64748b" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        );
      case 'Travel':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16L3 8L10 20L12 13L21 16Z" fill="#64748b"/>
          </svg>
        );
      case 'Rent':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 10L12 3L21 10V21H3V10Z" stroke="#64748b" strokeWidth="1.6"/>
            <path d="M9 21V14H15V21" stroke="#64748b" strokeWidth="1.6"/>
          </svg>
        );
      case 'Shopping':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 7H18L17 20H7L6 7Z" stroke="#64748b" strokeWidth="1.6"/>
            <path d="M9 7C9 5.343 10.343 4 12 4C13.657 4 15 5.343 15 7" stroke="#64748b" strokeWidth="1.6"/>
          </svg>
        );
      case 'Entertainment':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="6" width="16" height="10" rx="2" stroke="#64748b" strokeWidth="1.6"/>
            <path d="M4 10L12 13L20 10" stroke="#64748b" strokeWidth="1.6"/>
          </svg>
        );
      case 'Utilities':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L7 12H12L9 22L17 9H12L15 2H12Z" fill="#64748b"/>
          </svg>
        );
      case 'Healthcare':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="7" width="16" height="10" rx="2" stroke="#64748b" strokeWidth="1.6"/>
            <path d="M12 9V15M9 12H15" stroke="#64748b" strokeWidth="1.6"/>
          </svg>
        );
      case 'Salary':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="6" width="18" height="12" rx="2" stroke="#64748b" strokeWidth="1.6"/>
            <circle cx="12" cy="12" r="2.5" fill="#64748b"/>
          </svg>
        );
      case 'Freelance':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="5" width="16" height="14" rx="2" stroke="#64748b" strokeWidth="1.6"/>
            <path d="M4 9H20" stroke="#64748b" strokeWidth="1.6"/>
          </svg>
        );
      case 'Investment':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 16L9 11L13 14L20 7" stroke="#64748b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="20" cy="7" r="1.6" fill="#64748b"/>
            <circle cx="13" cy="14" r="1.6" fill="#64748b"/>
            <circle cx="9" cy="11" r="1.6" fill="#64748b"/>
            <circle cx="4" cy="16" r="1.6" fill="#64748b"/>
          </svg>
        );
      case 'Gift':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="8" width="18" height="12" rx="2" stroke="#64748b" strokeWidth="1.6"/>
            <path d="M12 4C10 4 9 6 9 6C9 6 10 7 12 7C14 7 15 6 15 6C15 6 14 4 12 4Z" stroke="#64748b" strokeWidth="1.6"/>
            <path d="M12 8V20" stroke="#64748b" strokeWidth="1.6"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="5" width="16" height="14" rx="2" stroke="#64748b" strokeWidth="1.6"/>
            <path d="M8 9H16M8 13H16" stroke="#64748b" strokeWidth="1.6"/>
          </svg>
        );
    }
  };

  const getWalletIcon = (wallet) => {
    const icons = {
      'Cash': '💵',
      'Bank': '🏦',
      'UPI': '📱',
      'Credit Card': '💳'
    };
    return icons[wallet] || '💳';
  };

  const sortedTransactions = getSortedTransactions();

  if (loading) {
    return (
      <div className="transaction-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-list-error">
        <div className="error-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#fee2e2"/>
            <path d="M8 8L16 16M16 8L8 16" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <p>{error}</p>
        <button onClick={fetchTransactions} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <div className="list-header">
        <h3>Recent Transactions</h3>
        <div className="list-controls">
          <div className="filter-controls">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="sort-controls">
            <select 
              value={`${sortBy}-${sortOrder}`} 
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="sort-select"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Amount High to Low</option>
              <option value="amount-asc">Amount Low to High</option>
              <option value="category-asc">Category A-Z</option>
              <option value="category-desc">Category Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="no-transactions">
          <div className="no-transactions-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="5" width="16" height="14" rx="2" fill="#e2e8f0"/>
              <path d="M8 9H16M8 13H13" stroke="#94a3b8" strokeWidth="1.6"/>
            </svg>
          </div>
          <h4>No transactions found</h4>
          <p>Start by adding your first transaction above.</p>
        </div>
      ) : (
        <div className="transactions-container">
          {sortedTransactions.map(transaction => (
            <div key={transaction._id} className="transaction-item">
              <div className="transaction-main">
                <div className="transaction-icon">
                  <CategoryIcon category={transaction.category} />
                </div>
                <div className="transaction-details">
                  <div className="transaction-header">
                    <div className="transaction-category">{transaction.category}</div>
                    <div className="transaction-amount">
                      {formatAmount(transaction.amount, transaction.type)}
                    </div>
                  </div>
                  <div className="transaction-meta">
                    <div className="transaction-note">
                      {transaction.note || 'No description'}
                    </div>
                    <div className="transaction-info">
                      <span className="transaction-date">
                        {formatDate(transaction.date)}
                      </span>
                      <span className="transaction-wallet">
                        {/* Simple wallet card icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6 }}>
                          <rect x="3" y="7" width="18" height="12" rx="2" stroke="#94a3b8" strokeWidth="1.6"/>
                          <circle cx="17" cy="13" r="1.5" fill="#94a3b8"/>
                        </svg>
                        {transaction.wallet}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="transaction-actions">
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(transaction._id)}
                  title="Delete transaction"
                >
                  <span className="delete-icon">🗑️</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {sortedTransactions.length > 0 && (
        <div className="list-footer">
          <div className="transaction-count">
            {sortedTransactions.length} transaction{sortedTransactions.length !== 1 ? 's' : ''}
          </div>
          <button 
            className="view-all-btn"
            onClick={() => window.location.href = '/reports'}
          >
            View All Reports
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;