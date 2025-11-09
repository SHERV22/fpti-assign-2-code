import React from 'react';
import { format } from 'date-fns';
import './TransactionList.css';

const TransactionList = ({ transactions, onUpdate }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>No transactions yet. Add your first transaction to get started!</p>
      </div>
    );
  }

  const getCategoryIcon = (category) => {
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

  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="transaction-item">
          <div className="transaction-icon">
            {getCategoryIcon(transaction.category)}
          </div>
          <div className="transaction-details">
            <div className="transaction-description">
              {transaction.description}
            </div>
            <div className="transaction-meta">
              {transaction.category} • {format(transaction.date, 'MMM dd, yyyy')}
            </div>
          </div>
          <div className={`transaction-amount ${transaction.type}`}>
            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
