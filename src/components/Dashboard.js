import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logOut } from '../firebase/auth';
import { getTransactions, getBudget } from '../firebase/firestore';
import { analyzeSpendingPatterns, generateMonthlySummary } from '../services/geminiService';
import { getUserProfile } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';
import TransactionList from './TransactionList';
import BudgetOverview from './BudgetOverview';
import AddTransaction from './AddTransaction';
import AIInsights from './AIInsights';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get user profile
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);

      // Get transactions for last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const txns = await getTransactions(user.uid, startDate, endDate);
      setTransactions(txns);

      // Get budget
      const budgetData = await getBudget(user.uid);
      setBudget(budgetData);

      // Generate AI insights if we have data
      if (txns.length > 0 && profile) {
        const analysis = await analyzeSpendingPatterns(txns, profile);
        setInsights(analysis);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleTransactionAdded = () => {
    setShowAddTransaction(false);
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading your financial data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>💰 AI Budgeting Assistant</h1>
          <p>Welcome back, {user?.displayName || user?.email}!</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/profile')} className="btn-secondary">
            Profile
          </button>
          <button onClick={() => navigate('/budget')} className="btn-secondary">
            Manage Budget
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="main-section">
          <div className="card">
            <div className="card-header">
              <h2>Recent Transactions</h2>
              <button 
                onClick={() => setShowAddTransaction(true)} 
                className="btn-primary"
              >
                + Add Transaction
              </button>
            </div>
            <TransactionList 
              transactions={transactions} 
              onUpdate={loadDashboardData}
            />
          </div>

          {insights && (
            <div className="card">
              <h2>AI Insights</h2>
              <AIInsights insights={insights} />
            </div>
          )}
        </div>

        <aside className="sidebar">
          <div className="card">
            <h2>Budget Overview</h2>
            <BudgetOverview 
              budget={budget} 
              transactions={transactions}
              userProfile={userProfile}
            />
          </div>
        </aside>
      </div>

      {showAddTransaction && (
        <AddTransaction
          userId={user.uid}
          onClose={() => setShowAddTransaction(false)}
          onAdd={handleTransactionAdded}
        />
      )}
    </div>
  );
};

export default Dashboard;
