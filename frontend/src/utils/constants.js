/**
 * Application Constants and Visual Mappings
 */

export const CATEGORIES = [
  'Food',
  'Transport',
  'Education',
  'Shopping',
  'Entertainment',
  'Other'
];

export const CATEGORY_CONFIG = {
  Food: {
    color: '#f97316', // Orange
    bgLight: 'bg-orange-50',
    textLight: 'text-orange-600',
    borderLight: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
    iconName: 'UtensilsCrossed',
    description: 'Cafeteria, Groceries, Dining, Coffee'
  },
  Transport: {
    color: '#0ea5e9', // Sky Blue
    bgLight: 'bg-sky-50',
    textLight: 'text-sky-600',
    borderLight: 'border-sky-200',
    badge: 'bg-sky-100 text-sky-700 border-sky-200',
    iconName: 'Bus',
    description: 'Subway pass, Bus, Rideshare, Fuel'
  },
  Education: {
    color: '#8b5cf6', // Violet
    bgLight: 'bg-purple-50',
    textLight: 'text-purple-600',
    borderLight: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700 border-purple-200',
    iconName: 'GraduationCap',
    description: 'Textbooks, Courses, Supplies, Software'
  },
  Shopping: {
    color: '#ec4899', // Pink
    bgLight: 'bg-pink-50',
    textLight: 'text-pink-600',
    borderLight: 'border-pink-200',
    badge: 'bg-pink-100 text-pink-700 border-pink-200',
    iconName: 'ShoppingBag',
    description: 'Clothes, Electronics, Dorm items'
  },
  Entertainment: {
    color: '#eab308', // Amber
    bgLight: 'bg-amber-50',
    textLight: 'text-amber-600',
    borderLight: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    iconName: 'Film',
    description: 'Streaming, Movies, Games, Outings'
  },
  Other: {
    color: '#64748b', // Slate
    bgLight: 'bg-slate-50',
    textLight: 'text-slate-600',
    borderLight: 'border-slate-200',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    iconName: 'MoreHorizontal',
    description: 'Laundry, Bills, Misc expenses'
  }
};

export const SORT_OPTIONS = [
  { label: 'Date: Newest First', value: 'date-desc' },
  { label: 'Date: Oldest First', value: 'date-asc' },
  { label: 'Amount: High to Low', value: 'amount-desc' },
  { label: 'Amount: Low to High', value: 'amount-asc' },
  { label: 'Title: A-Z', value: 'title-asc' },
];

export const DATE_PRESETS = [
  { label: 'All Time', value: 'all' },
  { label: 'This Month', value: 'this-month' },
  { label: 'Last 30 Days', value: 'last-30' },
  { label: 'Last 7 Days', value: 'last-7' },
];
