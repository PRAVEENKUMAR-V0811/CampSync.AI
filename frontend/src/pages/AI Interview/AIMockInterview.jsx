import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Mic, Video, AlertTriangle, Maximize, Activity, Keyboard, Cpu, Aperture, UserCheck, Code2, Terminal, Save, X, Info, Power, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 
import { API_BASE_URL } from '../../api';
import InterviewSettings from './InterviewSettings';
import VideoWindow from './VideoWindow';
import FeedbackReport from './FeedbackReport'; 

const BACKEND_URL = `${API_BASE_URL}/api/interview`;

const AIMockInterview = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState('// Enter your code here...\n\nfunction solution() {\n    \n}');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(uuidv4());
  
  const [interviewStep, setInterviewStep] = useState('settings'); 
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interviewContext, setInterviewContext] = useState({ role: '', level: '' });
  
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [warnings, setWarnings] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFsEnforcement, setShowFsEnforcement] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [feedbackReport, setFeedbackReport] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [toasts, setToasts] = useState([]);
  const [autoSubmitting, setAutoSubmitting] = useState(false);

  const [agreedToRules, setAgreedToRules] = useState(false);
  const [micTestPassed, setMicTestPassed] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [audioData, setAudioData] = useState(new Array(24).fill(0));

  const userStreamRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const handleSubmitRef = useRef(null);
  const textareaRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const autoSubmitRef = useRef(false);
  const autoSubmitReasonRef = useRef('');


  const addToast = useCallback((message, type = "warning") => {
    const id = uuidv4();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
  }, []);

  const stopAllProcesses = useCallback(() => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) recognitionRef.current.stop();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    
    // Check state before closing to avoid "Cannot close a closed AudioContext"
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(err => console.error("AudioCtx Close Error:", err));
    }
    
    setIsAISpeaking(false);
    setIsListening(false);
}, []);

  useEffect(() => {
    const handleFsChange = () => {
      const isNowFull = !!document.fullscreenElement;
      setIsFullscreen(isNowFull);
      if (!isNowFull && interviewStep === 'active' && !autoSubmitting) {
        setShowFsEnforcement(true);
        triggerWarning("Fullscreen exit detected.");
      } else {
        setShowFsEnforcement(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
        document.removeEventListener('fullscreenchange', handleFsChange);
        stopAllProcesses();
    };
  }, [interviewStep, autoSubmitting, stopAllProcesses]);


  const triggerWarning = (reason) => {
  setWarnings(prev => {
    const next = prev + 1;

    if (next >= 3) {
      autoSubmitRef.current = true;
      autoSubmitReasonRef.current = reason;

      addToast(
        "MAX VIOLATIONS: Auto-submitting session because of violating the rules",
        "error"
      );
      // setTimeout(() => handleAutoSubmit(), 2000);
      handleAutoSubmit();
      return 3;
    }

    addToast(`${reason} Warning ${next}/3`, "warning");
    return next;
  });
};

// UPDATED handleEndInterview
  const handleEndInterview = async () => {
    stopAllProcesses();

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error("Exit FS error:", err));
    }

    if (userStreamRef.current) {
      userStreamRef.current.getTracks().forEach(t => t.stop());
    }

    setInterviewStep('ended');
    setLoading(true);
    setAutoSubmitting(false); 

    try {
      // 🔹 Format history for LLM (mapping 'bot'/'user' types to 'assistant'/'user' roles)
      let formattedHistory = messages.map(msg => ({
        role: msg.type === 'bot' ? 'assistant' : 'user',
        content: msg.text
      }));

      // 🔹 Append violation data if it exists
      if (autoSubmitRef.current) {
        formattedHistory.push({
          role: 'system',
          content: `Violation: ${autoSubmitReasonRef.current}`
        });
      }

      const response = await fetch(
        `${API_BASE_URL}/api/interview/feedback`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            history: formattedHistory, 
            context: interviewContext,
            codeSubmitted: code
          })
        }
      );

      const data = await response.json();
      setFeedbackReport(data);

    } catch (error) {
      console.error(error);
      // Fallback UI data
      setFeedbackReport({
        overallScore: 0,
        summary: "Error generating report. Please contact support.",
        strengths: [],
        areasForImprovement: []
      });
    } finally {
      setLoading(false);
    }
  };


