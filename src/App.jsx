import { useState, useRef } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [quickPills, setQuickPills] = useState([
    'What is the meaning of life?',
    'Do we have free will?',
    'What is consciousness?',
    'Is morality objective?'
  ]);
  const [mode, setMode] = useState('classical');
  const [fontSize, setFontSize] = useState('mid');
  const [pillsAnimating, setPillsAnimating] = useState(false);
  const animationTimeout = useRef(null);

  const handleSendMessage = async () => {
    console.log('handleSendMessage called, isLoading:', isLoading, 'userInput:', userInput.trim());
    if (userInput.trim() && !isLoading) {
      console.log('Setting isLoading to true');
      setIsLoading(true);
      
      // Fade out options immediately when user clicks send
      setPillsAnimating(true);
      
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
          setIsLoading(false);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let done = false;
        let currentResponse = '';
        let newOptions = [];
        let timeoutId = setTimeout(() => {
          console.log('Stream timeout - ending connection');
          done = true;
        }, 10000); // 10 second timeout

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value && value.length > 0) {
            const chunk = decoder.decode(value, { stream: true });
            // Parse Server-Sent Events (SSE) format: lines starting with "data: "
            chunk.split('\n').forEach(line => {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.replace('data: ', ''));
                  
                  switch (data.type) {
                    case 'emotion':
                      console.log('Nietzsche Emotion:', data.content);
                      break;
                    case 'response':
                      console.log('Response chunk:', data.content);
                      setAiResponse(prev => prev + data.content);
                      break;
                    case 'option':
                      console.log('Option chunk:', data.content);
                      newOptions.push(data.content);
                      if (newOptions.length === 4) {
                        setTimeout(() => {
                          setQuickPills(newOptions);
                          setPillsAnimating(false);
                        }, 250); // 250ms fade out, then fade in
                      }
                      break;
                    case 'end':
                      console.log('Received end signal');
                      done = true;
                      break;
                    default:
                      console.log('Unknown chunk type:', data.type);
                      break;
                  }
                } catch (e) {
                  // Handle non-JSON data (fallback)
                  const token = line.replace('data: ', '');
                  if (token && !token.startsWith('[')) {
                    setAiResponse(prev => prev + token);
                  }
                }
              }
            });
          }
        }
        
        clearTimeout(timeoutId); // Clear timeout when stream ends normally
      } catch (error) {
        setAiResponse('Sorry, there was an error connecting to the AI service.');
      } finally {
        console.log('Setting isLoading to false');
        setIsLoading(false);
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
        <AiResponsePanel aiResponse={aiResponse} isLoading={isLoading} mode={mode} fontSize={fontSize} />
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
          isLoading={isLoading}
          pillsAnimating={pillsAnimating}
        />
      </div>
    </div>
  );
}

export default App;
