/**
 * In-Memory Data Store for Expenses and Student Profile (in Indian Rupees INR ₹)
 *
 * Provides full CRUD operations, filtering, search, sorting, dashboard statistical calculations,
 * and profile management.
 * Behaves identically to MongoDB collections so the app works seamlessly both with and without MongoDB Atlas.
 */

const initialExpenses = require('./initialExpenses');

// Generate unique Expense ID
const generateId = () => {
  return 'exp_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

// Generate unique Student ID: STU-YYYY-XXXX
const generateStudentId = () => {
  const year = new Date().getFullYear();
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  return `STU-${year}-${randomCode}`;
};

// Default initial student profile (can be customized/overwritten)
const defaultProfile = {
  _id: 'prof_001',
  studentId: 'STU-2026-0001',
  name: 'Aryama Singh',
  email: 'aryama.singh@university.edu.in',
  phone: '+91 98765 43210',
  college: 'National Institute of Technology',
  course: 'B.Tech Computer Science & Engineering',
  semester: '6th Semester (Year 3)',
  monthlyBudget: 15000,
  profilePicture: '',
  currency: 'INR',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Internal mutable storage arrays
let expensesStore = JSON.parse(JSON.stringify(initialExpenses));
let activeProfileStore = JSON.parse(JSON.stringify(defaultProfile));

const inMemoryStore = {
  // ==========================================
  // PROFILE OPERATIONS
  // ==========================================

  /**
   * Get current active profile (or by studentId)
   */
  getProfile: (studentId) => {
    if (!activeProfileStore) return null;
    if (studentId && activeProfileStore.studentId !== studentId) {
      return null;
    }
    return activeProfileStore;
  },

  /**
   * Create a new student profile
   */
  createProfile: (data) => {
    const studentId = data.studentId || generateStudentId();
    const now = new Date().toISOString();

    activeProfileStore = {
      _id: 'prof_' + Date.now().toString(36),
      studentId: studentId.toUpperCase(),
      name: (data.name || '').trim(),
      email: (data.email || '').trim().toLowerCase(),
      phone: (data.phone || '').trim(),
      college: (data.college || '').trim(),
      course: (data.course || '').trim(),
      semester: (data.semester || 'Semester 1').trim(),
      monthlyBudget: data.monthlyBudget !== undefined ? Math.max(0, Number(data.monthlyBudget)) : 15000,
      profilePicture: data.profilePicture || '',
      currency: data.currency || 'INR',
      createdAt: now,
      updatedAt: now
    };

    return activeProfileStore;
  },

  /**
   * Update existing profile
   */
  updateProfile: (studentId, updateData) => {
    if (!activeProfileStore) return null;
    if (studentId && activeProfileStore.studentId !== studentId) {
      return null;
    }

    activeProfileStore = {
      ...activeProfileStore,
      ...(updateData.name !== undefined && { name: updateData.name.trim() }),
      ...(updateData.email !== undefined && { email: updateData.email.trim().toLowerCase() }),
      ...(updateData.phone !== undefined && { phone: updateData.phone.trim() }),
      ...(updateData.college !== undefined && { college: updateData.college.trim() }),
      ...(updateData.course !== undefined && { course: updateData.course.trim() }),
      ...(updateData.semester !== undefined && { semester: updateData.semester.trim() }),
      ...(updateData.monthlyBudget !== undefined && {
        monthlyBudget: Math.max(0, Number(updateData.monthlyBudget))
      }),
      ...(updateData.profilePicture !== undefined && { profilePicture: updateData.profilePicture }),
      ...(updateData.currency !== undefined && { currency: updateData.currency }),
      updatedAt: new Date().toISOString()
    };

    return activeProfileStore;
  },

  /**
   * Delete profile
   */
  deleteProfile: (studentId) => {
    if (!activeProfileStore) return null;
    if (studentId && activeProfileStore.studentId !== studentId) {
      return null;
    }
    const deleted = { ...activeProfileStore };
    activeProfileStore = null;
    return deleted;
  },

  // ==========================================
  // EXPENSE OPERATIONS
  // ==========================================

  /**
   * Find all expenses with optional filters and sorting
   */
  findAll: ({ search, category, startDate, endDate, studentId, sortBy = 'date', order = 'desc' } = {}) => {
    let result = [...expensesStore];

    // Filter by studentId if provided
    if (studentId) {
      result = result.filter(exp => !exp.studentId || exp.studentId === studentId);
    }

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
      studentId: data.studentId || (activeProfileStore ? activeProfileStore.studentId : null),
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
      ...(updateData.studentId !== undefined && { studentId: updateData.studentId }),
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
  getStats: (studentId) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    const todayStr = now.toISOString().split('T')[0];

    let targetExpenses = expensesStore;
    if (studentId) {
      targetExpenses = expensesStore.filter(exp => !exp.studentId || exp.studentId === studentId);
    }

    let totalAmount = 0;
    let thisMonthAmount = 0;
    let todayAmount = 0;
    let highestExpense = null;
    const categoryTotals = {
      Food: 0,
      Transport: 0,
      Education: 0,
      Shopping: 0,
      Entertainment: 0,
      Bills: 0,
      Health: 0,
      Other: 0
    };

    // Monthly trend tracking (past 6 months)
    const monthlyMap = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyMap[key] = { month: key, amount: 0, count: 0 };
    }

    targetExpenses.forEach(exp => {
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

      // Check date
      const expDate = new Date(exp.date);
      if (!isNaN(expDate.getTime())) {
        const expDateStr = expDate.toISOString().split('T')[0];
        if (expDateStr === todayStr) {
          todayAmount += amt;
        }

        if (expDate.getFullYear() === currentYear && expDate.getMonth() === currentMonth) {
          thisMonthAmount += amt;
        }

        const expMonthKey = expDate.toLocaleString('default', { month: 'short', year: '2-digit' });
        if (monthlyMap[expMonthKey]) {
          monthlyMap[expMonthKey].amount += amt;
          monthlyMap[expMonthKey].count += 1;
        }
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
      totalCount: targetExpenses.length,
      thisMonthSpending: parseFloat(thisMonthAmount.toFixed(2)),
      todaySpending: parseFloat(todayAmount.toFixed(2)),
      highestExpense: highestExpense
        ? {
            ...highestExpense,
            amount: parseFloat(highestExpense.amount.toFixed(2))
          }
        : null,
      averageExpense:
        targetExpenses.length > 0 ? parseFloat((totalAmount / targetExpenses.length).toFixed(2)) : 0,
      categoryBreakdown,
      monthlyTrends: Object.values(monthlyMap)
    };
  },

  /**
   * Reset store to initial seed data (useful for testing)
   */
  reset: () => {
    expensesStore = JSON.parse(JSON.stringify(initialExpenses));
    activeProfileStore = JSON.parse(JSON.stringify(defaultProfile));
    return { expenses: expensesStore, profile: activeProfileStore };
  }
};

module.exports = inMemoryStore;
