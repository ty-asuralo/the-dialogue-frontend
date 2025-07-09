import React from 'react';
import '../App.css';

const ConversationInput = ({ userInput, setUserInput, handleSendMessage, quickPills, handlePillClick, handleKeyPress }) => (
  <div className="input-area">
    <div className="input-container">
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message here..."
        rows="3"
      />
      <button
        className="send-button"
        onClick={handleSendMessage}
        disabled={!userInput.trim()}
      >
        Send
      </button>
    </div>
    <div className="pills-container">
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
);

export default ConversationInput; 