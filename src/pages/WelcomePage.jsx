import React from 'react';
import { useNavigate } from 'react-router-dom';
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
      </div>
    </div>
  );
};

export default WelcomePage;
