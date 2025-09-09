// src/pages/Reports/Reports.jsx
import React, { useState, useEffect } from 'react';
import { getTransactions } from '../../services/api';
import './Reports.css';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    type: 'all'
  });
  const [chartData, setChartData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactions(filters);
      setTransactions(response.data);
      processChartData(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
    setLoading(false);
  };

  const processChartData = (transactions) => {
    const categoryData = {};
    const dailyData = {};
    
    transactions.forEach(transaction => {
      // Category data
      if (!categoryData[transaction.category]) {
        categoryData[transaction.category] = {
          expense: 0,
          income: 0
        };
      }
      
      if (transaction.type === 'expense') {
        categoryData[transaction.category].expense += transaction.amount;
      } else {
        categoryData[transaction.category].income += transaction.amount;
      }
      
      // Daily data
      const date = new Date(transaction.date).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          expense: 0,
          income: 0
        };
      }
      
      if (transaction.type === 'expense') {
        dailyData[date].expense += transaction.amount;
      } else {
        dailyData[date].income += transaction.amount;
      }
    });
    
    setChartData({
      categories: categoryData,
      daily: dailyData
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    const today = new Date();
    let startDate, endDate;

    switch (period) {
      case 'week':
        startDate = new Date(today.setDate(today.getDate() - 7));
        endDate = new Date();
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date();
        break;
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        startDate = new Date(today.getFullYear(), quarter * 3, 1);
        endDate = new Date();
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date();
        break;
      default:
        return;
    }

    setFilters({
      ...filters,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  };

  const getTotal = (type) => {
    return transactions
      .filter(t => type === 'all' || t.type === type)
      .reduce((sum, t) => sum + t.amount, 0)
      .toFixed(2);
  };

  const getNetBalance = () => {
    const totalIncome = parseFloat(getTotal('income'));
    const totalExpense = parseFloat(getTotal('expense'));
    return (totalIncome - totalExpense).toFixed(2);
  };

  const getCategoryWiseTotal = (type) => {
    const result = [];
    for (const category in chartData.categories) {
      const amount = chartData.categories[category][type];
      if (amount > 0) {
        result.push({ 
          category, 
          amount,
          percentage: ((amount / parseFloat(getTotal(type))) * 100).toFixed(1)
        });
      }
    }
    return result.sort((a, b) => b.amount - a.amount);
  };

  const getTopCategories = (type, limit = 5) => {
    return getCategoryWiseTotal(type).slice(0, limit);
  };

  const getFinancialInsights = () => {
    const totalIncome = parseFloat(getTotal('income'));
    const totalExpense = parseFloat(getTotal('expense'));
    const netBalance = parseFloat(getNetBalance());
    const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;
    
    return {
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate,
      avgTransactionSize: transactions.length > 0 ? (totalIncome + totalExpense) / transactions.length : 0,
      mostExpensiveCategory: getTopCategories('expense')[0]?.category || 'N/A',
      mostProfitableCategory: getTopCategories('income')[0]?.category || 'N/A'
    };
  };

  const insights = getFinancialInsights();

  if (loading) {
    return (
      <div className="reports-loading">
        <div className="loading-spinner"></div>
        <p>Generating your financial report...</p>
      </div>
    );
  }

  return (
    <div className="reports">
      {/* Header Section */}
      <div className="reports-header">
        <div className="header-content">
          <h1>Financial Analytics</h1>
          <p className="header-subtitle">Comprehensive insights into your financial health</p>
        </div>
        <div className="header-actions">
          <div className="period-selector">
            <button 
              className={selectedPeriod === 'week' ? 'active' : ''} 
              onClick={() => handlePeriodChange('week')}
            >
              Week
            </button>
            <button 
              className={selectedPeriod === 'month' ? 'active' : ''} 
              onClick={() => handlePeriodChange('month')}
            >
              Month
            </button>
            <button 
              className={selectedPeriod === 'quarter' ? 'active' : ''} 
              onClick={() => handlePeriodChange('quarter')}
            >
              Quarter
            </button>
            <button 
              className={selectedPeriod === 'year' ? 'active' : ''} 
              onClick={() => handlePeriodChange('year')}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="startDate">From Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="endDate">To Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="type">Transaction Type</label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card income">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Total Income</h3>
            <div className="metric-value">${getTotal('income')}</div>
            <div className="metric-subtitle">This period</div>
          </div>
        </div>
        
        <div className="metric-card expense">
          <div className="metric-icon">💸</div>
          <div className="metric-content">
            <h3>Total Expenses</h3>
            <div className="metric-value">${getTotal('expense')}</div>
            <div className="metric-subtitle">This period</div>
          </div>
        </div>
        
        <div className="metric-card balance">
          <div className="metric-icon">⚖️</div>
          <div className="metric-content">
            <h3>Net Balance</h3>
            <div className={`metric-value ${parseFloat(getNetBalance()) >= 0 ? 'positive' : 'negative'}`}>
              ${getNetBalance()}
            </div>
            <div className="metric-subtitle">
              {parseFloat(getNetBalance()) >= 0 ? 'Surplus' : 'Deficit'}
            </div>
          </div>
        </div>
        
        <div className="metric-card savings">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>Savings Rate</h3>
            <div className="metric-value">{insights.savingsRate}%</div>
            <div className="metric-subtitle">Of total income</div>
          </div>
        </div>
      </div>

      {/* Financial Insights */}
      <div className="insights-section">
        <h2>Financial Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Average Transaction</h4>
            <div className="insight-value">${insights.avgTransactionSize.toFixed(2)}</div>
          </div>
          <div className="insight-card">
            <h4>Top Expense Category</h4>
            <div className="insight-value">{insights.mostExpensiveCategory}</div>
          </div>
          <div className="insight-card">
            <h4>Top Income Source</h4>
            <div className="insight-value">{insights.mostProfitableCategory}</div>
          </div>
          <div className="insight-card">
            <h4>Total Transactions</h4>
            <div className="insight-value">{transactions.length}</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Expense Breakdown</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <div className="legend-color expense"></div>
                Expenses
              </span>
            </div>
          </div>
          {getTopCategories('expense').length > 0 ? (
            <div className="category-chart">
              {getTopCategories('expense').map((item, index) => (
                <div key={item.category} className="category-item">
                  <div className="category-info">
                    <div className="category-name">
                      <span className="category-rank">#{index + 1}</span>
                      {item.category}
                    </div>
                    <div className="category-amount">
                      ${item.amount.toFixed(2)}
                      <span className="category-percentage">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-fill"
                      style={{
                        width: `${item.percentage}%`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    ></div>
                  </div>
                  <div className="category-meta">
                    {item.count} transaction{item.count !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <div className="no-data-icon">📊</div>
              <p>No expense data available</p>
            </div>
          )}
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Income Sources</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <div className="legend-color income"></div>
                Income
              </span>
            </div>
          </div>
          {getTopCategories('income').length > 0 ? (
            <div className="category-chart">
              {getTopCategories('income').map((item, index) => (
                <div key={item.category} className="category-item">
                  <div className="category-info">
                    <div className="category-name">
                      <span className="category-rank">#{index + 1}</span>
                      {item.category}
                    </div>
                    <div className="category-amount">
                      ${item.amount.toFixed(2)}
                      <span className="category-percentage">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-fill income-fill"
                      style={{
                        width: `${item.percentage}%`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    ></div>
                  </div>
                  <div className="category-meta">
                    {item.count} transaction{item.count !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <div className="no-data-icon">💰</div>
              <p>No income data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Details Table */}
      <div className="transactions-section">
        <div className="section-header">
          <h3>Transaction Details</h3>
          <div className="transaction-count">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </div>
        </div>
        {transactions.length > 0 ? (
          <div className="table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction._id} className="transaction-row">
                    <td className="transaction-date">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="transaction-category">
                      <span className="category-badge">{transaction.category}</span>
                    </td>
                    <td className="transaction-description">
                      {transaction.note || '-'}
                    </td>
                    <td className="transaction-type">
                      <span className={`type-badge ${transaction.type}`}>
                        {transaction.type === 'income' ? '↗' : '↘'} {transaction.type}
                      </span>
                    </td>
                    <td className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <div className="no-data-icon">📋</div>
            <p>No transactions found for the selected period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;