const handleAutoSubmit = useCallback(async () => {
    // 1. Prevent multiple triggers
    if (autoSubmitting) return; 
    setAutoSubmitting(true);

    // 2. Stop speech, recognition, and animations immediately
    stopAllProcesses();

    // 3. Mark the violation for the LLM feedback
    autoSubmitRef.current = true;
    // autoSubmitReasonRef is already set by the triggerWarning function

    // 4. Small delay for UX so the user can see the "Auto Submitting" overlay
    setTimeout(() => {
      handleEndInterview();
    }, 1500);
  }, [autoSubmitting, handleEndInterview, stopAllProcesses]);

  
  // UPDATED handleSubmit
  const handleSubmit = useCallback(async (textOverride) => {
    const finalMsg = textOverride || "I have completed the coding challenge. Please review my solution.";
    if (interviewStep !== 'active' || loading) return;

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setInterimTranscript('');
    
    // UI Update
    const userMsgId = uuidv4();
    setMessages(prev => [...prev, { type: 'user', text: finalMsg, id: userMsgId }]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/interview`, { // Simplified URL
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: finalMsg, 
          code: code, 
          sessionId, 
          context: interviewContext 
        })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { type: 'bot', text: data.response, id: uuidv4() }]);
      speak(data.response);
    } catch (error) { 
      console.error("Submit Error:", error); 
    } finally { 
      setLoading(false); 
    }
  }, [code, loading, sessionId, interviewContext, interviewStep]);

  useEffect(() => { handleSubmitRef.current = handleSubmit; }, [handleSubmit]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInterimTranscript(currentTranscript);

        if (interviewStep === 'proctoring' && currentTranscript.trim().length > 25) {
            setMicTestPassed(true);
        }

        if (interviewStep !== 'active') return;

        // UPDATION: Auto-submit after 5 seconds of silence or stopping speech
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (currentTranscript.trim()) {
            recognition.stop();
            handleSubmitRef.current(currentTranscript);
          }
        }, 5000); 
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [interviewStep]);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => { setIsAISpeaking(true); if (isListening) recognitionRef.current?.stop(); };
    utterance.onend = () => setIsAISpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startMicTest = () => {
    if (!userStreamRef.current) return;
    setInterimTranscript("");
    setIsListening(true);
    recognitionRef.current?.start();

    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContextRef.current.createMediaStreamSource(userStreamRef.current);
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 64; 
    analyserRef.current.smoothingTimeConstant = 0.85;
    source.connect(analyserRef.current);

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    const update = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      const simplifiedData = Array.from(dataArray).slice(0, 24);
      setAudioData(simplifiedData);
      let values = 0;
      for (let i = 0; i < simplifiedData.length; i++) { values += simplifiedData[i]; }
      setMicVolume(values / simplifiedData.length);
      animationFrameRef.current = requestAnimationFrame(update);
    };
    update();
  };

  const handleSandboxKeyDown = (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const pairs = { '{': '}', '(': ')', '[': ']', '"': '"', "'": "'" };
    if (pairs[e.key]) {
      e.preventDefault();
      const newValue = code.substring(0, start) + e.key + pairs[e.key] + code.substring(end);
      setCode(newValue);
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 1; }, 0);
      return;
    }
    if (e.key === 'Tab') {
        e.preventDefault();
        const val = code.substring(0, start) + "    " + code.substring(end);
        setCode(val);
        setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 4; }, 0);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#020617] text-slate-100 flex flex-col overflow-hidden min-w-[1024px]">
      
      {showFsEnforcement && (
        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="bg-slate-900 border border-rose-500/30 p-10 rounded-[2.5rem] max-w-lg w-full text-center shadow-2xl">
                <AlertTriangle size={60} className="text-rose-500 mx-auto mb-6 animate-pulse" />
                <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter text-center">Fullscreen Required</h2>
                <button onClick={() => document.documentElement.requestFullscreen()} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest cursor-pointer shadow-lg shadow-indigo-600/20">Return to Full Screen</button>
            </div>
        </div>
      )}

      {autoSubmitting && (
        <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center">
            <AlertTriangle size={80} className="text-rose-500 mb-6 animate-bounce" />
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Auto Submitting</h1>
            <p className="text-slate-400 mt-4 text-xl">Auto submitting because of violating the rules...</p>
        </div>
      )}

      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className={`${t.type === 'error' ? 'bg-rose-600 shadow-rose-500/20' : t.type === 'info' ? 'bg-indigo-600 shadow-indigo-500/20' : 'bg-amber-600 shadow-amber-500/20'} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right font-bold text-xs uppercase cursor-pointer`}>
            {t.type === 'info' ? <Activity size={18} /> : <AlertTriangle size={18} />} {t.message}
          </div>
        ))}
      </div>

      {interviewStep === 'settings' && (
        <InterviewSettings onStartInterview={(role, level) => {
          setInterviewContext({ role, level });
          setInterviewStep('proctoring');
          navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(s => userStreamRef.current = s);
        }} />
      )}

      {interviewStep === 'proctoring' && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-12 overflow-y-auto">
          {!isFullscreen ? (
            <div className="text-center space-y-6">
                <Maximize size={64} className="mx-auto text-indigo-500 animate-pulse" />
                <h2 className="text-3xl font-black tracking-tighter uppercase">Desktop Fullscreen Required</h2>
                <button onClick={() => document.documentElement.requestFullscreen()} className="px-10 py-4 bg-indigo-600 rounded-xl font-bold uppercase tracking-widest text-white cursor-pointer hover:bg-indigo-500 transition-all">Enter Fullscreen</button>
            </div>
          ) : (
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6 bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5">
                 <div className="flex items-center gap-3 text-indigo-400">
                    <ShieldCheck size={28} />
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic">Interview Guidelines</h2>
                 </div>
                 <div className="space-y-4 text-slate-400 text-sm leading-relaxed overflow-y-auto max-h-[300px] pr-4 custom-scrollbar">
                    <p>1. <span className="text-white font-bold">Constant Monitoring:</span> Your camera and microphone must remain on at all times. Disabling hardware triggers a security warning.</p>
                    <p>2. <span className="text-white font-bold">Fullscreen Protocol:</span> Do not exit fullscreen or switch tabs. Three violations will result in automatic submission.</p>
                    <p>3. <span className="text-white font-bold">Environment:</span> Ensure you are in a quiet, well-lit room. No other individuals should be visible or audible.</p>
                    <p>4. <span className="text-white font-bold">Technical:</span> Use the "Coding Solution" icon to open the editor. Wait for the AI to finish speaking before responding.</p>
                    <p>5. <span className="text-white font-bold">Communication:</span> Speak clearly into your microphone. The AI tracks your responses in real-time.</p>
                 </div>
                 <label className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-2xl border border-white/5 cursor-pointer hover:bg-slate-800 transition-colors">
                    <input type="checkbox" checked={agreedToRules} onChange={(e) => setAgreedToRules(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">I have read and agree to all rules</span>
                 </label>
              </div>

              <div className="space-y-6 w-full">
                <div className="bg-slate-900 rounded-[2.5rem] border border-white/10 overflow-hidden aspect-video relative shadow-2xl">
                    <VideoWindow type="user" stream={userStreamRef.current} />
                </div>
                <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 space-y-6">
                    <div className="flex flex-col items-center gap-4 px-2">
                        <div className="flex items-end gap-1 h-12">
                            {audioData.map((val, i) => (
                                <div key={i} className="w-1.5 bg-indigo-500 rounded-full transition-all duration-150 ease-out" 
                                     style={{ height: `${Math.max(6, (val / 255) * 100)}%`, opacity: 0.3 + (val / 255) }} />
                            ))}
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 transition-all duration-200" style={{ width: `${Math.min(100, micVolume * 2)}%` }} />
                        </div>
                    </div>
                    <div className="p-4 bg-[#020617] rounded-xl border border-indigo-500/20 text-center relative overflow-hidden">
                        <p className="text-xs text-indigo-300 font-medium mb-4 italic">"I am ready to begin my AI mock interview and will follow all instructions clearly."</p>
                        <button onClick={startMicTest}
                            className={`flex items-center gap-2 px-6 py-2 mx-auto rounded-full text-[10px] font-black uppercase transition-all cursor-pointer ${micTestPassed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-600 text-white shadow-lg'}`}>
                            <Mic size={14} /> {micTestPassed ? 'Speech Verified' : 'Click to Read Sentence'}
                        </button>
                        {interimTranscript && <p className="mt-2 text-[8px] uppercase text-slate-500 font-bold tracking-widest animate-pulse">Capturing: {interimTranscript.slice(-40)}...</p>}
                    </div>
                </div>
                <button disabled={!agreedToRules || !micTestPassed}
                    onClick={() => {
                         stopAllProcesses(); 
                         setInterviewStep('active');
                         fetch(BACKEND_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'start_interview', sessionId, context: interviewContext }) })
                         .then(res => res.json()).then(data => { setMessages([{ type: 'bot', text: data.response, id: uuidv4() }]); speak(data.response); });
                    }} 
                    className={`w-full py-5 rounded-2xl font-black text-lg transition-all cursor-pointer ${(!agreedToRules || !micTestPassed) ? 'bg-slate-800 text-slate-500 grayscale cursor-not-allowed opacity-50' : 'bg-indigo-600 text-white hover:scale-[1.01]'}`}
                >
                    INITIALIZE INTERVIEW SESSION
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {interviewStep === 'active' && (
        <div className="relative z-10 flex-1 flex flex-row overflow-hidden transition-all duration-500">
          <main className={`${showSandbox ? 'w-[45%]' : 'w-full'} p-6 flex flex-col gap-4 bg-black/20 transition-all duration-500`}>
             <div className={`flex flex-1 gap-4 ${showSandbox ? 'flex-col' : 'flex-row'}`}>
                <div className={`${showSandbox ? 'h-1/2' : 'w-1/2 h-full'}`}><VideoWindow type="ai" isAISpeaking={isAISpeaking} transcript={isAISpeaking ? messages[messages.length-1]?.text : ""} /></div>
                <div className={`${showSandbox ? 'h-1/2' : 'w-1/2 h-full'}`}><VideoWindow type="user" stream={userStreamRef.current} transcript={isListening ? interimTranscript : ""} /></div>
             </div>
             
             <div className="flex justify-between items-center px-8 py-4 bg-slate-900/90 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <button onClick={() => { const s = !isCameraOn; if(userStreamRef.current) userStreamRef.current.getVideoTracks()[0].enabled = s; setIsCameraOn(s); if(!s) triggerWarning("Camera Disabled."); }} className={`p-3 rounded-full cursor-pointer transition-all ${isCameraOn ? 'bg-slate-800' : 'bg-rose-600'}`}><Video size={18} /></button>
                        <button onClick={() => { const s = !isMicOn; if(userStreamRef.current) userStreamRef.current.getAudioTracks()[0].enabled = s; setIsMicOn(s); if(!s) triggerWarning("Microphone Disabled."); }} className={`p-3 rounded-full cursor-pointer transition-all ${isMicOn ? 'bg-slate-800' : 'bg-rose-600'}`}><Mic size={18} /></button>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <button onClick={() => setShowSandbox(!showSandbox)} className={`p-3 rounded-full cursor-pointer transition-all ${showSandbox ? 'bg-indigo-600' : 'bg-slate-800'}`}><Keyboard size={18} /></button>
                        <span className="text-[9px] font-black uppercase text-slate-500">Coding Solution</span>
                    </div>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                    {/* LOADING DISCLAIMER */}
                    {loading && (
                        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-indigo-600/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-indigo-400/30 flex items-center gap-3 animate-in fade-in zoom-in slide-in-from-bottom-4 shadow-2xl z-50">
                            <Loader2 className="animate-spin text-white" size={18} />
                            <p className="text-white text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                                Please wait for AI to response because AI is analysing and generating next question
                            </p>
                        </div>
                    )}

                    <button disabled={isAISpeaking || loading} onClick={() => { 
                        if(isListening) { 
                            recognitionRef.current?.stop(); 
                        } else { 
                            setInterimTranscript(''); 
                            setIsListening(true); 
                            recognitionRef.current?.start(); 
                        } 
                    }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all ${isAISpeaking || loading ? 'bg-slate-800 opacity-40 grayscale cursor-not-allowed' : isListening ? 'bg-rose-500 animate-pulse shadow-[0_0_40px_rgba(244,63,94,0.4)]' : 'bg-indigo-600 shadow-xl shadow-indigo-500/20'}`}>
                        <Mic size={24} />
                    </button>
                    <span className="text-[9px] font-black uppercase text-indigo-400">Click to Response</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                        <button onClick={handleEndInterview} className="p-3 bg-rose-600/20 text-rose-500 border border-rose-500/20 rounded-full cursor-pointer hover:bg-rose-600 hover:text-white transition-all"><Power size={18} /></button>
                        <span className="text-[9px] font-black uppercase text-rose-500">End Session</span>
                    </div>
                    <div className="px-4 py-2 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20 text-[10px] font-black uppercase">Warnings: {warnings}/3</div>
                </div>
             </div>
          </main>

          {showSandbox && (
            <aside className="w-[55%] bg-[#1e1e1e] flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-500">
              <div className="flex items-center justify-between px-6 py-3 bg-[#252526] border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
                    <Code2 size={16} /> solution.js
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                    <Terminal size={14} /> Main Terminal
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                    <Terminal size={14} /> Powered by CampSync.AI
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSubmit()} className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-[10px] font-black uppercase transition-all shadow-lg"><Save size={14} /> Submit Solution</button>
                  <button onClick={handleEndInterview} className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-[10px] font-black uppercase transition-all">End Session</button>
                </div>
              </div>
              <div className="flex-1 relative flex font-mono text-sm group overflow-hidden">
                <div className="w-12 bg-[#1e1e1e] text-[#858585] text-right pr-4 pt-4 select-none border-r border-white/5">
                  {code.split('\n').map((_, i) => (<div key={i}>{i + 1}</div>))}
                </div>
                <textarea
                  ref={textareaRef}
                  className="flex-1 bg-transparent p-4 outline-none text-[#d4d4d4] resize-none leading-relaxed overflow-y-auto no-scrollbar"
                  spellCheck="false"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleSandboxKeyDown}
                />
              </div>
              <div className="bg-[#007acc] px-4 py-1 flex items-center justify-between text-[10px] font-bold text-white uppercase tracking-wider">
                <div className="flex gap-4"><span>UTF-8</span><span>JavaScript (Node.js)</span><span>CampSync.AI - Code Editor</span></div>
                <div className="flex gap-4"><span>Ln {code.split('\n').length}, Col {code.length}</span><span className="flex items-center gap-1"><CheckCircle2 size={10} /> Prettier: Ready</span></div>
              </div>
            </aside>
          )}
        </div>
      )}

      {interviewStep === 'ended' && (
        <div className="relative z-10 flex-1 flex items-center justify-center p-6">
            {feedbackReport ? <FeedbackReport data={feedbackReport} onBack={() => navigate('/dashboard')} /> : (
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="uppercase tracking-widest text-indigo-400 font-black text-sm">Generating AI Feedback...</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default AIMockInterview;