// import React, { useState, useEffect, useRef } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import ChatMessage from './ChatMessage';
// import InterviewSettings from './InterviewSettings';

// // --- IMPORTANT: Update this URL to match your Node.js backend URL ---
// const BACKEND_URL = 'http://localhost:5000/api/interview';

// function AIMockInterview() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [sessionId, setSessionId] = useState(uuidv4()); // Generate a new session ID
//   const [interviewStarted, setInterviewStarted] = useState(false);
//   const [interviewContext, setInterviewContext] = useState({
//     role: '',
//     level: ''
//   });

//   const messagesEndRef = useRef(null);

//   // Scroll to the bottom of the chat on new messages
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   // Function to start the interview
//   const handleStartInterview = async (role, level) => {
//     setInterviewContext({ role, level });
//     setInterviewStarted(true);
//     setMessages([{ type: 'bot', text: `Starting interview for a ${level} ${role} role...` }]);
//     setLoading(true);

//     try {
//       const response = await fetch(BACKEND_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           message: "start_interview",
//           sessionId,
//           context: { role, level }
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setMessages((prev) => [...prev, { type: 'bot', text: data.response }]);
//       } else {
//         setMessages((prev) => [...prev, { type: 'bot', text: `Error from backend: ${data.error || 'Unknown error'}` }]);
//       }
//     } catch (error) {
//       console.error("Network or API error:", error);
//       setMessages((prev) => [...prev, { type: 'bot', text: `Network error: Could not connect to the backend server. Is it running? (${error.message})` }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to handle user's answer submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim() || loading) return;

//     const userMessage = input;
//     setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
//     setInput('');
//     setLoading(true);

//     try {
//       const response = await fetch(BACKEND_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           message: userMessage,
//           sessionId,
//           context: interviewContext
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setMessages((prev) => [...prev, { type: 'bot', text: data.response }]);
//       } else {
//         setMessages((prev) => [...prev, { type: 'bot', text: `Error from backend: ${data.error || 'Unknown error'}` }]);
//       }
//     } catch (error) {
//       console.error("Network or API error:", error);
//       setMessages((prev) => [...prev, { type: 'bot', text: `Network error: Could not connect to the backend server. Is it running? (${error.message})` }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Conditional rendering based on whether the interview has started
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
//       {/* If interview hasn't started, show settings */}
//       {!interviewStarted && (
//         <InterviewSettings onStartInterview={handleStartInterview} />
//       )}

//       {/* If interview has started, show chat interface */}
//       {interviewStarted && (
//         <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl flex flex-col h-[80vh]">
//           <header className="p-4 border-b bg-indigo-600 text-white rounded-t-lg">
//             <h1 className="text-xl font-bold">AI Mock Interview</h1>
//             <p className="text-sm">Role: {interviewContext.role}, Level: {interviewContext.level}</p>
//           </header>

//           <div className="flex-1 p-4 overflow-y-auto space-y-4">
//             {messages.map((msg, index) => (
//               <ChatMessage key={index} type={msg.type} text={msg.text} />
//             ))}
//             {loading && <ChatMessage type="bot" text="Thinking..." />}
//             <div ref={messagesEndRef} />
//           </div>

//           <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type your answer here..."
//               className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               disabled={loading}
//             />
//             <button
//               type="submit"
//               className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
//               disabled={loading}
//             >
//               Send
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AIMockInterview;

// import React, { useState, useEffect, useRef } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import ChatMessage from './ChatMessage';
// import InterviewSettings from './InterviewSettings';
// import { Send } from 'lucide-react'; // Import send icon

// // --- IMPORTANT: Update this URL to match your Node.js backend URL ---
// const BACKEND_URL = 'http://localhost:5000/api/interview';

// function AIMockInterview() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [sessionId, setSessionId] = useState(uuidv4());
//   const [interviewStarted, setInterviewStarted] = useState(false);
//   const [interviewContext, setInterviewContext] = useState({
//     role: '',
//     level: ''
//   });

//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleStartInterview = async (role, level) => {
//     setInterviewContext({ role, level });
//     setInterviewStarted(true);
//     const initialBotMessage = { type: 'bot', text: `Starting interview for a ${level} ${role} role...`, id: uuidv4() };
//     setMessages([initialBotMessage]); // Set initial message
//     setLoading(true);

