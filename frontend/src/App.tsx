import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCw, Send, Loader2, MessageSquare } from 'lucide-react';

// Setup Tailwind CSS (assuming a build process handles this, but including the necessary imports/config structure)
// NOTE: For a single file to run on platforms like Canvas, standard React environment setup is assumed.

/**
 * Defines the structure for a single message in the chat history.
 * Role: 'user' or 'model' (AI)
 * parts: The content of the message
 */
interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// NOTE: Replace with your actual FastAPI backend URL when deploying.
// For local development, this is typically http://127.0.0.1:8000
const API_BASE_URL = 'http://127.0.0.0:8000'; // Placeholder - will fail without a running backend

/**
 * Main application component for the Lead Generation Chatbot.
 */
const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the chat window whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    setMessages([{ 
      role: 'model', 
      parts: [{ text: "Welcome! I'm here to understand your data engineering needs. To start, can you tell me a little about your current biggest technical challenge?" }] 
    }]);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare the history for the backend
      const historyPayload = messages.map(msg => ({ 
        role: msg.role, 
        parts: msg.parts.map(p => ({ text: p.text })) 
      }));
      
      const payload = {
        message: text,
        chat_history: historyPayload
      };
      
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse: ChatMessage = { role: 'model', parts: [{ text: data.response }] };
      
      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error("Error sending message to API:", error);
      const errorMessage: ChatMessage = { 
        role: 'model', 
        parts: [{ text: "I apologize, there was an issue connecting to the server. Please try again." }] 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);

  const handleSendClick = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
    }
  };

  const resetChat = () => {
      setMessages([{ 
        role: 'model', 
        parts: [{ text: "Chat history cleared. How can I help you scope your next data project?" }] 
      }]);
      setInput('');
  };

  /**
   * Renders a single chat bubble.
   */
  const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    const bgColor = isUser ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800';
    const alignment = isUser ? 'justify-end' : 'justify-start';
    const bubbleClass = isUser ? 'rounded-br-none' : 'rounded-tl-none';

    return (
      <div className={`flex w-full mt-2 ${alignment}`}>
        <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-md ${bgColor} ${bubbleClass}`}>
          {message.parts.map((part, index) => (
            <p key={index} className="text-sm font-inter">
              {part.text}
            </p>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-indigo-700 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6" />
            <h1 className="text-xl font-bold">Data Lead Bot</h1>
          </div>
          <button 
            onClick={resetChat} 
            className="p-2 rounded-full hover:bg-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            title="Start New Conversation"
            disabled={isLoading}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        
        {/* Chat Area */}
        <div 
          ref={chatContainerRef} 
          className="flex-grow p-4 overflow-y-auto space-y-4"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {messages.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))}
          {isLoading && (
             <div className="flex justify-start w-full mt-2">
                <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-md bg-gray-100 text-gray-800 rounded-tl-none">
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    <span className="text-sm font-inter">Thinking...</span>
                </div>
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <form onSubmit={handleSendClick} className="p-4 border-t border-gray-200 flex space-x-3">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;

