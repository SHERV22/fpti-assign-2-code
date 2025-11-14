import React, { useMemo } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';
import './BudgetOverview.css';

const BudgetOverview = ({ budget, transactions, userProfile }) => {
  const monthlySpending = useMemo(() => {
    if (!transactions || transactions.length === 0) return {};

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const spending = {};
    
    transactions.forEach((transaction) => {
      if (transaction.type === 'expense' && 
          transaction.date >= monthStart && 
          transaction.date <= monthEnd) {
        const category = transaction.category || 'Other';
        spending[category] = (spending[category] || 0) + transaction.amount;
      }
    });

    return spending;
  }, [transactions]);

  const totalSpent = Object.values(monthlySpending).reduce((sum, amount) => sum + amount, 0);
  const totalBudget = budget?.categories 
    ? Object.values(budget.categories).reduce((sum, amount) => sum + amount, 0)
    : 0;

  if (!budget || !budget.categories) {
    return (
      <div className="budget-empty">
        <p>No budget set yet.</p>
        <p className="budget-hint">Set up your budget to start tracking!</p>
      </div>
    );
  }

  const calculatePercentage = (spent, budgeted) => {
    if (!budgeted) return 0;
    return Math.min((spent / budgeted) * 100, 100);
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return '#e74c3c';
    if (percentage >= 80) return '#f39c12';
    return '#27ae60';
  };

  return (
    <div className="budget-overview">
      <div className="budget-summary">
        <div className="budget-total">
          <div className="budget-label">Total Spent</div>
          <div className="budget-amount">₹{totalSpent.toFixed(2)}</div>
          <div className="budget-of">of ₹{totalBudget.toFixed(2)}</div>
        </div>
        <div className="budget-progress-main">
          <div 
            className="budget-progress-bar"
            style={{
              width: `${calculatePercentage(totalSpent, totalBudget)}%`,
              background: getStatusColor(calculatePercentage(totalSpent, totalBudget)),
            }}
          />
        </div>
      </div>

      <div className="budget-categories">
        <h3>By Category</h3>
        {Object.entries(budget.categories).map(([category, budgetAmount]) => {
          const spent = monthlySpending[category] || 0;
          const percentage = calculatePercentage(spent, budgetAmount);

          return (
            <div key={category} className="budget-category">
              <div className="category-header">
                <span className="category-name">{category}</span>
                <span className="category-amount">
                  ${spent.toFixed(0)} / ${budgetAmount.toFixed(0)}
                </span>
              </div>
              <div className="category-progress">
                <div 
                  className="category-progress-bar"
                  style={{
                    width: `${percentage}%`,
                    background: getStatusColor(percentage),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetOverview;
