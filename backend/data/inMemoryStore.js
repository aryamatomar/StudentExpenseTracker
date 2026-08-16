/**
 * In-Memory Data Store for Expenses
 *
 * Provides full CRUD operations, filtering, search, sorting, and dashboard statistical calculations.
 * Behaves identically to a MongoDB collection so the frontend works seamlessly.
 */

const initialExpenses = require('./initialExpenses');

// Generate unique ID
const generateId = () => {
  return 'exp_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

// Internal mutable storage array
let expensesStore = JSON.parse(JSON.stringify(initialExpenses));

const inMemoryStore = {
  /**
   * Find all expenses with optional filters and sorting
   */
  findAll: ({ search, category, startDate, endDate, sortBy = 'date', order = 'desc' } = {}) => {
    let result = [...expensesStore];

    // Search by title or description
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        exp =>
          (exp.title && exp.title.toLowerCase().includes(q)) ||
          (exp.description && exp.description.toLowerCase().includes(q))
      );
    }

    // Filter by Category
    if (category && category !== 'All') {
      result = result.filter(exp => exp.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Start Date
    if (startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        result = result.filter(exp => new Date(exp.date) >= start);
      }
    }

    // Filter by End Date
    if (endDate) {
      const end = new Date(endDate);
      if (!isNaN(end.getTime())) {
        // Set end to end of that day
        end.setHours(23, 59, 59, 999);
        result = result.filter(exp => new Date(exp.date) <= end);
      }
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'date' || sortBy === 'createdAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (sortBy === 'amount') {
        valA = Number(valA);
        valB = Number(valB);
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (order === 'asc') {
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0;
      }
    });

    return result;
  },

  /**
   * Find single expense by ID
   */
  findById: (id) => {
    return expensesStore.find(exp => exp._id === id || exp.id === id) || null;
  },

  /**
   * Create a new expense
   */
  create: (data) => {
    const now = new Date().toISOString();
    const newExpense = {
      _id: generateId(),
      title: data.title.trim(),
      amount: parseFloat(Number(data.amount).toFixed(2)),
      category: data.category,
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      description: data.description ? data.description.trim() : '',
      createdAt: now,
      updatedAt: now
    };

    // Prepend to list
    expensesStore.unshift(newExpense);
    return newExpense;
  },

  /**
   * Update an existing expense by ID
   */
  update: (id, updateData) => {
    const index = expensesStore.findIndex(exp => exp._id === id || exp.id === id);
    if (index === -1) return null;

    const existing = expensesStore[index];
    const updated = {
      ...existing,
      ...(updateData.title !== undefined && { title: updateData.title.trim() }),
      ...(updateData.amount !== undefined && { amount: parseFloat(Number(updateData.amount).toFixed(2)) }),
      ...(updateData.category !== undefined && { category: updateData.category }),
      ...(updateData.date !== undefined && {
        date: new Date(updateData.date).toISOString().split('T')[0]
      }),
      ...(updateData.description !== undefined && { description: updateData.description.trim() }),
      updatedAt: new Date().toISOString()
    };

    expensesStore[index] = updated;
    return updated;
  },

  /**
   * Delete an expense by ID
   */
  delete: (id) => {
    const index = expensesStore.findIndex(exp => exp._id === id || exp.id === id);
    if (index === -1) return null;

    const deleted = expensesStore.splice(index, 1);
    return deleted[0];
  },

  /**
   * Calculate comprehensive statistics for Dashboard & Analytics
   */
  getStats: () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    let totalAmount = 0;
    let thisMonthAmount = 0;
    let highestExpense = null;
    const categoryTotals = {
      Food: 0,
      Transport: 0,
      Education: 0,
      Shopping: 0,
      Entertainment: 0,
      Other: 0
    };

    // Monthly trend tracking (past 6 months)
    const monthlyMap = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyMap[key] = { month: key, amount: 0, count: 0 };
    }

    expensesStore.forEach(exp => {
      const amt = Number(exp.amount) || 0;
      totalAmount += amt;

      // Track highest expense
      if (!highestExpense || amt > highestExpense.amount) {
        highestExpense = exp;
      }

      // Track category totals
      if (categoryTotals[exp.category] !== undefined) {
        categoryTotals[exp.category] += amt;
      } else {
        categoryTotals['Other'] += amt;
      }

      // Check if expense is in current month
      const expDate = new Date(exp.date);
      if (
        !isNaN(expDate.getTime()) &&
        expDate.getFullYear() === currentYear &&
        expDate.getMonth() === currentMonth
      ) {
        thisMonthAmount += amt;
      }

      // Add to monthly trends if within range
      const expMonthKey = expDate.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (monthlyMap[expMonthKey]) {
        monthlyMap[expMonthKey].amount += amt;
        monthlyMap[expMonthKey].count += 1;
      }
    });

    // Format category breakdown with percentages
    const categoryBreakdown = Object.keys(categoryTotals).map(cat => {
      const catAmount = parseFloat(categoryTotals[cat].toFixed(2));
      const percentage = totalAmount > 0 ? parseFloat(((catAmount / totalAmount) * 100).toFixed(1)) : 0;
      return {
        category: cat,
        amount: catAmount,
        percentage
      };
    });

    // Sort category breakdown by amount descending
    categoryBreakdown.sort((a, b) => b.amount - a.amount);

    return {
      totalExpenses: parseFloat(totalAmount.toFixed(2)),
      totalCount: expensesStore.length,
      thisMonthSpending: parseFloat(thisMonthAmount.toFixed(2)),
      highestExpense: highestExpense
        ? {
            ...highestExpense,
            amount: parseFloat(highestExpense.amount.toFixed(2))
          }
        : null,
      averageExpense:
        expensesStore.length > 0 ? parseFloat((totalAmount / expensesStore.length).toFixed(2)) : 0,
      categoryBreakdown,
      monthlyTrends: Object.values(monthlyMap)
    };
  },

  /**
   * Reset store to initial seed data (useful for testing)
   */
  reset: () => {
    expensesStore = JSON.parse(JSON.stringify(initialExpenses));
    return expensesStore;
  }
};

module.exports = inMemoryStore;
