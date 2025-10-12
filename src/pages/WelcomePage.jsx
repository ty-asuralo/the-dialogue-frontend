import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.png';
import LoginModal from '../components/LoginModal';

const WelcomePage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleEnterGame = () => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      // User is already logged in, go directly to philosophers
      try {
        const user = JSON.parse(userData);
        onLogin(user);  // Update App state
        navigate('/philosophers');
      } catch (error) {
        // If there's an error parsing, show login modal
        setShowLoginModal(true);
      }
    } else {
      // Not logged in, show login modal
      setShowLoginModal(true);
    }
  };

  const handleContactUs = () => {
    // For now, just open a mailto link
    window.open('mailto:contact@philosopher.com?subject=Contact from Philosopher App', '_blank');
  };

  const handleLogin = (userData) => {
    // Store user data and navigate to philosophers
    localStorage.setItem('user', JSON.stringify(userData));
    onLogin(userData);  // Update App state
    navigate('/philosophers');
  };

  const handleSignUp = (userData) => {
    // Store user data and navigate to philosophers
    localStorage.setItem('user', JSON.stringify(userData));
    onLogin(userData);  // Update App state
    navigate('/philosophers');
  };

  const handleGuestContinue = (guestUser) => {
    // Store guest user data and navigate to philosophers
    localStorage.setItem('user', JSON.stringify(guestUser));
    onLogin(guestUser);  // Update App state
    navigate('/philosophers');
  };

  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <div className="welcome-logo">
          <img src={logo} alt="Philosopher Logo" />
        </div>
        <div className="welcome-title">
          <p>Find yourself by talking with philosophers</p>
        </div>
        <div className="welcome-buttons">
          <button 
            className="welcome-btn enter-game-btn"
            onClick={handleEnterGame}
          >
            Enter the Game
          </button>
          <button 
            className="welcome-btn contact-btn"
            onClick={handleContactUs}
          >
            Contact Us
          </button>
        </div>
        
      </div>
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onGuestContinue={handleGuestContinue}
      />
    </div>
  );
};

export default WelcomePage;
