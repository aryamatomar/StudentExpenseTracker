/**
 * Utility functions for formatting currencies, dates, and category representations
 */

import { CATEGORY_CONFIG } from './constants';

/**
 * Format numeric amount into localized Indian Rupee currency string (INR ₹)
 * Examples:
 * - 500 -> ₹500
 * - 1250 -> ₹1,250
 * - 12500 -> ₹12,500
 * - 125000 -> ₹1,25,000
 * - 145.5 -> ₹145.50
 *
 * @param {number} amount
 * @param {string} currencyCode (defaults to 'INR')
 * @returns {string}
 */
export const formatCurrency = (amount, currencyCode = 'INR') => {
  const num = Number(amount) || 0;
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: num % 1 === 0 ? 0 : 2
    }).format(num);
  } catch (error) {
    return `₹${num.toLocaleString('en-IN')}`;
  }
};

/**
 * Format ISO date string into readable date (e.g., "Jan 15, 2026")
 * @param {string|Date} dateStr
 * @returns {string}
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid Date';

  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format ISO date string into relative human-readable label (e.g., "Today", "Yesterday", "3 days ago")
 * @param {string|Date} dateStr
 * @returns {string}
 */
export const formatRelativeDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffTime = now.setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;

  return formatDate(dateStr);
};

/**
 * Format date for standard HTML date input (YYYY-MM-DD)
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateForInput = (date = new Date()) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
  return d.toISOString().split('T')[0];
};

/**
 * Safe accessor for category configuration
 * @param {string} category
 * @returns {object}
 */
export const getCategoryConfig = (category) => {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG['Other'];
};

/**
 * Extract 2-letter initials from full name (e.g. "Aryama Singh" -> "AS")
 * @param {string} name
 * @returns {string}
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
