import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import WelcomePage from './pages/WelcomePage';
import PhilosopherSelectionPage from './pages/PhilosopherSelectionPage';
import DialoguePage from './pages/DialoguePage';

function App() {
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null);

  const handleSelectPhilosopher = (philosopher) => {
    setSelectedPhilosopher(philosopher);
  };

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/philosophers" element={<PhilosopherSelectionPage onSelectPhilosopher={handleSelectPhilosopher} />} />
      <Route 
        path="/dialogue" 
        element={
          selectedPhilosopher ? (
            <DialoguePage selectedPhilosopher={selectedPhilosopher} />
          ) : (
            <Navigate to="/philosophers" replace />
          )
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
