import React from 'react';
import '../App.css';

const ConversationInput = ({ userInput, setUserInput, handleSendMessage, quickPills, handlePillClick, handleKeyPress, mode, fontSize, isLoading, pillsAnimating }) => (
  <div className="panel-row input-panel-row">
    <div className="avatar-outer input-avatar-outer">
      <div className="avatar-group">
        <div className="avatar-circle">
          {/* Empty space to match avatar width */}
        </div>
        <div className="avatar-name input-avatar-name">Input</div>
      </div>
    </div>
    <div className={`input-area${mode === 'read' ? ' read-friendly-font' : ''} font-size-${fontSize}`}>
      <div className={`input-container${mode === 'read' ? ' read-friendly-font' : ''} font-size-${fontSize}`}>
        <textarea
          className={`${mode === 'read' ? 'read-friendly-font' : ''} font-size-${fontSize}`}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          rows="3"
        />
        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={!userInput.trim() || isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
      <div className={`pills-container${pillsAnimating ? ' pills-animating' : ''}`}>
        {quickPills.map((pill, index) => (
          <button
            key={index}
            className="pill"
            onClick={() => handlePillClick(pill)}
          >
            {pill}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default ConversationInput; 