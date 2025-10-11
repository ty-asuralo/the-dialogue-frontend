import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.png';
import LoginModal from '../components/LoginModal';

const WelcomePage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleEnterGame = () => {
    setShowLoginModal(true);
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
