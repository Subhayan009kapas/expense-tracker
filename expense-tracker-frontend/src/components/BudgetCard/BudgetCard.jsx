// src/components/BudgetCard/BudgetCard.jsx
import React, { useState } from 'react';
import { setBudget } from '../../services/api';
import './BudgetCard.css';

const BudgetCard = ({ budget, month, onBudgetUpdate }) => {
  const [budgetAmount, setBudgetAmount] = useState(budget?.limit || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSetBudget = async (e) => {
    e.preventDefault();
    
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
      setMessage('Please enter a valid budget amount');
      return;
    }
    
    try {
      setLoading(true);
      setMessage('');
      
      await setBudget({
        month,
        limit: parseFloat(budgetAmount)
      });
      
      setMessage('Budget updated successfully!');
      setIsEditing(false);
      
      if (onBudgetUpdate) {
        onBudgetUpdate();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update budget: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  const getProgressPercentage = () => {
    if (!budget || !budget.limit || budget.limit === 0) return 0;
    return Math.min(100, (budget.spent / budget.limit) * 100);
  };

  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 100) return '#ef4444';
    if (percentage >= 80) return '#f59e0b';
    if (percentage >= 60) return '#3b82f6';
    return '#10b981';
  };

  const getProgressStatus = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 100) return 'Exceeded';
    if (percentage >= 80) return 'Warning';
    if (percentage >= 60) return 'Good';
    return 'Excellent';
  };

  const getRemainingAmount = () => {
    if (!budget || !budget.limit) return 0;
    return budget.limit - budget.spent;
  };

  const formatMonth = (monthString) => {
    const date = new Date(monthString + '-01');
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="budget-card">
      <div className="budget-header">
        <h3>Monthly Budget</h3>
        <div className="budget-month">{formatMonth(month)}</div>
      </div>
      
      {message && (
        <div className={`budget-message ${message.includes('successfully') ? 'success' : 'error'}`}>
          <span className="message-icon">
            {message.includes('successfully') ? '✅' : '❌'}
          </span>
          {message}
        </div>
      )}
      
      {!budget || !budget.limit ? (
        <div className="budget-setup">
          <div className="setup-icon">🎯</div>
          <p>You haven't set a budget for {formatMonth(month)} yet.</p>
          <form onSubmit={handleSetBudget} className="budget-form">
            <div className="form-group">
              <label htmlFor="budgetAmount">Monthly Budget Amount</label>
              <div className="input-group">
                <span className="input-prefix">$</span>
                <input
                  type="number"
                  id="budgetAmount"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  className="budget-input"
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="set-budget-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Setting...
                </>
              ) : (
                <>
                  <span className="button-icon">🎯</span>
                  Set Budget
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="budget-display">
          {/* Budget Overview */}
          <div className="budget-overview">
            <div className="budget-numbers">
              <div className="budget-item">
                <div className="budget-label">
                  <span className="label-icon">💰</span>
                  Budget
                </div>
                <div className="budget-value">${budget.limit.toFixed(2)}</div>
              </div>
              <div className="budget-item">
                <div className="budget-label">
                  <span className="label-icon">💸</span>
                  Spent
                </div>
                <div className="budget-value spent">${budget.spent.toFixed(2)}</div>
              </div>
              <div className="budget-item">
                <div className="budget-label">
                  <span className="label-icon">⚖️</span>
                  Remaining
                </div>
                <div className={`budget-value ${getRemainingAmount() >= 0 ? 'positive' : 'negative'}`}>
                  ${getRemainingAmount().toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Section */}
          <div className="budget-progress">
            <div className="progress-header">
              <span className="progress-label">Budget Usage</span>
              <span className="progress-percentage">{getProgressPercentage().toFixed(0)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: getProgressColor()
                }}
              ></div>
            </div>
            <div className="progress-status">
              <span className={`status-badge ${getProgressStatus().toLowerCase()}`}>
                {getProgressStatus()}
              </span>
            </div>
          </div>
          
          {/* Budget Actions */}
          <div className="budget-actions">
            {!isEditing ? (
              <button 
                className="edit-budget-button"
                onClick={() => setIsEditing(true)}
              >
                <span className="button-icon">✏️</span>
                Edit Budget
              </button>
            ) : (
              <form onSubmit={handleSetBudget} className="edit-form">
                <div className="form-group">
                  <label htmlFor="editBudgetAmount">New Budget Amount</label>
                  <div className="input-group">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      id="editBudgetAmount"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                      className="budget-input"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button 
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setIsEditing(false);
                      setBudgetAmount(budget?.limit || '');
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="update-budget-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <span className="button-icon">💾</span>
                        Update
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          {/* Budget Alerts */}
          {budget.spent >= budget.limit ? (
            <div className="budget-alert critical">
              <span className="alert-icon">🚨</span>
              <div className="alert-content">
                <div className="alert-title">Budget Exceeded!</div>
                <div className="alert-message">You've spent ${(budget.spent - budget.limit).toFixed(2)} over your budget this month.</div>
              </div>
            </div>
          ) : budget.spent >= budget.limit * 0.8 ? (
            <div className="budget-alert warning">
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">
                <div className="alert-title">Budget Warning</div>
                <div className="alert-message">You've used 80% of your budget. Consider reducing spending.</div>
              </div>
            </div>
          ) : budget.spent >= budget.limit * 0.6 ? (
            <div className="budget-alert info">
              <span className="alert-icon">ℹ️</span>
              <div className="alert-content">
                <div className="alert-title">Good Progress</div>
                <div className="alert-message">You're managing your budget well. Keep it up!</div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default BudgetCard;