// backend/routes/transactionRoutes.js
const express = require('express');
const {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, addTransaction)   // Add transaction
  .get(protect, getTransactions);  // Get all transactions (with optional filters)

router.route('/:id')
  .put(protect, updateTransaction) // Update transaction
  .delete(protect, deleteTransaction); // Delete transaction

module.exports = router;