/**
 * Global Expense Context Provider
 *
 * Centralizes state management for expenses, dashboard analytics,
 * active filters, CRUD operations, modals, and toast notifications.
 */

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { expenseService } from '../services/api';

export const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  // Main Data States
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalCount: 0,
    thisMonthSpending: 0,
    highestExpense: null,
    averageExpense: 0,
    categoryBreakdown: [],
    monthlyTrends: []
  });

  // UI / Async States
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search States
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    datePreset: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    order: 'desc'
  });

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState(null);

  // Student Monthly Budget Goal State (Saved in localStorage for user convenience)
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const saved = localStorage.getItem('student_monthly_budget');
    return saved ? Number(saved) : 500;
  });

  // Toast Notification Queue
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateMonthlyBudget = (newLimit) => {
    const val = Math.max(0, Number(newLimit) || 0);
    setMonthlyBudget(val);
    localStorage.setItem('student_monthly_budget', val.toString());
    addToast(`Monthly budget set to $${val.toFixed(2)}`, 'info');
  };

  /**
   * Fetch Dashboard Stats
   */
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await expenseService.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  /**
   * Fetch Expenses with Current Filters
   */
  const fetchExpenses = useCallback(async (customParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = {
        sortBy: filters.sortBy,
        order: filters.order,
        ...customParams
      };

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      if (filters.category && filters.category !== 'All') {
        params.category = filters.category;
      }

      if (filters.startDate) {
        params.startDate = filters.startDate;
      }

      if (filters.endDate) {
        params.endDate = filters.endDate;
      }

      const res = await expenseService.getAll(params);
      if (res.success && res.data) {
        setExpenses(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
      setError(err.message || 'Failed to load expenses from server.');
      addToast('Could not load expenses. Please ensure backend is running.', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, addToast]);

  // Initial fetch on mount & whenever filters change
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Fetch stats on initial mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  /**
   * Handle Adding a New Expense
   */
  const addExpense = async (expenseData) => {
    try {
      const res = await expenseService.create(expenseData);
      if (res.success) {
        // Refresh both list and dashboard stats
        await Promise.all([fetchExpenses(), fetchStats()]);
        addToast('Expense added successfully! 🎉', 'success');
        setIsFormModalOpen(false);
        return { success: true, data: res.data };
      }
    } catch (err) {
      const msg = err.message || 'Failed to add expense';
      addToast(msg, 'error');
      return { success: false, error: err };
    }
  };

  /**
   * Handle Updating an Existing Expense
   */
  const updateExpense = async (id, expenseData) => {
    try {
      const res = await expenseService.update(id, expenseData);
      if (res.success) {
        await Promise.all([fetchExpenses(), fetchStats()]);
        addToast('Expense updated successfully! ✨', 'success');
        setIsFormModalOpen(false);
        setEditingExpense(null);
        return { success: true, data: res.data };
      }
    } catch (err) {
      const msg = err.message || 'Failed to update expense';
      addToast(msg, 'error');
      return { success: false, error: err };
    }
  };

  /**
   * Handle Deleting an Expense
   */
  const deleteExpense = async (id) => {
    try {
      const res = await expenseService.delete(id);
      if (res.success) {
        await Promise.all([fetchExpenses(), fetchStats()]);
        addToast('Expense deleted successfully.', 'info');
        setIsDeleteModalOpen(false);
        setDeletingExpense(null);
        return { success: true };
      }
    } catch (err) {
      const msg = err.message || 'Failed to delete expense';
      addToast(msg, 'error');
      return { success: false, error: err };
    }
  };

  /**
   * Quick open modal helpers
   */
  const openAddModal = () => {
    setEditingExpense(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (expense) => {
    setDeletingExpense(expense);
    setIsDeleteModalOpen(true);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      datePreset: 'all',
      startDate: '',
      endDate: '',
      sortBy: 'date',
      order: 'desc'
    });
  };

  const value = useMemo(
    () => ({
      expenses,
      stats,
      loading,
      statsLoading,
      error,
      filters,
      setFilters,
      resetFilters,
      fetchExpenses,
      fetchStats,
      addExpense,
      updateExpense,
      deleteExpense,
      isFormModalOpen,
      setIsFormModalOpen,
      editingExpense,
      setEditingExpense,
      isDeleteModalOpen,
      setIsDeleteModalOpen,
      deletingExpense,
      setDeletingExpense,
      openAddModal,
      openEditModal,
      openDeleteModal,
      monthlyBudget,
      updateMonthlyBudget,
      toasts,
      addToast,
      removeToast
    }),
    [
      expenses,
      stats,
      loading,
      statsLoading,
      error,
      filters,
      fetchExpenses,
      fetchStats,
      isFormModalOpen,
      editingExpense,
      isDeleteModalOpen,
      deletingExpense,
      monthlyBudget,
      toasts,
      addToast,
      removeToast
    ]
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};
