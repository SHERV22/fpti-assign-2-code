import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../firebase/auth';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const profile = await getUserProfile(user.uid);
      if (profile && profile.monthlyIncome) {
        setMonthlyIncome(profile.monthlyIncome);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      await updateUserProfile(user.uid, {
        monthlyIncome: parseFloat(monthlyIncome) || 0,
      });
      alert('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-container"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <h1>Profile Settings</h1>
      </header>

      <div className="profile-content">
        <div className="profile-card">
          <h2>User Information</h2>
          <div className="info-row">
            <label>Email:</label>
            <span>{user?.email}</span>
          </div>
          <div className="info-row">
            <label>Name:</label>
            <span>{user?.displayName}</span>
          </div>
        </div>

        <div className="profile-card">
          <h2>Financial Settings</h2>
          <div className="form-group">
            <label>Monthly Income ($)</label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="Enter your monthly income"
              min="0"
              step="100"
            />
            <p className="helper-text">
              This helps AI generate personalized budget recommendations
            </p>
          </div>

          <button onClick={handleSave} className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
