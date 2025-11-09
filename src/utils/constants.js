/**
 * Predefined spending categories
 */
export const CATEGORIES = [
  'Housing',
  'Food & Groceries',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Savings',
  'Other',
];

/**
 * Transaction types
 */
export const TRANSACTION_TYPES = {
  EXPENSE: 'expense',
  INCOME: 'income',
};

/**
 * Budget alert severity levels
 */
export const ALERT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
};

/**
 * Alert thresholds (percentage of budget)
 */
export const ALERT_THRESHOLDS = {
  WARNING: 80,
  CRITICAL: 100,
};

/**
 * Time periods for analytics
 */
export const TIME_PERIODS = {
  WEEK: 7,
  MONTH: 30,
  QUARTER: 90,
  YEAR: 365,
};

/**
 * Default budget allocation (50/30/20 rule)
 */
export const DEFAULT_BUDGET_ALLOCATION = {
  needs: 0.50,    // 50% for needs (Housing, Utilities, Food, Transportation)
  wants: 0.30,    // 30% for wants (Entertainment, Shopping)
  savings: 0.20,  // 20% for savings and debt repayment
};

/**
 * Category types for budget allocation
 */
export const CATEGORY_TYPES = {
  needs: ['Housing', 'Food & Groceries', 'Transportation', 'Utilities', 'Healthcare'],
  wants: ['Entertainment', 'Shopping'],
  savings: ['Savings'],
  other: ['Other'],
};

/**
 * Notification types
 */
export const NOTIFICATION_TYPES = {
  BUDGET_ALERT: 'budget_alert',
  CATEGORY_ALERT: 'category_alert',
  WEEKLY_INSIGHTS: 'weekly_insights',
  MONTHLY_SUMMARY: 'monthly_summary',
};

/**
 * Chart colors
 */
export const CHART_COLORS = [
  '#667eea',
  '#764ba2',
  '#f093fb',
  '#4facfe',
  '#43e97b',
  '#fa709a',
  '#fee140',
  '#30cfd0',
];

/**
 * Status colors
 */
export const STATUS_COLORS = {
  success: '#27ae60',
  warning: '#f39c12',
  danger: '#e74c3c',
  info: '#3498db',
};

/**
 * Date formats
 */
export const DATE_FORMATS = {
  SHORT: 'MMM dd',
  LONG: 'MMMM dd, yyyy',
  FULL: 'EEEE, MMMM dd, yyyy',
};

/**
 * Currency options
 */
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  AUTH_FAILED: 'Authentication failed. Please check your credentials.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_INPUT: 'Please check your input and try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again later.',
};

export default {
  CATEGORIES,
  TRANSACTION_TYPES,
  ALERT_SEVERITY,
  ALERT_THRESHOLDS,
  TIME_PERIODS,
  DEFAULT_BUDGET_ALLOCATION,
  CATEGORY_TYPES,
  NOTIFICATION_TYPES,
  CHART_COLORS,
  STATUS_COLORS,
  DATE_FORMATS,
  CURRENCIES,
  ERROR_MESSAGES,
};
