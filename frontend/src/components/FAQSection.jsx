import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from "react-router-dom";

const faqItems = [
  {
    question: "What is CampSync.AI?",
    answer: "CampSync.AI is an AI-powered platform designed to help students and alumni with campus placements and academic preparation. It offers features like AI mock interviews, placement trend analysis, company insights, and academic paper access."
  },
  {
    question: "How does the AI Mock Interview Bot work?",
    answer: "Our AI bot simulates HR and technical interviews in real-time. It asks questions, analyzes your responses, and provides instant feedback, performance reports, and personalized tips to improve your interview skills."
  },
  {
    question: "Can I track my placement preparation progress?",
    answer: "Yes! Your personalized profile page tracks your mock interview attempts, scores, and areas of improvement. It also provides AI-driven recommendations for topics to focus on and resources to use."
  },
  {
    question: "What kind of Company Insights are available?",
    answer: "You can search for specific companies and get data on their most-asked interview questions, average difficulty levels, and historical hiring patterns based on aggregated alumni data."
  },
  {
    question: "Is there a section for previous year's academic papers?",
    answer: "Absolutely. Our Academic Papers section allows you to upload and view previous question papers, filterable by subject, year, and even university."
  },
  {
    question: "Who can use CampSync.AI?",
    answer: "CampSync.AI is primarily built for current students preparing for campus placements and exams, as well as alumni who wish to contribute their experiences."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            Got Questions?
          </h2>
          <p className="text-gray-500 text-lg">
            Everything you need to know about CampSync.AI
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`group border rounded-2xl transition-all duration-300 ${
                  isOpen 
                  ? 'border-indigo-600 bg-indigo-50/30 shadow-md' 
                  : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                <button
                  className="flex justify-between items-center w-full px-6 py-5 text-left focus:outline-none cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className={`text-lg font-bold transition-colors duration-300 ${
                    isOpen ? 'text-indigo-700' : 'text-gray-800'
                  }`}>
                    {item.question}
                  </span>
                  <div className={`flex-shrink-0 ml-4 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-indigo-600' : 'text-gray-400'
                  }`}>
                    <FaChevronDown />
                  </div>
                </button>

                {/* Animated Height Container */}
                <div className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}>
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-indigo-100/50 pt-4">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center p-8 bg-slate-50 rounded-[2rem] border border-dashed border-gray-300">
          <p className="text-gray-600 font-medium">
            Still have questions?
            <Link
              to="/contact"
              className="ml-2 text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;