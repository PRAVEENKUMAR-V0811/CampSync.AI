import React from 'react';
import { FaRobot, FaChartLine, FaBuilding, FaBookOpen, FaUserGraduate, FaLightbulb } from "react-icons/fa";
import HeroImg from "../assets/heroimg.png"; // Assuming this is a good, relevant hero image
import campsyncPromoVideo from "../assets/Videos/CampSync.AI Promo.mp4";
import logo from "../assets/logo2.png"; // Assuming you have a logo image
import { useNavigate, Link } from 'react-router-dom';
import CompanyScroller from './CompanyScroller';
import FAQSection from '../components/FAQSection';
import ScrollDownButton from './ScrollDownButton';
import TestimonialSlider from './TestimonialSlider';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleCTA = () => {
      navigate("/signup"); // Changed to signup for consistency with the CTA button
    };

    const handleContact = () => {
      navigate("/contact");
    };

    const handleHome = () => {
      navigate("/");
    };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Container for main content, with responsive padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between py-16 md:py-24">
          <div className="w-full md:w-1/2 pr-0 md:pr-8 mb-12 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Your Future Starts Here.{" "}<br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#7182ff_0%,_#3cff52_100%)] bg-[length:200%_200%] animate-text-shine">
                Powered by AI.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto md:mx-0">
              CampSync.AI empowers students and alumni with intelligent tools <br />
              <strong className="text-[#66c408]">for campus placements and academic excellence.</strong>
            </p>
            <button
              className="bg-black text-base font-semibold text-white px-10 py-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={handleCTA}
            >
              Get Started
            </button>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <img
              src={HeroImg}
              alt="CampSync.AI Hero Illustration"
              className="w-full max-w-md lg:max-w-lg rounded-xl shadow-2xl"
            />
          </div>
        </section>

        {/* Scroll Down Button - Points to the Video Section */}
        <ScrollDownButton targetId="promotional-video" />

        {/* Promotional Video Section - NEWLY ADDED */}
        <section id="promotional-video" className="py-20 bg-gray-50 rounded-xl shadow-inner mt-12 mb-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">See CampSync.AI in Action</h2>
            <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
              Discover how CampSync.AI transforms your career journey with our powerful AI tools.
            </p>
            <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-indigo-600">
              <video
                src={campsyncPromoVideo}
                title="CampSync.AI Promotional Video"
                controls
                loop
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
            <p className="mt-8 text-sm text-gray-500">
              *Full Demo coming soon! This is a placeholder video.
            </p>
          </div>
        </section>

        {/* Companies Section */}
        <section id="companies-section" className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Companies</h2>
            <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
              Want to know the secret behind cracking the below company exams? Our exam resources cover everything from syllabus breakdowns to interview preparation to help you see the big picture
            </p>
          </div>
          <div className="space-y-6"> {/* Added space between company scrollers */}
            <CompanyScroller direction="ltr" speed="medium" />
            <CompanyScroller direction="rtl" speed="medium" />
            <CompanyScroller direction="ltr" speed="medium" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50 rounded-xl shadow-inner mt-12 mb-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {/* Feature 1 */}
              <div className="p-8 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white flex flex-col items-center text-center">
                <div className="text-5xl text-indigo-600 mb-6">
                  <FaRobot />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">AI Mock Interviews</h3>
                <p className="text-gray-600">Practice HR and technical interviews with our AI bot, getting instant feedback and personalized tips.</p>
              </div>
              {/* Feature 2 */}
              <div className="p-8 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white flex flex-col items-center text-center">
                <div className="text-5xl text-green-600 mb-6">
                  <FaChartLine />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Placement Trends</h3>
                <p className="text-gray-600">Visualize company visits, hiring patterns, and difficulty trends to strategize your preparation.</p>
              </div>
              {/* Feature 3 */}
              <div className="p-8 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white flex flex-col items-center text-center">
                <div className="text-5xl text-red-600 mb-6">
                  <FaBuilding />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Company Insights</h3>
                <p className="text-gray-600">Get deep dives into specific companies: most-asked questions, difficulty levels, and hiring patterns.</p>
              </div>
              {/* Feature 4 */}
              <div className="p-8 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white flex flex-col items-center text-center">
                <div className="text-5xl text-yellow-600 mb-6">
                  <FaBookOpen />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Academic Papers</h3>
                <p className="text-gray-600">Access a repository of previous year question papers, filterable by subject and year.</p>
              </div>
              {/* Feature 5 */}
              <div className="p-8 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white flex flex-col items-center text-center">
                <div className="text-5xl text-purple-600 mb-6">
                  <FaUserGraduate />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Personalized Profile</h3>
                <p className="text-gray-600">Track your progress, get tailored recommendations, and see alumni contributions.</p>
              </div>
              {/* Feature 6 */}
              <div className="p-8 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white flex flex-col items-center text-center">
                <div className="text-5xl text-cyan-600 mb-6">
                  <FaLightbulb />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Smart Recommendations</h3>
                <p className="text-gray-600">Our AI suggests learning paths and resources based on your goals and performance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <TestimonialSlider />
        
        {/* FAQ Section */}
        <FAQSection />

        {/* Call to Action */}
        <section id="signup" className="py-20 bg-indigo-700 text-white text-center rounded-xl shadow-xl mt-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Boost Your Career?</h2>
            <p className="text-xl sm:text-2xl mb-10 max-w-3xl mx-auto">
              Join thousands of students and alumni who are leveraging CampSync.AI to achieve their placement and academic goals.
            </p>
            <Link to="/signup" className="inline-block bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-lg px-12 py-5 rounded-full shadow-xl transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
              Sign Up for Free
            </Link>
          </div>
        </section>

      </div> {/* End of main container */}
    </div>
  )
}

export default LandingPage;