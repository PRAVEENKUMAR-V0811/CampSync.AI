import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from './ChatMessage';
import InterviewSettings from './InterviewSettings';
import { Send, Mic, Keyboard, X, Info, Award } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 
import { API_BASE_URL } from '../../api';
import bgimage from '../../assets/MeetCampSync.png';

const BACKEND_URL = `${API_BASE_URL}/api/interview`;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
}

const AIMockInterview = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(uuidv4());
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [interviewContext, setInterviewContext] = useState({
    role: '',
    level: ''
  });
  const [isListening, setIsListening] = useState(false);
  const [useVoiceInput, setUseVoiceInput] = useState(false);

  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInput(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: `Voice input error: ${event.error}`, id: uuidv4() }
      ]);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognition.stop();
    };
  }, [input, useVoiceInput]);

  const startListening = () => {
    if (recognition) {
      setInput('');
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleStartInterview = async (role, level) => {
    setInterviewContext({ role, level });
    setInterviewStarted(true);
    setInterviewEnded(false);
    setMessages([]);
    setSessionId(uuidv4());
    setInput('');

    const initialBotMessage = {
      type: 'bot',
      text: `Starting interview for a ${level} ${role} role...`,
      id: uuidv4()
    };
    setMessages([initialBotMessage]);
    setLoading(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'start_interview',
          sessionId,
          context: { role, level }
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: data.response, id: uuidv4() }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text: `Error from backend: ${data.error || 'Unknown error'}`,
            id: uuidv4()
          }
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: `Network error: Could not connect to server.`, id: uuidv4() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || interviewEnded) return;

    if (isListening) stopListening();

    const userMessage = input;
    setMessages((prev) => [
      ...prev,
      { type: 'user', text: userMessage, id: uuidv4() }
    ]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          context: interviewContext
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: data.response, id: uuidv4() }
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndInterviewConfirmation = () => {
    setInterviewEnded(true);
    setMessages((prev) => [
      ...prev,
      {
        type: 'bot',
        text: 'Interview ended. Choose an option below.',
        id: uuidv4()
      }
    ]);
  };

  const resetInterview = () => {
    setInterviewStarted(false);
    setInterviewEnded(false);
    setMessages([]);
    setLoading(false);
    setInput('');
    stopListening();
  };

  const handleReturnToHome = () => {
    navigate('/dashboard');
    resetInterview();
  };

  return (
    // Added pt-28 to ensure content is below the fixed header
    <div className="min-h-screen bg-slate-50 pt-28 pb-10 px-4 flex flex-col items-center justify-start overflow-x-hidden">
      {!interviewStarted && (
        <div className="w-full max-w-lg animate-in fade-in zoom-in duration-300">
          <InterviewSettings onStartInterview={handleStartInterview} />
        </div>
      )}

      {interviewStarted && (
        <div className="w-full max-w-7xl bg-white rounded-[2.5rem] shadow-2xl flex h-[80vh] md:h-[85vh] overflow-hidden border border-gray-100 relative">
          
          {/* Main Chat Panel */}
          <div className="flex-1 lg:flex-[2] flex flex-col relative bg-white">
            
            {/* Header */}
            <header className="px-6 py-5 border-b bg-gray-900 text-white flex justify-between items-center shadow-lg z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl font-black">
                  C
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-bold tracking-tight">AI Mock Interview</h1>
                  <div className="flex items-center gap-2 text-[10px] md:text-xs text-indigo-300 font-bold uppercase tracking-widest">
                    <span>{interviewContext.role}</span>
                    <span className="text-gray-600">•</span>
                    <span>{interviewContext.level}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleEndInterviewConfirmation}
                className="cursor-pointer px-4 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white text-xs font-bold rounded-xl transition-all border border-rose-500/20 disabled:opacity-30 active:scale-95"
                disabled={loading || interviewEnded}
              >
                End Session
              </button>
            </header>

            {/* Chat Area */}
            <div 
              ref={chatMessagesRef} 
              className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 bg-slate-50/50 scroll-smooth custom-scrollbar"
            >
              {messages.map((msg, index) => (
                <ChatMessage
                  key={msg.id}
                  type={msg.type}
                  text={msg.text}
                  isLastBotMessage={msg.type === 'bot' && index === messages.length - 1 && loading}
                  isUserMessage={msg.type === 'user'}
                />
              ))}
              {loading && messages.length > 0 && messages[messages.length - 1]?.type === 'user' && (
                <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm animate-pulse ml-4">
                   AI is analyzing your response...
                </div>
              )}
              {isListening && input && (
                <div className="bg-white/80 p-4 rounded-2xl border border-indigo-100 italic text-gray-400 text-sm ml-auto max-w-[80%] shadow-sm animate-pulse">
                  Listening: {input}
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 md:p-6 border-t border-gray-100 bg-white flex items-center gap-3 md:gap-4">
              {recognition && (
                <button
                  type="button"
                  onClick={() => {
                    setUseVoiceInput(!useVoiceInput);
                    if (isListening) stopListening();
                    setInput('');
                  }}
                  className="cursor-pointer p-3 md:p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-90"
                  title={useVoiceInput ? 'Switch to text input' : 'Switch to voice input'}
                  disabled={loading || interviewEnded}
                >
                  {useVoiceInput ? <Keyboard className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}

              {useVoiceInput && recognition ? (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`cursor-pointer flex-1 p-3 md:p-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all
                    ${isListening 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                    } disabled:opacity-50`}
                  disabled={loading || interviewEnded}
                >
                  {isListening ? (
                    <> <div className="w-2 h-2 bg-white rounded-full animate-ping" /> Stop Recording </>
                  ) : (
                    <> <Mic className="w-5 h-5" /> Speak Answer </>
                  )}
                </button>
              ) : (
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={loading ? 'AI is thinking...' : 'Type your answer here...'}
                  className="flex-1 p-3 md:p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-gray-700 placeholder:text-gray-400"
                  disabled={loading || interviewEnded}
                />
              )}

              <button
                type="submit"
                className="cursor-pointer p-3 md:p-4 bg-gray-900 text-white rounded-2xl hover:bg-indigo-600 active:scale-90 transition-all disabled:bg-slate-200 disabled:text-slate-400"
                disabled={loading || !input.trim() || interviewEnded}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            {/* End Interview Overlay */}
            {interviewEnded && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-8 z-50 animate-in fade-in duration-300">
                <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100 text-center max-w-md w-full">
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                    <Award />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Session Finished</h2>
                  <p className="text-gray-500 mb-8">What would you like to do next?</p>
                  
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleStartInterview(interviewContext.role, interviewContext.level)}
                      className="cursor-pointer w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg"
                    >
                      Restart Interview
                    </button>
                    <button
                      onClick={handleReturnToHome}
                      className="cursor-pointer w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                    >
                      Return to Dashboard
                    </button>
                    <button
                      onClick={resetInterview}
                      className="cursor-pointer w-full py-4 text-rose-500 font-bold hover:bg-rose-50 rounded-2xl transition-all"
                    >
                      Exit Mock Interview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Promotion Panel (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-col w-[380px] bg-slate-50 border-l border-gray-100">
            <header className="p-6 border-b border-gray-200 bg-white">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <Info size={14} /> Recommended for you
              </h2>
            </header>
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
              <div className="relative group cursor-pointer mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <img
                  src={bgimage}
                  alt="Promotion"
                  className="relative max-w-full h-auto rounded-xl shadow-xl transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Upgrade to Pro</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Realistic simulations, detailed performance reports, and AI-powered career coaching.
              </p>
              <button className="cursor-pointer w-full py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMockInterview;