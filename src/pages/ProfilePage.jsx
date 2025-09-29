import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import Sidebar from '../components/Sidebar';

const ProfilePage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('classical');
  const [fontSize, setFontSize] = useState('mid');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    username: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        full_name: user.full_name || '',
        username: user.username || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local storage
        localStorage.setItem('user', JSON.stringify(data));
        setSuccess('Profile updated successfully');
        setIsEditing(false);
      } else {
        setError(data.detail || 'Update failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/auth/me', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        // Clear local storage and logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        onLogout();
        navigate('/');
      } else {
        setError('Failed to delete account');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToGame = () => {
    navigate('/philosophers');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dialogue-app-layout">
      <Sidebar 
        mode={mode} 
        setMode={setMode} 
        fontSize={fontSize} 
        setFontSize={setFontSize}
        onBack={handleBackToGame}
        currentPage="profile"
      />
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1>Profile Settings</h1>
            <p>Manage your account and preferences</p>
          </div>

          <div className="profile-content">
            <div className="profile-section">
              <h2>Account Information</h2>
              
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="profile-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="full_name">Full Name</label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="profile-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="profile-input"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="profile-btn secondary-btn"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="profile-btn primary-btn"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-info">
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{user.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Full Name:</label>
                    <span>{user.full_name || 'Not set'}</span>
                  </div>
                  <div className="info-item">
                    <label>Username:</label>
                    <span>{user.username || 'Not set'}</span>
                  </div>
                  <div className="info-item">
                    <label>Member Since:</label>
                    <span>{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="profile-actions">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="profile-btn primary-btn"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-section">
              <h2>Danger Zone</h2>
              <div className="danger-zone">
                <p>Once you delete your account, there is no going back. Please be certain.</p>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="profile-btn danger-btn"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
