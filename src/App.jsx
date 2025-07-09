import { useState } from 'react';
import './App.css';
import AiResponsePanel from './components/AiResponsePanel';
import UserMessagePanel from './components/UserMessagePanel';
import ConversationInput from './components/ConversationInput';

const longTestResponse = `Welcome to the world of philosophy! This is a long test message to help you check the classic 16-bit scroll arrow.\n\nIn the ancient world, philosophers pondered the nature of existence, reality, and knowledge. From Socrates to Nietzsche, the dialogue continues.\n\nLet us consider the following: What is the meaning of life? Is morality objective or subjective? Do we have free will, or is everything determined?\n\nAs you scroll, you should see a classic pixel arrow at the bottom right, just like in old RPGs. This message is intentionally verbose to ensure it exceeds the visible area of the AI response box.\n\nKeep scrolling to see more! Philosophy is a journey, not a destination.\n\nThe arrow should disappear when you reach the end of this message. Enjoy testing!\n\n---\n\nNow, let's add even more text to ensure you can test the up and down arrows thoroughly.\n\nPhilosophy is not just about asking questions, but also about seeking answers, however elusive they may be.\n\nConsider the paradoxes of Zeno, the allegory of Plato's cave, and the categorical imperative of Kant.\n\nWhat is truth? What is beauty? What is justice?\n\nScroll down to reveal more lines.\n\nThe unexamined life is not worth living.\n\nTo be is to do. To do is to be. Do be do be do.\n\nEvery new line you see is another opportunity to test the scroll arrows.\n\nKeep going!\n\nAre you still scrolling?\n\nAlmost there...\n\nThis is the end of the test message. If you can see this, the scroll arrows are working perfectly!`;

function App() {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [aiResponse, setAiResponse] = useState(longTestResponse);

  const quickPills = [
    'What is the meaning of life?',
    'Do we have free will?',
    'What is consciousness?',
    'Is morality objective?'
  ];

  const handleSendMessage = () => {
    if (userInput.trim()) {
      const newMessage = {
        id: Date.now(),
        text: userInput,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      };
      setConversation([...conversation, newMessage]);
      setUserInput('');
      // Simulate AI response
      setTimeout(() => {
        setAiResponse(longTestResponse);
      }, 1000);
    }
  };

  const handlePillClick = (pillText) => {
    setUserInput(pillText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="dialogue-game">
      <AiResponsePanel aiResponse={aiResponse} />
      <UserMessagePanel conversation={conversation} />
      <ConversationInput
        userInput={userInput}
        setUserInput={setUserInput}
        handleSendMessage={handleSendMessage}
        quickPills={quickPills}
        handlePillClick={handlePillClick}
        handleKeyPress={handleKeyPress}
      />
    </div>
  );
}

export default App;
