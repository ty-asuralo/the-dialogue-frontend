import React, { useRef, useEffect, useState } from 'react';
import '../App.css';
import aiAvatar from '../assets/p-nietzsche-calm.png';

const SCROLL_LINE_PX = 18; // Approximate line height for pixel font

const AiResponsePanel = ({ aiResponse, mode, fontSize }) => {
  const messageRef = useRef(null);
  const responseContentRef = useRef(null);
  const [showArrowDown, setShowArrowDown] = useState(false);
  const [showArrowUp, setShowArrowUp] = useState(false);

  const checkScroll = () => {
    const el = messageRef.current;
    if (!el) return;
    setShowArrowDown(el.scrollHeight > el.clientHeight && el.scrollTop + el.clientHeight < el.scrollHeight - 2);
    setShowArrowUp(el.scrollTop > 2);
  };

  useEffect(() => {
    checkScroll();
    const el = messageRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    return () => el.removeEventListener('scroll', checkScroll);
  }, [aiResponse]);

  const handleArrowDownClick = (e) => {
    e && e.stopPropagation();
    const el = messageRef.current;
    if (!el) return;
    el.scrollBy({ top: SCROLL_LINE_PX, behavior: 'smooth' });
  };

  const handleArrowUpClick = (e) => {
    e && e.stopPropagation();
    const el = messageRef.current;
    if (!el) return;
    el.scrollBy({ top: -SCROLL_LINE_PX, behavior: 'smooth' });
  };

  // Keyboard support for up/down arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        handleArrowDownClick();
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        handleArrowUpClick();
        e.preventDefault();
      }
    };
    const node = responseContentRef.current;
    if (node) {
      node.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (node) node.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div className="panel-row ai-panel-row">
      <div className="ai-response-panel">
        <div
          className="response-content"
          style={{ position: 'relative' }}
          ref={responseContentRef}
          tabIndex={0}
        >
          <div
            className={`ai-message${mode === 'read' ? ' read-friendly-font' : ''} font-size-${fontSize}`}
            ref={messageRef}
          >
            <p>{aiResponse}</p>
          </div>
          {showArrowDown && (
            <button
              className="scroll-arrow-btn scroll-arrow-down"
              onClick={handleArrowDownClick}
              tabIndex={0}
              aria-label="Show more"
              type="button"
            >
              ▼
            </button>
          )}
          {showArrowUp && (
            <button
              className="scroll-arrow-btn scroll-arrow-up"
              onClick={handleArrowUpClick}
              tabIndex={0}
              aria-label="Scroll up"
              type="button"
            >
              ▲
            </button>
          )}
        </div>
      </div>
      <div className="avatar-outer ai-avatar-outer">
        <div className="avatar-group">
          <div className="avatar-circle">
            <img src={aiAvatar} alt="AI Avatar" />
          </div>
          <div className="avatar-name ai-avatar-name">Nietzsche</div>
        </div>
      </div>
    </div>
  );
};

export default AiResponsePanel; 