import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 opacity-10">
          {/* Background image or pattern */}
          <img
            src="https://images.unsplash.com/photo-1517245386807-f3d2f9e4f2e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDIyfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwZWR1Y2F0aW9ufGVufDB8fHx8MTY3ODkzMDc2MQ&ixlib=rb-4.0.3&q=80&w=1080"
            alt="AI education background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            About CampSync.AI
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl font-light mb-8">
            Your Future Starts Here. Powered by AI.
          </p>
          <p className="text-md sm:text-lg max-w-2xl mx-auto">
            CampSync.AI empowers students and alumni with intelligent tools
            for campus placements and academic excellence. We're building the future
            of career preparation, one smart insight at a time.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            In today's competitive landscape, securing a dream job and excelling academically
            requires more than just hard work—it demands smart preparation. CampSync.AI was
            founded to bridge the gap between student aspirations and career opportunities
            by leveraging cutting-edge Artificial Intelligence.
          </p>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            We are dedicated to providing personalized guidance, comprehensive resources, and
            actionable insights that transform potential into success.
          </p>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                AI-Powered Preparation
              </h3>
              <p className="text-gray-700">
                Unlock the secret behind cracking company exams from Amazon, Accenture,
                MindSprint, Zoho, Oracle, and more. Our exam resources cover everything
                from syllabus breakdowns to interview preparation, helping you see the big picture.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                Smart Career Insights
              </h3>
              <p className="text-gray-700">
                Visualize company visits, hiring patterns, and difficulty trends with our
                specialized Placement Trend dashboard. Get deep dives into specific companies:
                most-asked questions, difficulty levels, and hiring patterns.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                Academic Excellence
              </h3>
              <p className="text-gray-700">
                Access a comprehensive repository of previous year question papers, filterable
                by subject and year. Contribute to the community by uploading your exam papers,
                making valuable resources available to all.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                Personalized Journey
              </h3>
              <p className="text-gray-700">
                Track your progress, get tailored recommendations, and see alumni contributions
                with your personalized profile. Our AI suggests learning paths and resources
                based on your goals and performance.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                AI Mock Interviews
              </h3>
              <p className="text-gray-700">
                Practice HR and technical interviews with our intelligent AI bot, receiving
                instant feedback and personalized tips to refine your skills and boost your confidence.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                Company AI Assistant
              </h3>
              <p className="text-gray-700">
                Your dedicated Company Insights Assistant is always ready to help! Ask about
                hiring trends, FAQs, or interview patterns for any company, getting answers
                on demand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Impact (KPIs) Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-12">
            Our Impact at a Glance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-5xl font-extrabold text-blue-600 mb-2">150+</p>
              <p className="text-lg text-gray-600">Total Companies Visited</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-5xl font-extrabold text-purple-600 mb-2">500+</p>
              <p className="text-lg text-gray-600">Total Students Hired</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-5xl font-extrabold text-green-600 mb-2">7.5 LPA</p>
              <p className="text-lg text-gray-600">Average Package</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-5xl font-extrabold text-red-600 mb-2">25 LPA</p>
              <p className="text-lg text-gray-600">Highest Package</p>
            </div>
          </div>
          <p className="mt-10 text-xl text-gray-700 font-semibold">
            These numbers reflect the success stories powered by CampSync.AI.
          </p>
          <div className="mt-8 flex justify-center">
            {/* Image illustrating placement trends or data visualization */}
            {/* You could embed a small chart or a descriptive image here */}
            
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Boost Your Career?
          </h2>
          <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of students and alumni who are leveraging CampSync.AI
            to achieve their placement and academic goals. Your future starts now.
          </p>
          <button className="bg-white text-green-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg sm:text-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
            Sign Up for Free
          </button>
        </div>
      </section>

      {/* Contact Us Section - optional to put here or link to a separate page */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Have questions or want to learn more? We'd love to hear from you!
          </p>
          <form className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <textarea
                placeholder="Your Message"
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </section> */}
    </div>
  );
};

export default AboutUs;