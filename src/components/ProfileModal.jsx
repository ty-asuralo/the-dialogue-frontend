import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const ProfileModal = ({ isOpen, onClose, user, onLogout }) => {
  const navigate = useNavigate();
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
        onClose();
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

  if (!isOpen || !user) return null;

  return (
    <div className="sidebar-modal-overlay" onClick={onClose}>
      <div className="sidebar-modal profile-modal" onClick={e => e.stopPropagation()}>
        <div className="sidebar-modal-header">
          <span>Profile Settings</span>
          <button className="sidebar-modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="sidebar-modal-content">
          {/* Guest Warning */}
          {user.is_guest && (
            <div className="guest-warning">
              <p>⚠️ You are logged in as a guest. Your data will not be saved permanently.</p>
            </div>
          )}

          {/* Account Information Section */}
          <div className="profile-modal-section">
            <h3 className="profile-modal-section-title">Account Information</h3>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {isEditing && !user.is_guest ? (
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
                  <label>Type:</label>
                  <span>{user.is_guest ? '👤 Guest' : '👤 User'}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{user.email}</span>
                </div>
                {!user.is_guest && (
                  <>
                    <div className="info-item">
                      <label>Full Name:</label>
                      <span>{user.full_name || 'Not set'}</span>
                    </div>
                    <div className="info-item">
                      <label>Username:</label>
                      <span>{user.username || 'Not set'}</span>
                    </div>
                  </>
                )}
                <div className="info-item">
                  <label>Member Since:</label>
                  <span>{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                
                {!user.is_guest && (
                  <div className="profile-actions">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="profile-btn primary-btn"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Danger Zone - Only for non-guest users */}
          {!user.is_guest && (
            <div className="profile-modal-section">
              <h3 className="profile-modal-section-title">Danger Zone</h3>
              <div className="danger-zone">
                <p>Once you delete your account, there is no going back.</p>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="profile-btn danger-btn"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

