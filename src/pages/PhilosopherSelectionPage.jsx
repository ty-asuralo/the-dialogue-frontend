import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import nietzscheAvatar from '../assets/p-nietzsche-calm.png';
import Sidebar from '../components/Sidebar';

const PhilosopherSelectionPage = ({ onSelectPhilosopher }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('classical');
  const [fontSize, setFontSize] = useState('mid');
  const philosophers = [
    {
      id: 'nietzsche',
      name: 'Friedrich Nietzsche',
      description: 'The hammer of idols and herald of becoming. Challenge your assumptions and embrace the will to power.',
      avatar: nietzscheAvatar,
      available: true
    },
    {
      id: 'socrates',
      name: 'Socrates',
      description: 'The gadfly of Athens. Question everything through the Socratic method.',
      avatar: null, // Placeholder for future avatar
      available: false
    },
    {
      id: 'plato',
      name: 'Plato',
      description: 'The idealist philosopher. Explore the world of forms and the allegory of the cave.',
      avatar: null, // Placeholder for future avatar
      available: false
    }
  ];

  const handleSelectPhilosopher = (philosopher) => {
    if (philosopher.available) {
      onSelectPhilosopher(philosopher);
      navigate('/dialogue');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="dialogue-app-layout">
      <Sidebar 
        mode={mode} 
        setMode={setMode} 
        fontSize={fontSize} 
        setFontSize={setFontSize}
        onBack={handleBack}
        currentPage="philosopher-selection"
      />
      <div className="philosopher-selection-page">
        <div className="philosopher-selection-content">
          <div className="selection-header">
            <h1>Choose Your Philosopher</h1>
            <p>Select a philosopher to begin your dialogue</p>
          </div>
          
          <div className="philosophers-grid">
            {philosophers.map((philosopher) => (
              <div 
                key={philosopher.id}
                className={`philosopher-card ${philosopher.available ? 'available' : 'unavailable'}`}
                onClick={() => handleSelectPhilosopher(philosopher)}
              >
                <div className="philosopher-avatar">
                  {philosopher.avatar ? (
                    <img src={philosopher.avatar} alt={philosopher.name} />
                  ) : (
                    <div className="avatar-placeholder">?</div>
                  )}
                </div>
                <div className="philosopher-info">
                  <h3>{philosopher.name}</h3>
                  <p>{philosopher.description}</p>
                  {!philosopher.available && (
                    <span className="coming-soon">Coming Soon</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhilosopherSelectionPage;
