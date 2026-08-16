/**
 * Expense Routes
 *
 * Base Route: /api/expenses
 */

const express = require('express');
const router = express.Router();

const {
  getExpenses,
  getExpenseStats,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');

const validateExpense = require('../middleware/validateExpense');

// Dashboard statistics route (must be before /:id to avoid treating 'stats' as an ID)
router.get('/stats', getExpenseStats);

// Main collection routes: List all expenses and Create new expense
router
  .route('/')
  .get(getExpenses)
  .post(validateExpense, createExpense);

// Individual item routes: Get, Update, Delete
router
  .route('/:id')
  .get(getExpenseById)
  .put(validateExpense, updateExpense)
  .delete(deleteExpense);

module.exports = router;
