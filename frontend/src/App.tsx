import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Send, Loader2, Sparkles, MessageSquare, User, Bot, ArrowRight } from 'lucide-react';

// --- Configuration ---
const API_BASE_URL = 'http://127.0.0.1:8000';

// --- Types ---
type Message = {
  id: number;
  sender: 'user' | 'bot';
  text: string;
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: "Hello! I'm your AI Marketing Strategist. \n\nI can help you qualify leads, research market trends, or draft outreach messages. How can I assist you today?"
      },
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const newMessage: Message = { id: Date.now(), sender: 'user', text: userMessage };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    const history = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_message: userMessage, history: history }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      const botResponse: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.bot_response || "I didn't quite catch that. Could you rephrase?"
      };

      setMessages((prev) => [...prev, botResponse]);

    } catch (err) {
      console.error("Chat API Error:", err);
      setError("Unable to connect to the marketing brain. Please double-check your connection.");
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: "Connection interruption. Please try again momentarily." }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-inter text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">

      {/* Header */}
      <header className="flex-none bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">AI Growth Assistant</h1>
              <p className="text-xs text-slate-500 font-medium">Powered by Gemini 1.5</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Online & Ready
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-grow overflow-y-auto p-4 sm:p-6 scroll-smooth">
        <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-4">

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`group flex items-end gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`flex-none w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${msg.sender === 'user'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-white border border-slate-200 text-emerald-600'
                  }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`relative max-w-[85%] sm:max-w-[75%] px-5 py-3.5 shadow-sm text-[15px] leading-relaxed ${msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm'
                    : 'bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-tl-sm'
                  }`}
              >
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className={`min-h-[1.2em] ${i > 0 ? 'mt-2' : ''}`}>{line}</p>
                ))}
              </div>
            </div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-full shadow-sm">
                <Bot className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-200 shadow-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}

          {/* Error Toast */}
          {error && (
            <div className="mx-auto bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm shadow-sm animate-fade-in-up">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-none p-4 bg-white border-t border-slate-200 sticky bottom-0 z-20">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about leads, strategy, or copy..."
                disabled={isLoading}
                className="w-full pl-5 pr-12 py-3.5 bg-slate-50 border-slate-200 border rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-800 placeholder:text-slate-400 disabled:opacity-60"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {/* Optional: Add clear button or voice icon here later */}
              </div>
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-3.5 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md ${!input.trim() || isLoading
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0'
                }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              AI Marketing Assistant • Confidential
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