//     try {
//       const response = await fetch(BACKEND_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           message: "start_interview",
//           sessionId,
//           context: { role, level }
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setMessages((prev) => [...prev, { type: 'bot', text: data.response, id: uuidv4() }]);
//       } else {
//         setMessages((prev) => [...prev, { type: 'bot', text: `Error from backend: ${data.error || 'Unknown error'}`, id: uuidv4() }]);
//       }
//     } catch (error) {
//       console.error("Network or API error:", error);
//       setMessages((prev) => [...prev, { type: 'bot', text: `Network error: Could not connect to the backend server. Is it running? (${error.message})`, id: uuidv4() }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim() || loading) return;

//     const userMessage = input;
//     setMessages((prev) => [...prev, { type: 'user', text: userMessage, id: uuidv4() }]);
//     setInput('');
//     setLoading(true);

//     try {
//       const response = await fetch(BACKEND_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           message: userMessage,
//           sessionId,
//           context: interviewContext
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setMessages((prev) => [...prev, { type: 'bot', text: data.response, id: uuidv4() }]);
//       } else {
//         setMessages((prev) => [...prev, { type: 'bot', text: `Error from backend: ${data.error || 'Unknown error'}`, id: uuidv4() }]);
//       }
//     } catch (error) {
//       console.error("Network or API error:", error);
//       setMessages((prev) => [...prev, { type: 'bot', text: `Network error: Could not connect to the backend server. Is it running? (${error.message})`, id: uuidv4() }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center p-4">
//       {!interviewStarted && (
//         <InterviewSettings onStartInterview={handleStartInterview} />
//       )}

//       {interviewStarted && (
//         <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col h-[90vh] overflow-hidden transform transition-all duration-300 ease-in-out">
//           <header className="p-5 border-b bg-gradient-to-r from-indigo-700 to-purple-800 text-white rounded-t-2xl shadow-md">
//             <h1 className="text-2xl font-extrabold tracking-wide">AI Mock Interview</h1>
//             <p className="text-sm opacity-90 mt-1">Role: <span className="font-semibold">{interviewContext.role}</span>, Level: <span className="font-semibold">{interviewContext.level}</span></p>
//           </header>

//           <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-gray-50 custom-scrollbar"> {/* Added custom-scrollbar class */}
//             {messages.map((msg, index) => (
//               <ChatMessage
//                 key={msg.id} // Use unique ID for key
//                 type={msg.type}
//                 text={msg.text}
//                 isLastBotMessage={msg.type === 'bot' && index === messages.length - 1 && loading} // Pass prop for typing effect
//               />
//             ))}
//             {loading && messages.length > 0 && messages[messages.length - 1]?.type === 'user' && (
//                 <ChatMessage type="bot" text="Typing..." isTyping={true} /> // Explicit typing indicator
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white flex items-center gap-3">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder={loading ? "Waiting for response..." : "Type your answer here..."}
//               className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-800"
//               disabled={loading}
//             />
//             <button
//               type="submit"
//               className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 transition-colors flex items-center justify-center"
//               disabled={loading || !input.trim()} // Also disable if input is empty
//               aria-label="Send message"
//             >
//               <Send className="w-5 h-5" />
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AIMockInterview;


// import React, { useState, useEffect, useRef } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import ChatMessage from './ChatMessage';
// import InterviewSettings from './InterviewSettings';
// import { Send, MessageCircle } from 'lucide-react'; // Added MessageCircle for feedback section
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

// // --- IMPORTANT: Update this URL to match your Node.js backend URL ---
// const BACKEND_URL = 'http://localhost:5000/api/interview';
// const FEEDBACK_BACKEND_URL = 'http://localhost:5000/api/feedback'; // New endpoint for feedback

// function AIMockInterview() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [sessionId, setSessionId] = useState(uuidv4());
//   const [interviewStarted, setInterviewStarted] = useState(false);
//   const [interviewEnded, setInterviewEnded] = useState(false);
//   const [interviewContext, setInterviewContext] = useState({
//     role: '',
//     level: ''
//   });
//   const [feedback, setFeedback] = useState(null);
//   const [generatingFeedback, setGeneratingFeedback] = useState(false);

