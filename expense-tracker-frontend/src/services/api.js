// src/services/api.js
import axios from 'axios';

const API = axios.create({ 
  baseURL: 'https://expense-tracker-n58n.onrender.com/api' // ✅ added /api
});

// Add token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Add response interceptor to handle errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('API Error: No response received', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ✅ Auth APIs
export const register = (userData) => API.post('/auth/register', userData);
export const login = (userData) => API.post('/auth/login', userData);

// ✅ Transaction APIs
export const addTransaction = (transactionData) => API.post('/transactions', transactionData);
export const getTransactions = (filters) => API.get('/transactions', { params: filters });
export const updateTransaction = (id, transactionData) => API.put(`/transactions/${id}`, transactionData);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

// ✅ Budget APIs
export const setBudget = (budgetData) => API.post('/budgets', budgetData);
export const getBudget = (month) => API.get(`/budgets/${month}`);

export default API;
