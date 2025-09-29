import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import WelcomePage from './pages/WelcomePage';
import PhilosopherSelectionPage from './pages/PhilosopherSelectionPage';
import DialoguePage from './pages/DialoguePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Development mode - set to true to bypass authentication
  const DEV_MODE = true;

  // Check for existing authentication on app load
  useEffect(() => {
    if (DEV_MODE) {
      // Create a mock user for development
      const mockUser = {
        id: 1,
        email: 'dev@example.com',
        username: 'developer',
        full_name: 'Development User',
        avatar_url: null,
        is_active: true,
        is_verified: true,
        created_at: new Date().toISOString()
      };
      setUser(mockUser);
      setIsLoading(false);
      return;
    }
    
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedPhilosopher(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleSelectPhilosopher = (philosopher) => {
    setSelectedPhilosopher(philosopher);
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!DEV_MODE && !user) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };

  // Public route component (redirect to philosophers if already logged in)
  const PublicRoute = ({ children }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!DEV_MODE && user) {
      return <Navigate to="/philosophers" replace />;
    }
    
    return children;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      
      {/* Authentication routes - only accessible when not logged in */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage onLogin={handleLogin} />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage onLogin={handleLogin} />
          </PublicRoute>
        } 
      />
      
      {/* Protected routes - only accessible when logged in */}
      <Route 
        path="/philosophers" 
        element={
          <ProtectedRoute>
            <PhilosopherSelectionPage 
              onSelectPhilosopher={handleSelectPhilosopher}
              user={user}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dialogue" 
        element={
          <ProtectedRoute>
            {selectedPhilosopher ? (
              <DialoguePage 
                selectedPhilosopher={selectedPhilosopher}
                user={user}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/philosophers" replace />
            )}
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
