/**
 * Common utility functions for the budgeting app
 */

/**
 * Format currency amount
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Get color based on budget status
 */
export const getBudgetStatusColor = (percentage) => {
  if (percentage >= 100) return '#e74c3c'; // Red - over budget
  if (percentage >= 80) return '#f39c12'; // Orange - warning
  if (percentage >= 50) return '#f1c40f'; // Yellow - caution
  return '#27ae60'; // Green - good
};

/**
 * Get category icon emoji
 */
export const getCategoryIcon = (category) => {
  const icons = {
    'Housing': '🏠',
    'Food & Groceries': '🛒',
    'Transportation': '🚗',
    'Utilities': '💡',
    'Entertainment': '🎬',
    'Shopping': '🛍️',
    'Healthcare': '⚕️',
    'Savings': '💰',
    'Other': '📌',
  };
  return icons[category] || '📌';
};

/**
 * Get budget status message
 */
export const getBudgetStatusMessage = (percentage) => {
  if (percentage >= 100) return 'Over budget!';
  if (percentage >= 80) return 'Approaching limit';
  if (percentage >= 50) return 'On track';
  return 'Well under budget';
};

/**
 * Calculate total spending for a category
 */
export const calculateCategoryTotal = (transactions, category) => {
  return transactions
    .filter(t => t.category === category && t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
};

/**
 * Group transactions by category
 */
export const groupTransactionsByCategory = (transactions) => {
  const grouped = {};
  
  transactions.forEach(transaction => {
    if (transaction.type !== 'expense') return;
    
    const category = transaction.category || 'Other';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(transaction);
  });
  
  return grouped;
};

/**
 * Get date range for current month
 */
export const getCurrentMonthRange = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return { startOfMonth, endOfMonth };
};

/**
 * Get date range for last N days
 */
export const getLastNDaysRange = (days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return { startDate, endDate };
};

/**
 * Validate transaction data
 */
export const validateTransaction = (transaction) => {
  const errors = [];
  
  if (!transaction.description || transaction.description.trim() === '') {
    errors.push('Description is required');
  }
  
  if (!transaction.amount || transaction.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!transaction.category) {
    errors.push('Category is required');
  }
  
  if (!transaction.date) {
    errors.push('Date is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Debounce function for search/input
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Export transactions to CSV
 */
export const exportToCSV = (transactions, filename = 'transactions.csv') => {
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
  const rows = transactions.map(t => [
    t.date.toLocaleDateString(),
    t.description,
    t.category,
    t.amount.toFixed(2),
    t.type,
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

export default {
  formatCurrency,
  calculatePercentage,
  getBudgetStatusColor,
  getCategoryIcon,
  getBudgetStatusMessage,
  calculateCategoryTotal,
  groupTransactionsByCategory,
  getCurrentMonthRange,
  getLastNDaysRange,
  validateTransaction,
  truncateText,
  debounce,
  exportToCSV,
};
