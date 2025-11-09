/**
 * Sample data generator for testing the budgeting app
 * This file provides functions to generate realistic test data
 */

/**
 * Generate sample transactions for testing
 */
export const generateSampleTransactions = (count = 20) => {
  const categories = [
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

  const descriptions = {
    'Housing': ['Rent payment', 'Mortgage', 'Home insurance', 'Property tax'],
    'Food & Groceries': ['Grocery shopping', 'Restaurant', 'Coffee shop', 'Food delivery'],
    'Transportation': ['Gas', 'Uber/Lyft', 'Car insurance', 'Public transport', 'Car maintenance'],
    'Utilities': ['Electric bill', 'Water bill', 'Internet', 'Phone bill', 'Gas bill'],
    'Entertainment': ['Movie tickets', 'Streaming service', 'Concert', 'Sports event', 'Video games'],
    'Shopping': ['Clothing', 'Electronics', 'Books', 'Home goods', 'Online shopping'],
    'Healthcare': ['Doctor visit', 'Pharmacy', 'Gym membership', 'Health insurance'],
    'Savings': ['Emergency fund', 'Retirement', 'Investment'],
    'Other': ['Gift', 'Donation', 'Miscellaneous'],
  };

  const amounts = {
    'Housing': [800, 1200, 1500, 2000],
    'Food & Groceries': [50, 100, 150, 200],
    'Transportation': [30, 50, 75, 100],
    'Utilities': [50, 80, 120, 150],
    'Entertainment': [20, 40, 60, 100],
    'Shopping': [30, 75, 150, 300],
    'Healthcare': [50, 100, 200, 300],
    'Savings': [200, 500, 1000],
    'Other': [20, 50, 100],
  };

  const transactions = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    // Random category
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    // Random description from category
    const categoryDescriptions = descriptions[category];
    const description = categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
    
    // Random amount from category range
    const categoryAmounts = amounts[category];
    const amount = categoryAmounts[Math.floor(Math.random() * categoryAmounts.length)];
    
    // Random date within last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);

    transactions.push({
      description,
      amount,
      category,
      date: date.toISOString().split('T')[0],
      type: 'expense',
    });
  }

  // Add a few income transactions
  const incomeCount = Math.floor(count / 10);
  for (let i = 0; i < incomeCount; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);

    transactions.push({
      description: 'Salary',
      amount: 3000 + Math.floor(Math.random() * 2000),
      category: 'Other',
      date: date.toISOString().split('T')[0],
      type: 'income',
    });
  }

  // Sort by date (newest first)
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Generate sample budget based on monthly income
 */
export const generateSampleBudget = (monthlyIncome = 5000) => {
  // Using 50/30/20 rule as base
  const needs = monthlyIncome * 0.50;
  const wants = monthlyIncome * 0.30;
  const savings = monthlyIncome * 0.20;

  return {
    categories: {
      'Housing': Math.round(needs * 0.50),        // 25% of income
      'Food & Groceries': Math.round(needs * 0.20), // 10% of income
      'Transportation': Math.round(needs * 0.15),   // 7.5% of income
      'Utilities': Math.round(needs * 0.15),        // 7.5% of income
      'Entertainment': Math.round(wants * 0.50),    // 15% of income
      'Shopping': Math.round(wants * 0.50),         // 15% of income
      'Healthcare': Math.round(monthlyIncome * 0.05), // 5% of income
      'Savings': Math.round(savings),               // 20% of income
      'Other': Math.round(monthlyIncome * 0.05),    // 5% of income
    },
    totalBudget: monthlyIncome,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Generate sample user profile
 */
export const generateSampleUserProfile = () => {
  const names = ['Alex Johnson', 'Sam Smith', 'Jordan Lee', 'Taylor Davis'];
  const name = names[Math.floor(Math.random() * names.length)];

  return {
    displayName: name,
    email: name.toLowerCase().replace(' ', '.') + '@example.com',
    monthlyIncome: 3000 + Math.floor(Math.random() * 7000), // $3k-$10k
    currency: 'USD',
    createdAt: new Date().toISOString(),
  };
};

/**
 * Generate sample AI insight
 */
export const generateSampleInsight = () => {
  const insights = [
    {
      analysis: "Great job managing your spending this month! Your largest expenses were in Housing and Food & Groceries, which are typical needs. Consider setting aside more for savings.",
      topCategories: ['Housing', 'Food & Groceries', 'Transportation'],
      concerns: ['Shopping spending is 15% over budget'],
      recommendation: 'Try meal planning to reduce food delivery costs and redirect those savings to your emergency fund.',
    },
    {
      analysis: "You're doing well staying within budget for most categories. Entertainment spending has increased compared to last month, but it's still manageable.",
      topCategories: ['Entertainment', 'Shopping', 'Food & Groceries'],
      concerns: [],
      recommendation: 'Keep up the good work! Consider using cashback apps for your grocery shopping to save even more.',
    },
    {
      analysis: "Your spending shows a balanced approach to budgeting. Housing and utilities are consistent, and you're maintaining healthy savings habits.",
      topCategories: ['Housing', 'Utilities', 'Savings'],
      concerns: ['Transportation costs are approaching budget limit'],
      recommendation: 'Look into carpooling or public transportation options to reduce transportation costs.',
    },
  ];

  return insights[Math.floor(Math.random() * insights.length)];
};

/**
 * Calculate spending statistics from transactions
 */
export const calculateSpendingStats = (transactions) => {
  const stats = {
    totalSpent: 0,
    totalIncome: 0,
    transactionCount: transactions.length,
    categoryBreakdown: {},
    averageTransaction: 0,
    largestTransaction: null,
    smallestTransaction: null,
  };

  transactions.forEach((transaction) => {
    const amount = transaction.amount || 0;

    if (transaction.type === 'expense') {
      stats.totalSpent += amount;
      
      const category = transaction.category || 'Other';
      stats.categoryBreakdown[category] = (stats.categoryBreakdown[category] || 0) + amount;

      if (!stats.largestTransaction || amount > stats.largestTransaction.amount) {
        stats.largestTransaction = transaction;
      }

      if (!stats.smallestTransaction || amount < stats.smallestTransaction.amount) {
        stats.smallestTransaction = transaction;
      }
    } else if (transaction.type === 'income') {
      stats.totalIncome += amount;
    }
  });

  stats.averageTransaction = stats.totalSpent / transactions.filter(t => t.type === 'expense').length || 0;
  stats.netIncome = stats.totalIncome - stats.totalSpent;

  return stats;
};

/**
 * Get spending trend (increasing, decreasing, or stable)
 */
export const getSpendingTrend = (transactions) => {
  if (transactions.length < 2) return 'stable';

  // Split into two halves
  const midpoint = Math.floor(transactions.length / 2);
  const firstHalf = transactions.slice(0, midpoint);
  const secondHalf = transactions.slice(midpoint);

  const firstHalfTotal = firstHalf
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const secondHalfTotal = secondHalf
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const difference = ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100;

  if (difference > 10) return 'increasing';
  if (difference < -10) return 'decreasing';
  return 'stable';
};

export default {
  generateSampleTransactions,
  generateSampleBudget,
  generateSampleUserProfile,
  generateSampleInsight,
  calculateSpendingStats,
  getSpendingTrend,
};
