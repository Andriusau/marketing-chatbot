import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Send, Loader2, User, Bot, Zap, X } from 'lucide-react';

// --- Configuration ---
// The URL of your running FastAPI server. When deployed, change this to the live backend URL.
const API_BASE_URL = 'http://127.0.0.1:8000';

// --- Types ---
type Message = {
  id: number;
  sender: 'user' | 'bot';
  text: string;
};

// --- Main Component ---
const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting message
  useEffect(() => {
    setMessages([
      { 
        id: Date.now(), 
        sender: 'bot', 
        text: "👋 Hello! I'm your AI Marketing Assistant. I'm here to help you find the best solution for your needs. What can I help you with today?"
      },
    ]);
  }, []);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(scrollToBottom, [messages]);

  // Function to simulate API call to the FastAPI backend
  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const newMessage: Message = { id: Date.now(), sender: 'user', text: userMessage };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Prepare message history for the backend
    const history = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_message: userMessage, history: history }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      const botResponse: Message = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: data.bot_response || "I'm sorry, I encountered an issue processing that request." 
      };

      setMessages((prev) => [...prev, botResponse]);

    } catch (err) {
      console.error("Chat API Error:", err);
      setError("❌ Error: Could not reach the backend or Gemini API. Please check your FastAPI server and API key.");
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: "Service temporarily unavailable. Please try again later." }]);

    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);

  // Handler for input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // --- UI Rendering ---

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="w-full bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-start">
          <Zap className="w-6 h-6 text-indigo-600 mr-2" />
          <h1 className="text-xl font-bold text-gray-800">AI Lead Bot</h1>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-grow p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto flex flex-col space-y-4">
          
          {/* Messages */}
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`flex items-start max-w-xs sm:max-w-md ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Sender Icon */}
                <div className={`p-2 rounded-full ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-600 ml-2' : 'bg-green-100 text-green-600 mr-2'}`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div 
                  className={`p-3 rounded-xl shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                  } break-words`}
                >
                  {msg.text.split('\n').map((line, index) => (
                    <p key={index} className="whitespace-pre-wrap">{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center p-3 bg-white text-gray-600 rounded-xl rounded-tl-none border border-gray-200 shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm">Bot is thinking...</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-xl flex items-center justify-between shadow-md">
              <p className="flex items-center">
                <X className="w-5 h-5 mr-2" />
                {error}
              </p>
              <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Form */}
      <footer className="w-full bg-white border-t border-gray-200 p-4 sticky bottom-0 z-10">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI marketing assistant..."
              disabled={isLoading}
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 transition duration-150"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition duration-150 shadow-md"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};

// CRITICAL: This line ensures the component can be imported by index.tsx
export default App;
