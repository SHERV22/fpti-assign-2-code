import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getBudget, createBudget, updateBudget } from '../firebase/firestore';
import { getUserProfile } from '../firebase/auth';
import { generateBudgetRecommendations } from '../services/geminiService';
import { getTransactions } from '../firebase/firestore';
import './BudgetManager.css';

const CATEGORIES = [
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

const BudgetManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [budget, setBudget] = useState(null);
  const [categoryAmounts, setCategoryAmounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadBudget();
  }, [user]);

  const loadBudget = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const existingBudget = await getBudget(user.uid);
      
      if (existingBudget && existingBudget.categories) {
        setBudget(existingBudget);
        setCategoryAmounts(existingBudget.categories);
      } else {
        // Initialize with zeros
        const initialAmounts = {};
        CATEGORIES.forEach(cat => {
          initialAmounts[cat] = 0;
        });
        setCategoryAmounts(initialAmounts);
      }
    } catch (error) {
      console.error('Error loading budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (category, value) => {
    setCategoryAmounts(prev => ({
      ...prev,
      [category]: parseFloat(value) || 0,
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      
      if (budget) {
        await updateBudget(user.uid, { categories: categoryAmounts });
      } else {
        await createBudget(user.uid, { categories: categoryAmounts });
      }
      
      alert('Budget saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Failed to save budget. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateRecommendations = async () => {
    if (!user) return;

    try {
      setGenerating(true);
      
      const profile = await getUserProfile(user.uid);
      
      // If no profile or no income set, use default
      if (!profile || !profile.monthlyIncome) {
        alert('Please set your monthly income first in your profile.');
        return;
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const transactions = await getTransactions(user.uid, startDate, endDate);

      // If no transactions, generate default budget based on income
      if (!transactions || transactions.length === 0) {
        const income = profile.monthlyIncome;
        const defaultBudget = {
          'Housing': Math.round(income * 0.25),
          'Food & Groceries': Math.round(income * 0.10),
          'Transportation': Math.round(income * 0.075),
          'Utilities': Math.round(income * 0.075),
          'Entertainment': Math.round(income * 0.10),
          'Shopping': Math.round(income * 0.10),
          'Healthcare': Math.round(income * 0.05),
          'Savings': Math.round(income * 0.20),
          'Other': Math.round(income * 0.05),
        };
        setCategoryAmounts(defaultBudget);
        alert('Default budget generated based on your income! Review and save when ready.');
        return;
      }

      const recommendations = await generateBudgetRecommendations(
        transactions,
        profile,
        budget
      );

      if (recommendations && recommendations.categories) {
        setCategoryAmounts(recommendations.categories);
        alert('AI recommendations generated! Review and save when ready.');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      alert('Error: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const totalBudget = Object.values(categoryAmounts).reduce((sum, amount) => sum + amount, 0);

  if (loading) {
    return (
      <div className="budget-manager-container">
        <div className="loading">Loading budget...</div>
      </div>
    );
  }

  return (
    <div className="budget-manager-container">
      <header className="budget-header">
        <div>
          <button onClick={() => navigate('/dashboard')} className="back-button">
            ← Back to Dashboard
          </button>
          <h1>Manage Budget</h1>
        </div>
        <div className="header-actions">
          <button 
            onClick={handleGenerateRecommendations} 
            className="btn-ai"
            disabled={generating}
          >
            {generating ? '🤖 Generating...' : '🤖 AI Recommendations'}
          </button>
        </div>
      </header>

      <div className="budget-content">
        <div className="budget-summary-box">
          <h3>Total Monthly Budget</h3>
          <div className="total-amount">₹{totalBudget.toFixed(2)}</div>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((category) => (
            <div key={category} className="category-input-card">
              <label>{category}</label>
              <div className="input-wrapper">
                <span className="currency">₹</span>
                <input
                  type="number"
                  value={categoryAmounts[category] || 0}
                  onChange={(e) => handleAmountChange(category, e.target.value)}
                  min="0"
                  step="10"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="save-section">
          <button 
            onClick={handleSave} 
            className="btn-save"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Budget'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetManager;
