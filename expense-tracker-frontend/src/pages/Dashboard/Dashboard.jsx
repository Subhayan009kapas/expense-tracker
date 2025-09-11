// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getBudget, getTransactions } from '../../services/api';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import TransactionList from '../../components/TransactionList/TransactionList';
import BudgetCard from '../../components/BudgetCard/BudgetCard';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [budget, setBudget] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [filters, setFilters] = useState({
    month: new Date().toISOString().slice(0, 7)
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    transactionCount: 0,
    avgTransaction: 0
  });

  useEffect(() => {
    fetchData();
  }, [filters.month, refresh]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchBudget(),
        fetchTransactions()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudget = async () => {
    try {
      const response = await getBudget(filters.month);
      setBudget(response.data);
    } catch (error) {
      console.error('Error fetching budget:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions({ month: filters.month });
      setTransactions(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const calculateStats = (transactions) => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netBalance = totalIncome - totalExpense;
    const transactionCount = transactions.length;
    const avgTransaction = transactionCount > 0 ? (totalIncome + totalExpense) / transactionCount : 0;

    setStats({
      totalIncome,
      totalExpense,
      netBalance,
      transactionCount,
      avgTransaction
    });
  };

  const handleTransactionAdded = () => {
    setRefresh(prev => prev + 1);
  };

  const handleMonthChange = (e) => {
    setFilters({
      ...filters,
      month: e.target.value
    });
  };

  const getGreeting = () => {
    // Get current time in Indian Standard Time (IST)
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const hour = istTime.getHours();
    
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const getCategoryBreakdown = () => {
    const categories = {};
    transactions.forEach(transaction => {
      if (!categories[transaction.category]) {
        categories[transaction.category] = {
          expense: 0,
          income: 0,
          count: 0
        };
      }
      categories[transaction.category][transaction.type] += transaction.amount;
      categories[transaction.category].count += 1;
    });
    return categories;
  };

  const getTopCategories = (type, limit = 3) => {
    const categories = getCategoryBreakdown();
    return Object.entries(categories)
      .filter(([_, data]) => data[type] > 0)
      .map(([category, data]) => ({
        category,
        amount: data[type],
        count: data[type],
        percentage: ((data[type] / (type === 'income' ? stats.totalIncome : stats.totalExpense)) * 100).toFixed(1)
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  };

  const getRecentTransactions = () => {
    return transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4);
  };

  const getFinancialHealth = () => {
    if (!budget || !budget.limit) return 'neutral';
    const spentPercentage = (budget.spent / budget.limit) * 100;
    if (spentPercentage >= 100) return 'critical';
    if (spentPercentage >= 80) return 'warning';
    if (spentPercentage <= 50) return 'excellent';
    return 'good';
  };

  const getHealthMessage = () => {
    const health = getFinancialHealth();
    const messages = {
      excellent: "Excellent! You're well within your budget.",
      good: "Good job! You're managing your finances well.",
      warning: "Be careful! You're approaching your budget limit.",
      critical: "Alert! You've exceeded your budget this month.",
      neutral: "Set a budget to track your financial health."
    };
    return messages[health];
  };

  const getHealthColor = () => {
    const health = getFinancialHealth();
    const colors = {
      excellent: '#10b981',
      good: '#3b82f6',
      warning: '#f59e0b',
      critical: '#ef4444',
      neutral: '#6b7280'
    };
    return colors[health];
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your financial dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="greeting">
            <h1>{getGreeting()}, {currentUser?.name}!</h1>
            <p className="header-subtitle">
              Here's your financial overview for {new Date(filters.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="month-selector">
            <label htmlFor="month">Viewing:</label>
            <input
              type="month"
              id="month"
              value={filters.month}
              onChange={handleMonthChange}
              className="month-input"
            />
          </div>
        </div>
      </div>

      {/* Financial Health Banner */}
      {/* <div className="health-banner" style={{ borderLeftColor: getHealthColor() }}>
        <div className="health-content">
          <div className="health-icon" style={{ color: getHealthColor() }}>
            {getFinancialHealth() === 'excellent' && '🎉'}
            {getFinancialHealth() === 'good' && '👍'}
            {getFinancialHealth() === 'warning' && '⚠️'}
            {getFinancialHealth() === 'critical' && '🚨'}
            {getFinancialHealth() === 'neutral' && '📊'}
          </div>
          <div className="health-text">
            <h3>Financial Health</h3>
            <p>{getHealthMessage()}</p>
          </div>
        </div>
      </div> */}

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card income">
          <div className="metric-header">
            <div className="metric-icon"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-device-imac-dollar"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 17h-9a1 1 0 0 1 -1 -1v-12a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v6.5" /><path d="M3 13h11" /><path d="M8 21h5" /><path d="M10 17l-.5 4" /><path d="M21 15h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" /><path d="M19 21v1m0 -8v1" /></svg></div>
            <div className="metric-trend positive">↗</div>
          </div>
          <div className="metric-content">
            <h3>Total Income</h3>
            <div className="metric-value">${stats.totalIncome.toFixed(2)}</div>
            <div className="metric-subtitle">This month</div>
          </div>
        </div>

        <div className="metric-card expense">
          <div className="metric-header">
            <div className="metric-icon"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-device-mobile-dollar"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 21h-5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v5" /><path d="M11 4h2" /><path d="M12 17v.01" /><path d="M21 15h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" /><path d="M19 21v1m0 -8v1" /></svg></div>
            <div className="metric-trend negative">↘</div>
          </div>
          <div className="metric-content">
            <h3>Total Expenses</h3>
            <div className="metric-value">${stats.totalExpense.toFixed(2)}</div>
            <div className="metric-subtitle">This month</div>
          </div>
        </div>

        <div className="metric-card balance">
          <div className="metric-header">
            <div className="metric-icon"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-scale"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 20l10 0" /><path d="M6 6l6 -1l6 1" /><path d="M12 3l0 17" /><path d="M9 12l-3 -6l-3 6a3 3 0 0 0 6 0" /><path d="M21 12l-3 -6l-3 6a3 3 0 0 0 6 0" /></svg></div>
            <div className={`metric-trend ${stats.netBalance >= 0 ? 'positive' : 'negative'}`}>
              {stats.netBalance >= 0 ? '↗' : '↘'}
            </div>
          </div>
          <div className="metric-content">
            <h3>Net Balance</h3>
            <div className={`metric-value ${stats.netBalance >= 0 ? 'positive' : 'negative'}`}>
              ${stats.netBalance.toFixed(2)}
            </div>
            <div className="metric-subtitle">
              {stats.netBalance >= 0 ? 'Surplus' : 'Deficit'}
            </div>
          </div>
        </div>

        <div className="metric-card transactions">
          <div className="metric-header">
            <div className="metric-icon"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-chart-candle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 16v-5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v5" /><path d="M7 16v-11a1 1 0 0 1 1 -1h10a1 1 0 0 1 1 1v11" /><path d="M12 13v-11a1 1 0 0 0 -1 -1h-1a1 1 0 0 0 -1 1v11" /><path d="M17 16v-11a1 1 0 0 0 -1 -1h-1a1 1 0 0 0 -1 1v11" /><path d="M7 16v-11a1 1 0 0 1 1 -1h1a1 1 0 0 1 1 1v11" /><path d="M11 16v-11a1 1 0 0 1 1 -1h1a1 1 0 0 1 1 1v11" /></svg></div>
            <div className="metric-trend neutral">📈</div>
          </div>
          <div className="metric-content">
            <h3>Transactions</h3>
            <div className="metric-value">{stats.transactionCount}</div>
            <div className="metric-subtitle">Avg: ${stats.avgTransaction.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        <div className="left-column">
          {/* Quick Actions */}
          

          {/* Transaction Form */}
          <div className="transaction-form">
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
          </div>

          {/* Recent Transactions */}
          <div className="recent-transactions">
            <div className="section-header">
              <h3>Recent Transactions</h3>
              <button 
                className="view-all-btn" 
                onClick={() => window.location.href = '/reports'}
              >
                View All
              </button>
            </div>
            {getRecentTransactions().length > 0 ? (
              <div className="transactions-list">
                {getRecentTransactions().map(transaction => (
                  <div key={transaction._id} className="transaction-item">
                    <div className="transaction-icon">
                      {transaction.type === 'income' ? '💰' : '💸'}
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-category">{transaction.category}</div>
                      <div className="transaction-note">{transaction.note || 'No description'}</div>
                      <div className="transaction-date">
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-transactions">
                <div className="no-transactions-icon">📝</div>
                <p>No transactions yet this month</p>
                <button 
                  className="add-first-btn" 
                  onClick={() => document.querySelector('.transaction-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Add Your First Transaction
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="right-column">
          {/* Budget Card */}
          <div className="budget-card">
            <BudgetCard 
              budget={budget} 
              month={filters.month}
              onBudgetUpdate={fetchBudget}
            />
          </div>

          {/* Category Breakdown */}
          <div className="category-breakdown">
            <h3>Top Expense Categories</h3>
            {getTopCategories('expense').length > 0 ? (
              <div className="categories-list">
                {getTopCategories('expense').map((item, index) => (
                  <div key={item.category} className="category-item">
                    <div className="category-rank">#{index + 1}</div>
                    <div className="category-info">
                      <div className="category-name">{item.category}</div>
                      <div className="category-stats">
                        ${item.amount.toFixed(2)} • {item.percentage}%
                      </div>
                    </div>
                    <div className="category-bar">
                      <div 
                        className="category-fill"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-categories">
                <p>No expense data available</p>
              </div>
            )}
          </div>

          {/* Income Sources */}
          <div className="income-sources">
            <h3>Income Sources</h3>
            {getTopCategories('income').length > 0 ? (
              <div className="categories-list">
                {getTopCategories('income').map((item, index) => (
                  <div key={item.category} className="category-item income">
                    <div className="category-rank">#{index + 1}</div>
                    <div className="category-info">
                      <div className="category-name">{item.category}</div>
                      <div className="category-stats">
                        ${item.amount.toFixed(2)} • {item.percentage}%
                      </div>
                    </div>
                    <div className="category-bar">
                      <div 
                        className="category-fill income-fill"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-categories">
                <p>No income data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;