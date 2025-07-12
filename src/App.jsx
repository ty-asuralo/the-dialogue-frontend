import { useState } from 'react';
import './App.css';
import AiResponsePanel from './components/AiResponsePanel';
import UserMessagePanel from './components/UserMessagePanel';
import ConversationInput from './components/ConversationInput';
import Sidebar from './components/Sidebar';

const API_URL = "http://localhost:8000/chat";

const defaultAiResponse = `Greetings, seeker of wisdom. I am Friedrich Nietzsche, philosopher of the will to power and eternal recurrence. 

What profound questions stir within your soul today? Let us engage in a dialogue that challenges assumptions and awakens deeper understanding.

Ask me anything about existence, morality, truth, or the human condition. I speak not to comfort, but to provoke thought and illuminate the path of self-overcoming.`;

function App() {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [aiResponse, setAiResponse] = useState(defaultAiResponse);
  const [mode, setMode] = useState('classical');
  const [fontSize, setFontSize] = useState('mid');

  const quickPills = [
    'What is the meaning of life?',
    'Do we have free will?',
    'What is consciousness?',
    'Is morality objective?'
  ];

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      const newMessage = {
        id: Date.now(),
        text: userInput,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      };
      setConversation([...conversation, newMessage]);
      setUserInput('');
      setAiResponse(''); // Clear previous response for streaming

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: userInput,
            userId: 'david' // Use 'david' as the default user ID
          })
        });

        if (!response.body) {
          setAiResponse('Sorry, streaming is not supported by your browser.');
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let done = false;
        let fullText = '';

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            // Parse Server-Sent Events (SSE) format: lines starting with "data: "
            chunk.split('\n').forEach(line => {
              if (line.startsWith('data: ')) {
                const token = line.replace('data: ', '');
                if (token === '[END]') return;
                if (token.startsWith('[ERROR]')) {
                  setAiResponse(token);
                  done = true;
                  return;
                }
                fullText += token;
                setAiResponse(prev => prev + token);
              }
            });
          }
        }
      } catch (error) {
        setAiResponse('Sorry, there was an error connecting to the AI service.');
      }
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
    <div className="dialogue-app-layout">
      <Sidebar mode={mode} setMode={setMode} fontSize={fontSize} setFontSize={setFontSize} />
      <div className="dialogue-game">
        <AiResponsePanel aiResponse={aiResponse} mode={mode} fontSize={fontSize} />
        <UserMessagePanel conversation={conversation} mode={mode} fontSize={fontSize} />
        <ConversationInput
          userInput={userInput}
          setUserInput={setUserInput}
          handleSendMessage={handleSendMessage}
          quickPills={quickPills}
          handlePillClick={handlePillClick}
          handleKeyPress={handleKeyPress}
          mode={mode}
          fontSize={fontSize}
        />
      </div>
    </div>
  );
}

export default App;
