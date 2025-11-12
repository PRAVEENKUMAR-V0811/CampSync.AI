import React from 'react';

const ScrollDownButton = ({ targetId }) => {
  const scrollToTarget = () => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth', // Smooth scrolling
        block: 'start',      // Align the top of the target with the top of the viewport
      });
    }
  };

  return (
    <div className="fixed bottom-8 left-375 -translate-x-2/2 z-50">
      <button
        onClick={scrollToTarget}
        className="flex items-center justify-center p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-110"
        aria-label="Scroll down to next section"
      >
        <i className="fas fa-chevron-down text-xl animate-bounce"></i>
      </button>
    </div>
  );
};

export default ScrollDownButton;