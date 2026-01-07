import React, { useState, useEffect, useRef } from "react";
import { X, Send, Bot, User } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { API_BASE_URL } from '../../api';

const CHATBOT_BACKEND_URL = `${API_BASE_URL}/api/chatbot`;

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! 👋 I’m your Company Insights Assistant. Ask me about hiring trends, FAQs, or interview patterns.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(uuidv4());

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(CHATBOT_BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: `Error: ${data.error || 'Something went wrong'}` }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Network error. Please check your connection." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] md:w-96 h-[500px] bg-white shadow-2xl rounded-3xl flex flex-col z-[100] overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-4 duration-300">
      
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <Bot className="text-white w-6 h-6" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-indigo-600 rounded-full"></div>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-tight">AI Assistant</h3>
            <p className="text-indigo-100 text-[10px] font-medium uppercase tracking-widest">Always Online</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar for mobile/professional look */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
              msg.sender === "user" ? "bg-indigo-100 text-indigo-600" : "bg-white border border-slate-200 text-slate-400"
            }`}>
              {msg.sender === "user" ? <User size={12}/> : <Bot size={12}/>}
            </div>

            <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.sender === "user"
                ? "bg-indigo-600 text-white rounded-br-none"
                : "bg-white text-slate-700 border border-slate-200 rounded-bl-none"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-end gap-2">
            <div className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center">
              <Bot size={12}/>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            placeholder={loading ? "AI is thinking..." : "Ask me anything..."}
            className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-400 font-medium"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`absolute right-1.5 p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
              !input.trim() || loading 
              ? "text-slate-300 bg-transparent" 
              : "text-white bg-indigo-600 shadow-md shadow-indigo-200 active:scale-90"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
          Powered by Company Insights AI
        </p>
      </div>
    </div>
  );
};

export default Chatbot;