//   const chatMessagesRef = useRef(null); // Ref for the chat messages container itself

//   // Scroll to the bottom of the chat on new messages
//   useEffect(() => {
//     if (chatMessagesRef.current) {
//       chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
//     }
//   }, [messages, feedback]); // Also scroll on feedback updates

//   const handleStartInterview = async (role, level) => {
//     setInterviewContext({ role, level });
//     setInterviewStarted(true);
//     setInterviewEnded(false);
//     setFeedback(null); // Clear previous feedback
//     setMessages([]); // Clear previous messages
//     setSessionId(uuidv4()); // Start a new session

//     const initialBotMessage = { type: 'bot', text: `Starting interview for a ${level} ${role} role...`, id: uuidv4() };
//     setMessages([initialBotMessage]);
//     setLoading(true);

//     try {
//       const response = await fetch(BACKEND_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           message: "start_interview",
//           sessionId,
//           context: { role, level }
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setMessages((prev) => [...prev, { type: 'bot', text: data.response, id: uuidv4() }]);
//       } else {
//         setMessages((prev) => [...prev, { type: 'bot', text: `Error from backend: ${data.error || 'Unknown error'}`, id: uuidv4() }]);
//       }
//     } catch (error) {
//       console.error("Network or API error:", error);
//       setMessages((prev) => [...prev, { type: 'bot', text: `Network error: Could not connect to the backend server. Is it running? (${error.message})`, id: uuidv4() }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim() || loading || interviewEnded) return;

//     const userMessage = input;
//     setMessages((prev) => [...prev, { type: 'user', text: userMessage, id: uuidv4() }]);
//     setInput('');
//     setLoading(true);

//     try {
//       const response = await fetch(BACKEND_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           message: userMessage,
//           sessionId,
//           context: interviewContext
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setMessages((prev) => [...prev, { type: 'bot', text: data.response, id: uuidv4() }]);
//       } else {
//         setMessages((prev) => [...prev, { type: 'bot', text: `Error from backend: ${data.error || 'Unknown error'}`, id: uuidv4() }]);
//       }
//     } catch (error) {
//       console.error("Network or API error:", error);
//       setMessages((prev) => [...prev, { type: 'bot', text: `Network error: Could not connect to the backend server. Is it running? (${error.message})`, id: uuidv4() }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEndInterview = async () => {
//     setLoading(true);
//     setGeneratingFeedback(true);
//     setInterviewEnded(true);
//     // Add a final bot message indicating interview ended
//     setMessages((prev) => [...prev, { type: 'bot', text: "Interview ended. Generating your personalized feedback...", id: uuidv4() }]);

//     try {
//       const response = await fetch(FEEDBACK_BACKEND_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           sessionId: sessionId,
//           context: interviewContext,
//           // You might send the entire conversation history if needed by the backend
//           // conversation: messages.map(msg => ({ sender: msg.type, text: msg.text }))
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setFeedback(data.feedback); // Assume backend returns { feedback: "..." }
//         setMessages((prev) => [...prev, { type: 'bot', text: "Feedback generated! Please see the right panel.", id: uuidv4() }]);
//       } else {
//         setFeedback(`Error generating feedback: ${data.error || 'Unknown error'}`);
//         setMessages((prev) => [...prev, { type: 'bot', text: `Error generating feedback: ${data.error || 'Unknown error'}`, id: uuidv4() }]);
//       }
//     } catch (error) {
//       console.error("Feedback API error:", error);
//       setFeedback(`Network error generating feedback: ${error.message}`);
//       setMessages((prev) => [...prev, { type: 'bot', text: `Network error generating feedback: ${error.message}`, id: uuidv4() }]);
//     } finally {
//       setLoading(false);
//       setGeneratingFeedback(false);
//     }
//   };


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center p-4">
//       {!interviewStarted && (
//         <InterviewSettings onStartInterview={handleStartInterview} />
//       )}

