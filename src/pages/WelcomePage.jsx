import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.png';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleEnterGame = () => {
    navigate('/philosophers');
  };

  const handleContactUs = () => {
    // For now, just open a mailto link
    window.open('mailto:contact@philosopher.com?subject=Contact from Philosopher App', '_blank');
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
        
        <div className="welcome-auth-links">
          <Link to="/login" className="auth-link">Sign In</Link>
          <span>•</span>
          <Link to="/register" className="auth-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
