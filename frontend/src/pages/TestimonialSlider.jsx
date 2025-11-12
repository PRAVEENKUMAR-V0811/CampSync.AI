import React, { useState } from 'react';

// Dummy Testimonial Data
const testimonials = [
  {
    name: "Aisha Sharma",
    department: "Computer Science Engineering",
    passoutYear: 2023,
    message: "CampSync.AI was a game-changer for my placements! The AI mock interviews helped me identify my weak areas, and the company insights were incredibly accurate. Landed my dream job at Google!",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg" // Placeholder avatar
  },
  {
    name: "Rohan Kapoor",
    department: "Electronics & Communication Engineering",
    passoutYear: 2022,
    message: "The academic papers section saved me during exam season. Plus, the placement trends dashboard gave me a clear picture of what companies were looking for. Highly recommend!",
    avatar: "https://randomuser.me/api/portraits/men/47.jpg" // Placeholder avatar
  },
  {
    name: "Priya Singh",
    department: "Information Technology",
    passoutYear: 2023,
    message: "I struggled with technical interviews, but the AI bot's feedback was invaluable. It felt like having a personal coach. Secured a great position at Microsoft!",
    avatar: "https://randomuser.me/api/portraits/women/84.jpg" // Placeholder avatar
  },
  {
    name: "Amit Patel",
    department: "Mechanical Engineering",
    passoutYear: 2021,
    message: "Even as an alumni, CampSync.AI provided great insights into current market trends. The community contributions are also a huge plus for staying connected and updated.",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg" // Placeholder avatar
  },
  {
    name: "Divya Rao",
    department: "Electrical Engineering",
    passoutYear: 2024,
    message: "Still in my pre-final year, but CampSync.AI's early preparation modules and academic paper access have given me a significant edge. Feeling much more confident for placements!",
    avatar: "https://randomuser.me/api/portraits/women/15.jpg" // Placeholder avatar
  }
];

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? testimonials.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === testimonials.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-indigo-50">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-12">
          What Our Students Say
        </h2>

        <div className="relative bg-white rounded-lg shadow-xl p-8 md:p-12 border border-indigo-100 min-h-[350px] flex items-center justify-center">
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-full shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 z-10"
            aria-label="Previous testimonial"
          >
            <i className="fas fa-chevron-left text-xl"></i>
          </button>

          {/* Testimonial Content */}
          <div className="flex flex-col items-center justify-center text-center px-4 sm:px-8 w-full transition-opacity duration-500 ease-in-out">
            {/* <img
              src={currentTestimonial.avatar}
              alt={currentTestimonial.name}
              className="w-24 h-24 rounded-full object-cover shadow-md mb-6 border-4 border-indigo-200"
            /> */}
            <p className="text-xl md:text-2xl italic text-gray-700 mb-6 leading-relaxed">
              "{currentTestimonial.message}"
            </p>
            <div className="text-center">
              <p className="text-indigo-700 text-2xl font-bold mb-1">{currentTestimonial.name}</p>
              <p className="text-gray-500 text-lg">
                {currentTestimonial.department}, Class of {currentTestimonial.passoutYear}
              </p>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-full shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 z-10"
            aria-label="Next testimonial"
          >
            <i className="fas fa-chevron-right text-xl"></i>
          </button>
        </div>

        {/* Dots Indicator (Optional, but good for UX) */}
        <div className="flex justify-center mt-8 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex ? 'bg-indigo-600' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;