import React, { useState } from 'react';
import '../App.css';

const LoginModal = ({ isOpen, onClose, onLogin, onSignUp, onGuestContinue }) => {
  const [formData, setFormData] = useState({
    email: 'dev@dialogue.com',
    password: 'dev'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [showGuestTooltip, setShowGuestTooltip] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      errors.password = 'Password must be at least 3 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
        onClose();
      } else {
        setError(data.detail || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
        onClose();
      } else {
        setError(data.detail || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    // For now, we'll show a placeholder
    // In a real implementation, you'd integrate with the actual OAuth flows
    setError(`${provider} login is not yet implemented`);
  };

  const handleGuestContinue = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/auth/guest-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onGuestContinue(data.user);
        onClose();
      } else {
        setError(data.detail || 'Guest login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{showSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          
          {!showSignUp ? (
            // Login Form
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`auth-input ${validationErrors.email ? 'error' : ''}`}
                />
                {validationErrors.email && (
                  <div className="field-error">{validationErrors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`auth-input ${validationErrors.password ? 'error' : ''}`}
                />
                {validationErrors.password && (
                  <div className="field-error">{validationErrors.password}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="auth-btn primary-btn"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          ) : (
            // Sign Up Form
            <form className="auth-form" onSubmit={handleSignUpSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`auth-input ${validationErrors.email ? 'error' : ''}`}
                />
                {validationErrors.email && (
                  <div className="field-error">{validationErrors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`auth-input ${validationErrors.password ? 'error' : ''}`}
                />
                {validationErrors.password && (
                  <div className="field-error">{validationErrors.password}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="auth-btn primary-btn"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <div className="social-login">
            <button
              onClick={() => handleSocialLogin('google')}
              className="social-btn google-btn"
            >
              <span className="social-icon">G</span>
              Google
            </button>
            
            <button
              onClick={() => handleSocialLogin('x')}
              className="social-btn x-btn"
            >
              <span className="social-icon">𝕏</span>
              X (Twitter)
            </button>
            
            <button
              onClick={() => handleSocialLogin('facebook')}
              className="social-btn facebook-btn"
            >
              <span className="social-icon">f</span>
              Facebook
            </button>
          </div>

          <div className="guest-section">
            <div className="guest-button-container">
              <button
                onClick={handleGuestContinue}
                className="guest-btn"
              >
                Continue as Guest
              </button>
              <div 
                className="info-icon"
                onMouseEnter={() => setShowGuestTooltip(true)}
                onMouseLeave={() => setShowGuestTooltip(false)}
              >
                ℹ️
                {showGuestTooltip && (
                  <div className="tooltip">
                    <div className="tooltip-content">
                      <strong>Guest Limitations:</strong>
                      <ul>
                        <li>Conversations are not saved</li>
                        <li>No access to conversation history</li>
                        <li>Limited to 3 conversations per session</li>
                        <li>Cannot access profile features</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              {showSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                type="button"
                className="auth-link-button"
                onClick={() => setShowSignUp(!showSignUp)}
              >
                {showSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
