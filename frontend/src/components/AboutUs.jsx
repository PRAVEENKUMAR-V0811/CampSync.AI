import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { 
  Target, Cpu, BarChart, BookOpen, UserCheck, 
  MessageSquare, Briefcase, TrendingUp, Users, 
  Award, Star, Send, Layout 
} from 'lucide-react';
import bgimage from '../assets/MeetCampSync.png';

const AboutUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setStatus("Sending...");
    emailjs.send(
      "service_bss2a6h", "template_bg1lvnu",
      { from_name: formData.name, from_email: formData.email, message: formData.message },
      "Gw41erOgGgrGjyrIh"
    ).then(() => {
      toast.success("Message sent successfully!");
      setStatus("");
      setFormData({ name: "", email: "", message: "" });
    }).catch((err) => {
      toast.error("Failed to send. Try again later.");
      setStatus("");
    });
  };

  const features = [
    {
      title: "AI-Powered Preparation",
      desc: "Master exams for Amazon, Zoho, and Oracle with AI-curated syllabus breakdowns and targeted preparation strategies.",
      icon: Cpu,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Smart Career Insights",
      desc: "Visualize hiring patterns and difficulty trends with our Placement Trend dashboard. Know what to expect before you walk in.",
      icon: BarChart,
      color: "text-indigo-500",
      bg: "bg-indigo-50"
    },
    {
      title: "Academic Excellence",
      desc: "A vast repository of PYQs and study materials. Filter by subject and contribute to the collective student knowledge.",
      icon: BookOpen,
      color: "text-sky-500",
      bg: "bg-sky-50"
    },
    {
      title: "Personalized Journey",
      desc: "AI-driven learning paths tailored to your specific goals, performance tracking, and alumni career path insights.",
      icon: Layout,
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      title: "AI Mock Interviews",
      desc: "Practice with our intelligent bot. Get instant feedback on your technical and HR skills to build unshakable confidence.",
      icon: UserCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      title: "Company AI Assistant",
      desc: "A 24/7 dedicated assistant to answer queries about hiring FAQs, interview patterns, and company-specific cultures.",
      icon: MessageSquare,
      color: "text-orange-500",
      bg: "bg-orange-50"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-indigo-950">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={bgimage} alt="AI background" className="w-full h-full object-cover scale-105" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 z-0"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <div className="inline-flex items-center space-x-2 bg-sky-400/10 border border-sky-400/20 px-4 py-2 rounded-full mb-6">
            <Cpu size={16} className="text-sky-400 animate-pulse" />
            <span className="text-sky-400 text-sm font-bold tracking-widest uppercase">The Future of Campus Life</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Bridging Academics <br />& <span className="text-indigo-600">Placements</span>
          </h1>
          <p className="text-lg md:text-xl to-slate-50 max-w-2xl mx-auto leading-relaxed">
            CampSync.AI empowers students with intelligent tools to excel in university exams 
            while securing their dream careers through AI-driven insights.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 bg-white relative">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-6">
            <div className="h-1 w-20 bg-sky-500 rounded-full"></div>
            <h2 className="text-4xl font-bold text-slate-900">Our Mission</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              In today's hyper-competitive landscape, hard work isn't enough you need <strong>Smart Preparation.</strong> CampSync.AI was founded to bridge the critical gap between academic learning and industry demands.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              We leverage cutting-edge AI to provide personalized guidance, actionable insights, and a community-driven repository that transforms your potential into measurable success.
            </p>
            <div className="flex items-center gap-4 text-indigo-600 font-bold cursor-pointer group">
              <span>Learn about our technology</span>
              <TrendingUp size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-8 rounded-3xl space-y-3 border border-slate-100">
                <Target className="text-indigo-600" size={32} />
                <h4 className="font-bold text-slate-900">Precision</h4>
                <p className="text-sm text-slate-500">Targeted preparation for specific companies.</p>
            </div>
            <div className="bg-indigo-600 p-8 rounded-3xl space-y-3 text-white shadow-xl shadow-indigo-200 mt-8">
                <Users className="text-indigo-200" size={32} />
                <h4 className="font-bold">Community</h4>
                <p className="text-sm text-indigo-100">Built by students, for students and alumni.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer - Features Grid */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">Comprehensive AI Ecosystem</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to navigate college life and launch your career under one roof.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
                <div className={`${f.bg} ${f.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-24 px-6 bg-indigo-900 text-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-16">Real Impact, Real Numbers</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Companies Visited", val: "150+", icon: Briefcase, color: "text-sky-400" },
              { label: "Students Hired", val: "500+", icon: Award, color: "text-emerald-400" },
              { label: "Average Package", val: "7.5 LPA", icon: Star, color: "text-orange-400" },
              { label: "Highest Package", val: "25 LPA", icon: TrendingUp, color: "text-pink-400" }
            ].map((s, i) => (
              <div key={i} className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                <s.icon className={`${s.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} size={32} />
                <p className="text-4xl font-black mb-2">{s.val}</p>
                <p className="text-sm text-indigo-200 font-medium uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-slate-900">Connect With Us</h2>
              <p className="text-slate-600 leading-relaxed">
                Have questions about our AI features or want to collaborate? Our team is ready to help you sync your career.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center"><Send size={18}/></div>
                  <span className="text-slate-700 font-medium text-sm">support@campsync.ai</span>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <input
                type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="College Email"
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <textarea
                name="message" value={formData.message} onChange={handleChange}
                rows="4" placeholder="How can we help?"
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              ></textarea>
              <button
                type="submit" disabled={status === "Sending..."}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:bg-slate-400"
              >
                <span>{status === "Sending..." ? "Transmitting..." : "Send Message"}</span>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;