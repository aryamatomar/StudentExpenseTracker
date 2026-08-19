/**
 * Global Expense and Profile Context Provider (INR ₹ Default)
 *
 * Centralizes state management for:
 * - Student Profile (MongoDB backed)
 * - Expenses collection & CRUD operations
 * - Dashboard analytics & KPIs (Total, Month, Today, Category, Trends in INR ₹)
 * - Search, Filters, and Sorting
 * - Modals (Expense Form, Delete Confirmation, Student Profile, Settings)
 * - Toast notifications
 */

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { expenseService, profileService } from '../services/api';
import { formatCurrency } from '../utils/formatters';

export const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  // ==========================================
  // PROFILE STATE
  // ==========================================
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Student Monthly Budget & Currency Preference (linked to profile)
  const [monthlyBudget, setMonthlyBudget] = useState(15000);
  const [currency, setCurrency] = useState('INR');

  // ==========================================
  // EXPENSES & STATS STATE
  // ==========================================
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalCount: 0,
    thisMonthSpending: 0,
    todaySpending: 0,
    highestExpense: null,
    averageExpense: 0,
    categoryBreakdown: [],
    monthlyTrends: []
  });

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

  // Toast Notification Queue
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3800);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ==========================================
  // PROFILE FETCH & MUTATIONS
  // ==========================================
  const fetchProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const res = await profileService.get();
      if (res.success && res.data) {
        setProfile(res.data);
        if (res.data.monthlyBudget !== undefined) {
          setMonthlyBudget(res.data.monthlyBudget);
        }
        if (res.data.currency) {
          setCurrency(res.data.currency);
        }
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.warn('Could not fetch profile from server:', err);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const createProfile = async (profileData) => {
    try {
      const res = await profileService.create(profileData);
      if (res.success && res.data) {
        setProfile(res.data);
        if (res.data.monthlyBudget !== undefined) {
          setMonthlyBudget(res.data.monthlyBudget);
        }
        if (res.data.currency) {
          setCurrency(res.data.currency);
        }
        addToast(`Profile created! Your Student ID is ${res.data.studentId} 🎓`, 'success');
        return { success: true, data: res.data };
      }
    } catch (err) {
      const msg = err.message || 'Failed to create student profile';
      addToast(msg, 'error');
      return { success: false, error: err };
    }
  };

  const updateProfile = async (studentId, profileData) => {
    try {
      const res = await profileService.update(studentId, profileData);
      if (res.success && res.data) {
        setProfile(res.data);
        if (res.data.monthlyBudget !== undefined) {
          setMonthlyBudget(res.data.monthlyBudget);
        }
        if (res.data.currency) {
          setCurrency(res.data.currency);
        }
        addToast('Student profile updated successfully! ✨', 'success');
        return { success: true, data: res.data };
      }
    } catch (err) {
      const msg = err.message || 'Failed to update student profile';
      addToast(msg, 'error');
      return { success: false, error: err };
    }
  };

  const updateMonthlyBudget = async (newLimit) => {
    const val = Math.max(0, Number(newLimit) || 0);
    setMonthlyBudget(val);

    if (profile && profile.studentId) {
      try {
        await profileService.update(profile.studentId, { monthlyBudget: val });
        setProfile((prev) => (prev ? { ...prev, monthlyBudget: val } : prev));
      } catch (err) {
        console.error('Failed to sync budget to profile:', err);
      }
    }
    addToast(`Monthly budget set to ${formatCurrency(val, currency)}`, 'info');
  };

  const updateCurrency = async (newCurrency) => {
    setCurrency(newCurrency);
    if (profile && profile.studentId) {
      try {
        await profileService.update(profile.studentId, { currency: newCurrency });
        setProfile((prev) => (prev ? { ...prev, currency: newCurrency } : prev));
      } catch (err) {
        console.error('Failed to sync currency to profile:', err);
      }
    }
    addToast(`Currency updated to ${newCurrency}`, 'info');
  };

  // ==========================================
  // EXPENSES FETCH & MUTATIONS
  // ==========================================
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const studentId = profile?.studentId;
      const res = await expenseService.getStats(studentId);
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [profile?.studentId]);

  const fetchExpenses = useCallback(async (customParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        sortBy: filters.sortBy,
        order: filters.order,
        ...customParams
      };

      if (profile?.studentId) {
        params.studentId = profile.studentId;
      }

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
  }, [filters, profile?.studentId, addToast]);

  // Initial loads
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const addExpense = async (expenseData) => {
    try {
      const payload = {
        ...expenseData,
        studentId: profile?.studentId || null
      };
      const res = await expenseService.create(payload);
      if (res.success) {
        await Promise.all([fetchExpenses(), fetchStats()]);
        addToast('Expense recorded successfully! 🎉', 'success');
        setIsFormModalOpen(false);
        return { success: true, data: res.data };
      }
    } catch (err) {
      const msg = err.message || 'Failed to add expense';
      addToast(msg, 'error');
      return { success: false, error: err };
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const payload = {
        ...expenseData,
        studentId: profile?.studentId || null
      };
      const res = await expenseService.update(id, payload);
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

  // Helper Modal Openers
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

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const openSettingsModal = () => {
    setIsSettingsModalOpen(true);
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
      profile,
      profileLoading,
      fetchProfile,
      createProfile,
      updateProfile,
      isProfileModalOpen,
      setIsProfileModalOpen,
      openProfileModal,
      isSettingsModalOpen,
      setIsSettingsModalOpen,
      openSettingsModal,
      monthlyBudget,
      updateMonthlyBudget,
      currency,
      updateCurrency,
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
      toasts,
      addToast,
      removeToast
    }),
    [
      profile,
      profileLoading,
      fetchProfile,
      isProfileModalOpen,
      isSettingsModalOpen,
      monthlyBudget,
      currency,
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
      toasts,
      addToast,
      removeToast
    ]
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

export default ExpenseProvider;
