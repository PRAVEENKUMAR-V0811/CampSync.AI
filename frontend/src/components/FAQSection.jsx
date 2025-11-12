import React, { useState } from 'react';

const faqItems = [
  {
    question: "What is CampSync.AI?",
    answer: "CampSync.AI is an AI-powered platform designed to help students and alumni with campus placements and academic preparation. It offers features like AI mock interviews, placement trend analysis, company insights, and academic paper access."
  },
  {
    question: "How does the AI Mock Interview Bot work?",
    answer: "Our AI bot simulates HR and technical interviews in real-time. It asks questions, analyzes your responses (both text and potentially voice, if integrated), and provides instant feedback, performance reports, and personalized tips to improve your interview skills."
  },
  {
    question: "Can I track my placement preparation progress?",
    answer: "Yes! Your personalized profile page tracks your mock interview attempts, scores, and areas of improvement. It also provides AI-driven recommendations for topics to focus on and resources to use."
  },
  {
    question: "What kind of Company Insights are available?",
    answer: "You can search for specific companies and get data on their most-asked interview questions, average difficulty levels, and historical hiring patterns based on aggregated alumni data and market trends."
  },
  {
    question: "Is there a section for previous year's academic papers?",
    answer: "Absolutely. Our Academic Papers section allows you to upload and view previous question papers, filterable by subject, year, and even university (if applicable). This helps you prepare for exams more effectively."
  },
  {
    question: "Who can use CampSync.AI?",
    answer: "CampSync.AI is primarily built for current students preparing for campus placements and exams, as well as alumni who wish to contribute their experiences or stay updated with campus trends."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null); // State to manage which FAQ item is open

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle open/close, close if already open
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white to-blue-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl"
            >
              <button
                className="flex justify-between items-center w-full px-8 py-5 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-xl font-semibold text-gray-800">{item.question}</span>
                <span
                  className={`transform transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  <i className="fas fa-chevron-down text-gray-600"></i>
                </span>
              </button>
              {openIndex === index && (
                <div className="px-8 pb-5 pt-0 text-gray-600 border-t border-gray-100 animate-fade-in-down">
                  <p className="leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;