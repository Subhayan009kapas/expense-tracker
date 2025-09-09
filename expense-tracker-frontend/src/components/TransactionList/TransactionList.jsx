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

  const getCategoryIcon = (category) => {
    const icons = {
      'Food': '🍔',
      'Travel': '✈️',
      'Rent': '🏠',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Utilities': '⚡',
      'Healthcare': '🏥',
      'Salary': '💰',
      'Freelance': '💼',
      'Investment': '📈',
      'Gift': '🎁',
      'Other': '📝'
    };
    return icons[category] || '📝';
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
        <div className="error-icon">❌</div>
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
          <div className="no-transactions-icon">📝</div>
          <h4>No transactions found</h4>
          <p>Start by adding your first transaction above.</p>
        </div>
      ) : (
        <div className="transactions-container">
          {sortedTransactions.map(transaction => (
            <div key={transaction._id} className="transaction-item">
              <div className="transaction-main">
                <div className="transaction-icon">
                  {getCategoryIcon(transaction.category)}
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
                        {getWalletIcon(transaction.wallet)} {transaction.wallet}
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