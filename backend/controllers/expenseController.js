/**
 * Expense Controller
 *
 * Handles all REST API requests for student expenses.
 * Seamlessly routes to MongoDB (via Mongoose) when connected,
 * or the active In-Memory Store when running without MongoDB.
 */

const mongoose = require('mongoose');
const { Expense } = require('../models/Expense');
const inMemoryStore = require('../data/inMemoryStore');

// Helper to determine if active MongoDB connection is present
const isMongoConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

/**
 * @desc   Get all expenses (with search, category filter, date filtering, and sorting)
 * @route  GET /api/expenses
 * @access Public
 */
const getExpenses = async (req, res, next) => {
  try {
    const { search, category, startDate, endDate, sortBy = 'date', order = 'desc' } = req.query;

    if (isMongoConnected()) {
      // MongoDB / Mongoose Query
      const query = {};

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ title: regex }, { description: regex }];
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          query.date.$lte = end;
        }
      }

      const sortOptions = {};
      sortOptions[sortBy] = order === 'asc' ? 1 : -1;

      const expenses = await Expense.find(query).sort(sortOptions);
      return res.status(200).json({
        success: true,
        count: expenses.length,
        data: expenses
      });
    } else {
      // In-Memory Query
      const expenses = inMemoryStore.findAll({
        search,
        category,
        startDate,
        endDate,
        sortBy,
        order
      });

      return res.status(200).json({
        success: true,
        count: expenses.length,
        data: expenses
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get dashboard calculations & statistics
 * @route  GET /api/expenses/stats
 * @access Public
 */
const getExpenseStats = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      const expenses = await Expense.find();
      // Use in-memory calculation logic on fetched documents
      const tempStore = require('../data/inMemoryStore');
      // For MongoDB, we can compute stats using aggregation or helper
      const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalCount = expenses.length;
      
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      let thisMonthAmount = 0;
      let highestExpense = null;
      const categoryTotals = { Food: 0, Transport: 0, Education: 0, Shopping: 0, Entertainment: 0, Other: 0 };

      // Monthly trend tracking (past 6 months)
      const monthlyMap = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(currentYear, currentMonth - i, 1);
        const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
        monthlyMap[key] = { month: key, amount: 0, count: 0 };
      }

      expenses.forEach(exp => {
        const amt = exp.amount || 0;
        if (!highestExpense || amt > highestExpense.amount) {
          highestExpense = exp;
        }
        if (categoryTotals[exp.category] !== undefined) {
          categoryTotals[exp.category] += amt;
        } else {
          categoryTotals['Other'] += amt;
        }
        const expDate = new Date(exp.date);
        if (expDate.getFullYear() === currentYear && expDate.getMonth() === currentMonth) {
          thisMonthAmount += amt;
        }
        const expMonthKey = expDate.toLocaleString('default', { month: 'short', year: '2-digit' });
        if (monthlyMap[expMonthKey]) {
          monthlyMap[expMonthKey].amount += amt;
          monthlyMap[expMonthKey].count += 1;
        }
      });

      const categoryBreakdown = Object.keys(categoryTotals).map(cat => ({
        category: cat,
        amount: parseFloat(categoryTotals[cat].toFixed(2)),
        percentage: totalAmount > 0 ? parseFloat(((categoryTotals[cat] / totalAmount) * 100).toFixed(1)) : 0
      })).sort((a, b) => b.amount - a.amount);

      return res.status(200).json({
        success: true,
        data: {
          totalExpenses: parseFloat(totalAmount.toFixed(2)),
          totalCount,
          thisMonthSpending: parseFloat(thisMonthAmount.toFixed(2)),
          highestExpense,
          averageExpense: totalCount > 0 ? parseFloat((totalAmount / totalCount).toFixed(2)) : 0,
          categoryBreakdown,
          monthlyTrends: Object.values(monthlyMap)
        }
      });
    } else {
      const stats = inMemoryStore.getStats();
      return res.status(200).json({
        success: true,
        data: stats
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single expense by ID
 * @route  GET /api/expenses/:id
 * @access Public
 */
const getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const expense = await Expense.findById(id);
      if (!expense) {
        return res.status(404).json({
          success: false,
          message: `Expense not found with ID of ${id}`
        });
      }
      return res.status(200).json({
        success: true,
        data: expense
      });
    } else {
      const expense = inMemoryStore.findById(id);
      if (!expense) {
        return res.status(404).json({
          success: false,
          message: `Expense not found with ID of ${id}`
        });
      }
      return res.status(200).json({
        success: true,
        data: expense
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create new expense
 * @route  POST /api/expenses
 * @access Public
 */
const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, description } = req.body;

    if (isMongoConnected()) {
      const newExpense = await Expense.create({
        title,
        amount,
        category,
        date: date || Date.now(),
        description
      });
      return res.status(201).json({
        success: true,
        message: 'Expense created successfully',
        data: newExpense
      });
    } else {
      const newExpense = inMemoryStore.create({
        title,
        amount,
        category,
        date,
        description
      });
      return res.status(201).json({
        success: true,
        message: 'Expense created successfully',
        data: newExpense
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update an existing expense
 * @route  PUT /api/expenses/:id
 * @access Public
 */
const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date, description } = req.body;

    if (isMongoConnected()) {
      const updated = await Expense.findByIdAndUpdate(
        id,
        { title, amount, category, date, description },
        { new: true, runValidators: true }
      );
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: `Expense not found with ID of ${id}`
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Expense updated successfully',
        data: updated
      });
    } else {
      const updated = inMemoryStore.update(id, {
        title,
        amount,
        category,
        date,
        description
      });
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: `Expense not found with ID of ${id}`
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Expense updated successfully',
        data: updated
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete an expense
 * @route  DELETE /api/expenses/:id
 * @access Public
 */
const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const deleted = await Expense.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Expense not found with ID of ${id}`
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Expense deleted successfully',
        data: deleted
      });
    } else {
      const deleted = inMemoryStore.delete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Expense not found with ID of ${id}`
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Expense deleted successfully',
        data: deleted
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenses,
  getExpenseStats,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};
