import React, { useState, useEffect } from 'react';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ type, text, isLastBotMessage, isTyping, isUserMessage }) => {
  const alignmentClass = isUserMessage ? 'justify-end' : 'justify-start';

  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // If it's a typing indicator, handle animation
    if (isTyping) {
      setDisplayedText(text); // Display the "Typing..." or "... transcript" text immediately
      setShowCursor(true); // Always show cursor for typing indicators
    } else if (!isUserMessage && isLastBotMessage && text) { // Bot's final message, animate it
      setDisplayedText('');
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(prev => prev + text[i]);
          i++;
        } else {
          clearInterval(typingInterval);
          setShowCursor(false);
        }
      }, 20); // Adjust typing speed here

      return () => clearInterval(typingInterval);
    } else { // Normal message, display immediately
      setDisplayedText(text);
      setShowCursor(false);
    }
  }, [text, isLastBotMessage, isTyping, isUserMessage]);

  useEffect(() => {
    // Blinking cursor for typing messages
    if (isTyping && showCursor) {
      const blink = setInterval(() => setShowCursor(prev => !prev), 500);
      return () => clearInterval(blink);
    } else if (!isTyping) {
      setShowCursor(false); // Ensure cursor is off for non-typing messages
    }
  }, [isTyping, showCursor]);

  const botBgClass = 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200 rounded-tr-xl';
  const userBgClass = 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 rounded-tl-xl';

  return (
    <div className={`flex ${alignmentClass} w-full animate-fade-in`}>
      <div className={`relative p-4 rounded-xl shadow-lg border max-w-[75%] ${isUserMessage ? userBgClass : botBgClass}`}>
        
        <p className="font-semibold text-xs mb-1 opacity-80">
          {isUserMessage ? 'You' : 'Interviewer Bot'}
        </p>

        {isTyping ? (
          <p className="text-gray-600 italic flex items-center">
            {/* Show "..." for bot typing, actual text for user speaking */}
            {type === 'bot' ? <span className="animate-pulse mr-2 text-xl leading-none">...</span> : null}
            {displayedText}
            {showCursor && <span className="inline-block w-1.5 h-3 ml-1 bg-gray-700 animate-pulse align-text-bottom"></span>}
          </p>
        ) : (
          <>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {displayedText || ''}
            </ReactMarkdown>
          </>
        )}

        {/* Triangle for User message (bottom-right) */}
        {isUserMessage && (
          <div className="absolute right-0 bottom-0 w-3 h-3 bg-emerald-50 transform translate-x-1/2 translate-y-1/2 rotate-45 border-b border-r border-green-200"></div>
        )}
        {/* Triangle for Bot message (bottom-left) */}
        {!isUserMessage && (
          <div className="absolute left-0 bottom-0 w-3 h-3 bg-blue-50 transform -translate-x-1/2 translate-y-1/2 rotate-45 border-b border-l border-indigo-200"></div>
        )}

      </div>
    </div>
  );
};

export default ChatMessage;