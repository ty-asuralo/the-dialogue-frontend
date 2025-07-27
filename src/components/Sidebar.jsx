import React, { useState } from 'react';
import '../App.css';
import logo from '../assets/logo.png';

const Sidebar = ({ mode, setMode, fontSize, setFontSize }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState('light');

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  const handleModeToggle = () => {
    setMode(mode === 'classical' ? 'read' : 'classical');
  };

  return (
    <div className={`sidebar${collapsed ? ' collapsed' : ''}`}> 
      <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        {collapsed ? <span role="img" aria-label="expand">▶</span> : <span role="img" aria-label="collapse">◀</span>}
      </button>
      {/* Only render sidebar content when not collapsed */}
      {!collapsed && (
        <>
          <div className="sidebar-header">
            <img src={logo} alt="Logo" className="sidebar-logo-img" />
          </div>
          <div className="sidebar-divider" />
          <div className="sidebar-content">
            <button className="sidebar-settings-btn" onClick={() => setShowModal(true)}>
              ⚙️ Settings
            </button>
          </div>
        </>
      )}
      {showModal && (
        <div className="sidebar-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sidebar-modal" onClick={e => e.stopPropagation()}>
            <div className="sidebar-modal-header">
              <span>Settings</span>
              <button className="sidebar-modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="sidebar-modal-content">
              <div className="sidebar-modal-section theme-row">
                <span className="theme-title">Theme:</span>
                <div className="theme-switch-container">
                  <span className={theme === 'light' ? 'theme-label active' : 'theme-label'}>Light</span>
                  <button className={`theme-switch${theme === 'dark' ? ' switched' : ''}`} onClick={handleThemeToggle} aria-label="Toggle theme">
                    <span className="theme-switch-knob" />
                  </button>
                  <span className={theme === 'dark' ? 'theme-label active' : 'theme-label'}>Dark</span>
                </div>
              </div>
              <div className="sidebar-modal-section mode-row">
                <span className="mode-title">Mode:</span>
                <div className="theme-switch-container">
                  <span className={mode === 'classical' ? 'theme-label active' : 'theme-label'}>Classical</span>
                  <button className={`theme-switch${mode === 'read' ? ' switched' : ''}`} onClick={handleModeToggle} aria-label="Toggle mode">
                    <span className="theme-switch-knob" />
                  </button>
                  <span className={mode === 'read' ? 'theme-label active read-friendly-label' : 'theme-label read-friendly-label'}>Read-friendly</span>
                </div>
              </div>
              <div className="sidebar-modal-section font-row">
                <span className="font-title">Font Size:</span>
                <div className="font-size-btn-group">
                  <button className={`font-size-btn${fontSize === 'small' ? ' selected' : ''}`} onClick={() => setFontSize('small')}>Small</button>
                  <button className={`font-size-btn${fontSize === 'mid' ? ' selected' : ''}`} onClick={() => setFontSize('mid')}>Mid</button>
                  <button className={`font-size-btn${fontSize === 'big' ? ' selected' : ''}`} onClick={() => setFontSize('big')}>Big</button>
                </div>
              </div>
              <div className="sidebar-modal-section">
                <label>Other settings...</label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 