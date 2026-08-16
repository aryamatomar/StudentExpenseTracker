/**
 * Axios API Service for communicating with Express Backend
 */

import axios from 'axios';

// Create configured Axios instance
// In Vite dev mode, '/api' is proxied to 'http://localhost:5000/api'
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for unified error extracting
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred while communicating with the server.',
      errors: error.response?.data?.errors || [],
      status: error.response?.status || 500,
    };
    return Promise.reject(customError);
  }
);

export const expenseService = {
  /**
   * Fetch all expenses with optional search, filtering and sorting query params
   */
  getAll: async (params = {}) => {
    const response = await API.get('/expenses', { params });
    return response.data;
  },

  /**
   * Fetch dashboard statistics calculations
   */
  getStats: async () => {
    const response = await API.get('/expenses/stats');
    return response.data;
  },

  /**
   * Fetch single expense by ID
   */
  getById: async (id) => {
    const response = await API.get(`/expenses/${id}`);
    return response.data;
  },

  /**
   * Create a new expense
   */
  create: async (expenseData) => {
    const response = await API.post('/expenses', expenseData);
    return response.data;
  },

  /**
   * Update existing expense by ID
   */
  update: async (id, expenseData) => {
    const response = await API.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  /**
   * Delete expense by ID
   */
  delete: async (id) => {
    const response = await API.delete(`/expenses/${id}`);
    return response.data;
  },

  /**
   * Server Health Check
   */
  checkHealth: async () => {
    const response = await API.get('/health');
    return response.data;
  }
};

export default API;
