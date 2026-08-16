/**
 * Validation Middleware for Expense Payloads
 */

const { CATEGORIES } = require('../models/Expense');

const validateExpense = (req, res, next) => {
  const { title, amount, category, date, description } = req.body;
  const errors = [];

  // Validate Title
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Expense title is required and cannot be empty.');
  } else if (title.trim().length > 100) {
    errors.push('Expense title must be under 100 characters.');
  }

  // Validate Amount
  if (amount === undefined || amount === null || amount === '') {
    errors.push('Expense amount is required.');
  } else {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      errors.push('Expense amount must be a positive number greater than 0.');
    }
  }

  // Validate Category
  if (!category) {
    errors.push('Expense category is required.');
  } else if (!CATEGORIES.includes(category)) {
    errors.push(`Invalid category. Must be one of: ${CATEGORIES.join(', ')}.`);
  }

  // Validate Date if provided
  if (date) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      errors.push('Invalid date format.');
    }
  }

  // Validate Description if provided
  if (description && typeof description === 'string' && description.trim().length > 500) {
    errors.push('Description cannot exceed 500 characters.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = validateExpense;
