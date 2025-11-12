import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react"; // Added Send icon for the button
import { v4 as uuidv4 } from 'uuid';

const CHATBOT_BACKEND_URL = 'http://localhost:5000/api/chatbot';

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        setMessages((prev) => [...prev, { sender: "bot", text: `Error from backend: ${data.error || 'Unknown error'}` }]);
      }
    } catch (error) {
      console.error("Network or API error:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: `Network error: Could not connect to the chatbot backend. Is it running? (${error.message})` }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[420px] bg-white shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden transform transition-all duration-300 ease-in-out">
      {/* Chat Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-5 py-3 shadow-md">
        <h3 className="font-extrabold text-lg tracking-wide">Company AI Assistant</h3>
        <button onClick={onClose} className="text-white hover:text-indigo-100 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-4 flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow-md break-words ${
                msg.sender === "user"
                  ? "bg-indigo-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
                {loading && msg.sender === "bot" && i === messages.length -1 ? (
                    <div className="flex items-center text-gray-600">
                        <span className="animate-pulse mr-2 text-lg leading-none">...</span> Typing
                    </div>
                ) : (
                    msg.text
                )}
                 {/* Optional: Add a small triangle for speech bubble effect */}
                {msg.sender === "user" && (
                    <div className="absolute right-0 bottom-0 w-3 h-3 bg-indigo-500 transform translate-x-1/2 translate-y-1/2 rotate-45 rounded-sm shadow-md"></div>
                )}
                {msg.sender === "bot" && (
                    <div className="absolute left-0 bottom-0 w-3 h-3 bg-white transform -translate-x-1/2 translate-y-1/2 rotate-45 rounded-sm shadow-md"></div>
                )}
            </div>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.sender !== "bot" && (
             <div className="mb-4 flex justify-start">
                 <div className="relative px-4 py-2 rounded-2xl bg-white text-gray-800 max-w-[75%] text-sm shadow-md rounded-bl-none">
                     <div className="flex items-center text-gray-600">
                         <span className="animate-pulse mr-2 text-lg leading-none">...</span> Typing
                     </div>
                     <div className="absolute left-0 bottom-0 w-3 h-3 bg-white transform -translate-x-1/2 translate-y-1/2 rotate-45 rounded-sm shadow-md"></div>
                 </div>
             </div>
         )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="flex items-center p-3 border-t border-gray-200 bg-gray-50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-2 text-sm rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 mr-2"
          placeholder={loading ? "Waiting for response..." : "Ask your question..."}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:bg-indigo-300 transition-all duration-200 flex items-center justify-center"
          disabled={loading || !input.trim()} // Disable if input is empty too
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;