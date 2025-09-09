// src/components/TransactionForm/TransactionForm.jsx
import React, { useState } from 'react';
import { addTransaction } from '../../services/api';
import './TransactionForm.css';

const TransactionForm = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    wallet: 'Cash',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const categories = {
    expense: ['Food', 'Travel', 'Rent', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  };

  const wallets = ['Cash', 'Bank', 'UPI', 'Credit Card'];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      type,
      category: '' // Reset category when type changes
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setMessage('');
      
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      const response = await addTransaction(transactionData);
      
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        wallet: 'Cash',
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
      
      setMessage('Transaction added successfully!');
      setErrors({});
      
      if (onTransactionAdded) {
        onTransactionAdded(response.data);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to add transaction: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  return (
    <div className="transaction-form">
      <div className="form-header">
        <h3>Add New Transaction</h3>
        <div className="form-subtitle">Track your income and expenses</div>
      </div>
      
      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          <span className="message-icon">
            {message.includes('successfully') ? '✅' : '❌'}
          </span>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="form">
        {/* Transaction Type Toggle */}
        <div className="form-group">
          <label className="form-label">Transaction Type</label>
          <div className="type-toggle">
            <button
              type="button"
              className={`type-btn ${formData.type === 'income' ? 'active' : ''}`}
              onClick={() => handleTypeChange('income')}
            >
              <span className="type-icon">💰</span>
              Income
            </button>
            <button
              type="button"
              className={`type-btn ${formData.type === 'expense' ? 'active' : ''}`}
              onClick={() => handleTypeChange('expense')}
            >
              <span className="type-icon">💸</span>
              Expense
            </button>
          </div>
        </div>

        {/* Amount and Category Row */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount <span className="required">*</span>
            </label>
            <div className="input-group">
              <span className="input-prefix">$</span>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`form-input ${errors.amount ? 'error' : ''}`}
                required
              />
            </div>
            {errors.amount && <span className="error-text">{errors.amount}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-select ${errors.category ? 'error' : ''}`}
              required
            >
              <option value="">Select Category</option>
              {categories[formData.type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>
        </div>
        
        {/* Wallet and Date Row */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="wallet" className="form-label">Payment Method</label>
            <select
              id="wallet"
              name="wallet"
              value={formData.wallet}
              onChange={handleChange}
              className="form-select"
              required
            >
              {wallets.map(wallet => (
                <option key={wallet} value={wallet}>{wallet}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`form-input ${errors.date ? 'error' : ''}`}
              required
            />
            {errors.date && <span className="error-text">{errors.date}</span>}
          </div>
        </div>
        
        {/* Note */}
        <div className="form-group">
          <label htmlFor="note" className="form-label">Note (Optional)</label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Add a note for this transaction..."
            rows="3"
            className="form-textarea"
          />
        </div>
        
        {/* Submit Button */}
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Adding...
            </>
          ) : (
            <>
              <span className="submit-icon">➕</span>
              Add Transaction
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;