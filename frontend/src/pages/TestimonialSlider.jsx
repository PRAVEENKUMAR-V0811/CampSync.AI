import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "Aisha Sharma",
    department: "Computer Science Engineering",
    passoutYear: 2023,
    message: "CampSync.AI was a game-changer for my placements! The AI mock interviews helped me identify my weak areas, and the company insights were incredibly accurate. Landed my dream job at Google!",
  },
  {
    name: "Rohan Kapoor",
    department: "Electronics & Communication Engineering",
    passoutYear: 2022,
    message: "The academic papers section saved me during exam season. Plus, the placement trends dashboard gave me a clear picture of what companies were looking for. Highly recommend!",
  },
  {
    name: "Priya Singh",
    department: "Information Technology",
    passoutYear: 2023,
    message: "I struggled with technical interviews, but the AI bot's feedback was invaluable. It felt like having a personal coach. Secured a great position at Microsoft!",
  },
  {
    name: "Amit Patel",
    department: "Mechanical Engineering",
    passoutYear: 2021,
    message: "Even as an alumni, CampSync.AI provided great insights into current market trends. The community contributions are also a huge plus for staying connected and updated.",
  },
  {
    name: "Divya Rao",
    department: "Electrical Engineering",
    passoutYear: 2024,
    message: "Still in my pre-final year, but CampSync.AI's early preparation modules and academic paper access have given me a significant edge. Feeling much more confident for placements!",
  }
];

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      setFade(true);
    }, 250);
  };

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
      setFade(true);
    }, 250);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-3xl"> {/* Reduced width from 5xl to 3xl */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-3">
            What Our Students Say
          </h2>
          <div className="h-1 w-16 bg-indigo-600 mx-auto rounded-full"></div>
        </div>

        <div className="relative group">
          {/* Smaller Decorative Quote Icon */}
          <div className="absolute -top-6 left-6 text-indigo-100 text-6xl -z-10 opacity-60">
            <FaQuoteLeft />
          </div>

          {/* Reduced padding from p-16 to p-8/p-12 */}
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 relative z-10">
            
            <div className={`transition-all duration-300 transform ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'}`}>
              <div className="flex flex-col items-center text-center">
                
                {/* Message - Reduced text size from 3xl to 2xl */}
                <p className="text-lg md:text-xl font-medium text-gray-700 leading-relaxed mb-8 italic">
                  "{current.message}"
                </p>

                {/* Profile Info - No Image */}
                <div className="flex flex-col items-center">
                  <h4 className="text-xl font-bold text-gray-900">{current.name}</h4>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest border-b-2 border-indigo-100">
                      {current.department}
                    </span>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                      • Class of {current.passoutYear}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons - More compact sizing */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 md:-mx-6 pointer-events-none">
              <button
                onClick={handlePrev}
                className="w-10 h-10 bg-white text-indigo-600 rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300 pointer-events-auto cursor-pointer group/btn"
              >
                <FaChevronLeft className="text-sm group-hover/btn:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 bg-white text-indigo-600 rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300 pointer-events-auto cursor-pointer group/btn"
              >
                <FaChevronRight className="text-sm group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Dots Indicator - Compact */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                    setFade(false);
                    setTimeout(() => {
                        setCurrentIndex(index);
                        setFade(true);
                    }, 250);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex ? 'w-8 bg-indigo-600' : 'w-2 bg-gray-300 hover:bg-indigo-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;