//       {interviewStarted && (
//         <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl flex h-[90vh] overflow-hidden transform transition-all duration-300 ease-in-out">
//           {/* Left Panel: Chat Interface (2/3 width) */}
//           <div className="flex-2 flex flex-col border-r border-gray-200"> {/* flex-2 gives 2/3 width */}
//             <header className="p-5 border-b bg-gradient-to-r from-indigo-700 to-purple-800 text-white rounded-tl-2xl shadow-md flex justify-between items-center">
//               <div>
//                 <h1 className="text-2xl font-extrabold tracking-wide">AI Mock Interview</h1>
//                 <p className="text-sm opacity-90 mt-1">Role: <span className="font-semibold">{interviewContext.role}</span>, Level: <span className="font-semibold">{interviewContext.level}</span></p>
//               </div>
//               <button
//                 onClick={handleEndInterview}
//                 className="ml-4 px-5 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
//                 disabled={loading || interviewEnded}
//               >
//                 {generatingFeedback ? "Ending..." : "End Interview"}
//               </button>
//             </header>

//             <div ref={chatMessagesRef} className="flex-1 p-6 overflow-y-auto space-y-5 bg-gray-50 custom-scrollbar">
//               {messages.map((msg, index) => (
//                 <ChatMessage
//                   key={msg.id}
//                   type={msg.type}
//                   text={msg.text}
//                   isLastBotMessage={msg.type === 'bot' && index === messages.length - 1 && loading}
//                   // New prop to indicate user/bot message for correct alignment in ChatMessage
//                   isUserMessage={msg.type === 'user'}
//                 />
//               ))}
//               {loading && messages.length > 0 && messages[messages.length - 1]?.type === 'user' && (
//                   <ChatMessage type="bot" text="Typing..." isTyping={true} isUserMessage={false} />
//               )}
//             </div>

//             <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white flex items-center gap-3">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder={loading ? "Waiting for response..." : "Type your answer here..."}
//                 className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-800"
//                 disabled={loading || interviewEnded}
//               />
//               <button
//                 type="submit"
//                 className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 transition-colors flex items-center justify-center"
//                 disabled={loading || !input.trim() || interviewEnded}
//                 aria-label="Send message"
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//             </form>
//           </div>

//           {/* Right Panel: Image Display / Feedback (1/3 width) */}
//           <div className="flex-1 flex flex-col bg-gray-100 rounded-br-2xl"> {/* flex-1 gives 1/3 width */}
//             <header className="p-5 border-b border-gray-200 bg-gray-200 text-gray-800 rounded-tr-2xl shadow-sm flex items-center">
//               <MessageCircle className="w-6 h-6 mr-3 text-purple-700" />
//               <h2 className="text-xl font-bold">Interview Feedback</h2>
//             </header>
//             <div className="flex-1 p-6 overflow-y-auto custom-scrollbar text-gray-700">
//               {interviewEnded && !generatingFeedback && feedback ? (
//                 <div className="prose max-w-none"> {/* Using 'prose' for markdown styling */}
//                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
//                     {feedback}
//                   </ReactMarkdown>
//                 </div>
//               ) : interviewEnded && generatingFeedback ? (
//                 <p className="text-center text-gray-500 italic flex items-center justify-center">
//                   <span className="animate-spin h-5 w-5 mr-3 text-purple-500">
//                       <svg className="h-full w-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                   </span>
//                   Generating detailed feedback...
//                 </p>
//               ) : (
//                 <p className="text-center text-gray-500 italic">
//                   Feedback will appear here after the interview ends.
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AIMockInterview;

import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from './ChatMessage';
import InterviewSettings from './InterviewSettings';
import { Send, Mic, Keyboard, X } from 'lucide-react'; // Added X for close button
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

// --- IMPORTANT: Update this URL to match your Node.js backend URL ---
const BACKEND_URL = 'http://localhost:5000/api/interview';
// const FEEDBACK_BACKEND_URL = 'http://localhost:5000/api/feedback'; // Feedback API removed per request

// Initialize SpeechRecognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
}

