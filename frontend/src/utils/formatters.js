/**
 * Utility Formatters and Helpers
 */

import { CATEGORY_CONFIG } from './constants';

/**
 * Format numbers as USD currency ($1,234.56)
 */
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

/**
 * Format ISO date string into readable format (e.g., "Aug 15, 2026")
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format date for HTML date input (YYYY-MM-DD)
 */
export const formatDateForInput = (dateStr) => {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
  return date.toISOString().split('T')[0];
};

/**
 * Get relative time label (e.g. "Today", "Yesterday", "3 days ago")
 */
export const formatRelativeDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const diffTime = Math.abs(now.setHours(0,0,0,0) - date.setHours(0,0,0,0));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  return formatDate(dateStr);
};

/**
 * Safe accessor for Category visual settings
 */
export const getCategoryConfig = (category) => {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG['Other'];
};
