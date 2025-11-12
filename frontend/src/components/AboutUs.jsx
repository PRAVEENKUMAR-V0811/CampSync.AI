import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import bgimage from '../assets/MeetCampSync.png';

const AboutUs = () => {
  // Reuse same state variables and logic as in ContactSection
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus("Please fill in all fields.");
      toast.error("Please fill in all fields.");
      return;
    }

    setStatus("Sending...");

    emailjs
      .send(
        "service_bss2a6h", // service ID
        "template_bg1lvnu", // template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "Gw41erOgGgrGjyrIh" // public key
      )
      .then(
        () => {
          toast.success("Message sent successfully!");
          setStatus("");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error(error);
          toast.error("Failed to send message. Try again later.");
          setStatus("");
        }
      );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 opacity-10">
          <img
            src={bgimage}
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
        </div>
      </section>

      {/* Contact Section with EmailJS integrated */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Have questions or want to learn more? We'd love to hear from you!
          </p>

          {status && (
            <p
              className={`mb-4 ${
                status.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {status}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Your Message"
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
      </section>
    </div>
  );
};

export default AboutUs;
