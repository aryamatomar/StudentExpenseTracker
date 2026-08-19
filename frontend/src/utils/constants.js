/**
 * Application Constants and Visual Mappings (Indian Rupee INR ₹)
 */

export const CATEGORIES = [
  'Food',
  'Transport',
  'Education',
  'Shopping',
  'Entertainment',
  'Bills',
  'Health',
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
    description: 'Canteen, Groceries, Dining, Chai & Snacks'
  },
  Transport: {
    color: '#0ea5e9', // Sky Blue
    bgLight: 'bg-sky-50',
    textLight: 'text-sky-600',
    borderLight: 'border-sky-200',
    badge: 'bg-sky-100 text-sky-700 border-sky-200',
    iconName: 'Bus',
    description: 'Metro pass, Auto, Bus, Cab, Fuel'
  },
  Education: {
    color: '#8b5cf6', // Violet
    bgLight: 'bg-purple-50',
    textLight: 'text-purple-600',
    borderLight: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700 border-purple-200',
    iconName: 'GraduationCap',
    description: 'Textbooks, Stationery, Practical Files, Courses'
  },
  Shopping: {
    color: '#ec4899', // Pink
    bgLight: 'bg-pink-50',
    textLight: 'text-pink-600',
    borderLight: 'border-pink-200',
    badge: 'bg-pink-100 text-pink-700 border-pink-200',
    iconName: 'ShoppingBag',
    description: 'Clothes, Electronics, Hostel & Dorm items'
  },
  Entertainment: {
    color: '#eab308', // Amber
    bgLight: 'bg-amber-50',
    textLight: 'text-amber-600',
    borderLight: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    iconName: 'Film',
    description: 'Streaming, Movies, Gaming, Campus Outings'
  },
  Bills: {
    color: '#06b6d4', // Cyan
    bgLight: 'bg-cyan-50',
    textLight: 'text-cyan-600',
    borderLight: 'border-cyan-200',
    badge: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    iconName: 'Receipt',
    description: 'Electricity, Wi-Fi, Mobile Recharge, Mess Dues'
  },
  Health: {
    color: '#ef4444', // Red
    bgLight: 'bg-red-50',
    textLight: 'text-red-600',
    borderLight: 'border-red-200',
    badge: 'bg-red-100 text-red-700 border-red-200',
    iconName: 'HeartPulse',
    description: 'Medicines, Doctor Visit, Gym, Personal Care'
  },
  Other: {
    color: '#64748b', // Slate
    bgLight: 'bg-slate-50',
    textLight: 'text-slate-600',
    borderLight: 'border-slate-200',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    iconName: 'MoreHorizontal',
    description: 'Laundry, Photocopy, Printing, Misc expenses'
  }
};

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹) - Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound' }
];

export const SORT_OPTIONS = [
  { label: 'Date: Newest First', value: 'date-desc' },
  { label: 'Date: Oldest First', value: 'date-asc' },
  { label: 'Amount: High to Low', value: 'amount-desc' },
  { label: 'Amount: Low to High', value: 'amount-asc' },
  { label: 'Title: A-Z', value: 'title-asc' },
];

export const DATE_PRESETS = [
  { label: 'All Time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This Month', value: 'this-month' },
  { label: 'Last 30 Days', value: 'last-30' },
  { label: 'Last 7 Days', value: 'last-7' },
];
