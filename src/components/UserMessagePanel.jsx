import React from 'react';
import '../App.css';
import userAvatar from '../assets/u-david.png';

const UserMessagePanel = ({ conversation }) => {
  const latestMessage = conversation.length > 0 ? conversation[conversation.length - 1].text : '';
  return (
    <div className="panel-row user-panel-row">
      <div className="avatar-outer user-avatar-outer">
        <div className="avatar-group">
          <div className="avatar-circle">
            <img src={userAvatar} alt="User Avatar" />
          </div>
          <div className="avatar-name user-avatar-name">David</div>
        </div>
      </div>
      <div className="user-message-panel">
        <div className="user-message-content">
          {latestMessage && (
            <span className="user-message-text">{latestMessage}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMessagePanel; 