// ✅ FIX STARTS HERE — added function wrapper
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
      if (input.trim() && useVoiceInput) {
        // handleSubmit(new Event('submit'));
      }
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
      console.error('Network or API error:', error);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: `Network error: Could not connect to the backend server. Is it running? (${error.message})`,
          id: uuidv4()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || interviewEnded) return;

    if (isListening) {
      stopListening();
    }

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
      console.error('Network or API error:', error);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: `Network error: Could not connect to the backend server. Is it running? (${error.message})`,
          id: uuidv4()
        }
      ]);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center p-4">
      {!interviewStarted && (
        <InterviewSettings onStartInterview={handleStartInterview} />
      )}

      {interviewStarted && (
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl flex h-[90vh] overflow-hidden transform transition-all duration-300 ease-in-out">
          {/* Left Panel */}
          <div className="flex-2 flex flex-col border-r border-gray-200 relative">
            <header className="p-5 border-b bg-gradient-to-r from-indigo-700 to-purple-800 text-white rounded-tl-2xl shadow-md flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-extrabold tracking-wide">AI Mock Interview</h1>
                <p className="text-sm opacity-90 mt-1">
                  Role: <span className="font-semibold">{interviewContext.role}</span>, Level:{' '}
                  <span className="font-semibold">{interviewContext.level}</span>
                </p>
              </div>
              <button
                onClick={handleEndInterviewConfirmation}
                className="cursor-pointer ml-4 px-5 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                disabled={loading || interviewEnded}
              >
                End Interview
              </button>
            </header>

            <div ref={chatMessagesRef} className="flex-1 p-6 overflow-y-auto space-y-5 bg-gray-50 custom-scrollbar">
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
                <ChatMessage type="bot" text="Typing..." isTyping={true} isUserMessage={false} />
              )}
              {isListening && input && (
                <ChatMessage type="user" text={`... ${input}`} isTyping={true} isUserMessage={true} />
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white flex items-center gap-3">
              {recognition && (
                <button
                  type="button"
                  onClick={() => {
                    setUseVoiceInput(!useVoiceInput);
                    if (isListening) stopListening();
                    setInput('');
                  }}
                  className="cursor-pointer p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
                  aria-label={useVoiceInput ? 'Switch to text input' : 'Switch to voice input'}
                  disabled={loading || interviewEnded}
                >
                  {useVoiceInput ? <Keyboard className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}

              {useVoiceInput && recognition ? (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`cursor-pointer flex-1 p-3 rounded-full flex items-center justify-center gap-2
                    ${isListening ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 transition-colors`}
                  disabled={loading || interviewEnded}
                >
                  {isListening ? (
                    <>
                      <Mic className="w-5 h-5 animate-pulse" /> Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" /> Speak Your Answer
                    </>
                  )}
                </button>
              ) : (
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={loading ? 'Waiting for response...' : 'Type your answer here...'}
                  className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-800"
                  disabled={loading || interviewEnded}
                />
              )}

              <button
                type="submit"
                className="cursor-pointer p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 transition-colors flex items-center justify-center"
                disabled={loading || !input.trim() || interviewEnded}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            {interviewEnded && (
              <div className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-tl-2xl rounded-bl-2xl z-20">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Interview Concluded!</h2>
                <p className="text-lg text-gray-700 mb-8 text-center">What would you like to do next?</p>
                <div className="flex flex-col space-y-4 w-full max-w-sm">
                  <button
                    onClick={resetInterview}
                    className="cursor-pointer w-full py-4 px-6 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300"
                  >
                    End Interview
                  </button>
                  <button
                    onClick={() => handleStartInterview(interviewContext.role, interviewContext.level)}
                    className="cursor-pointer w-full py-4 px-6 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300"
                  >
                    Start a New Interview
                  </button>
                  <button
                    onClick={handleReturnToHome}
                    className="cursor-pointer w-full py-4 px-6 bg-gray-600 text-white font-bold rounded-xl shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
                  >
                    Return to Home Page
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="flex-1 flex flex-col bg-gray-100 rounded-br-2xl">
            <header className="p-5 border-b border-gray-200 bg-gray-200 text-gray-800 rounded-tr-2xl shadow-sm flex items-center justify-center">
              <h2 className="text-xl font-bold">Product Promotion</h2>
            </header>
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-gray-700">
              <img
                src="https://via.placeholder.com/400x300/a78bfa/ffffff?text=Interview+Pro+AI"
                alt="Product Promotion"
                className="max-w-full h-auto rounded-lg shadow-lg mb-4"
              />
              <p className="text-center text-gray-600 text-lg">
                Boost your career with **Interview Pro AI**! <br /> Realistic simulations, instant feedback, and tailored coaching.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// ✅ FIX ENDS HERE

export default AIMockInterview;
