import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Brain,
  FileText,
  Users,
  Building2,
  MessageCircle,
  X, // Still needed for the floating button's icon
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer
} from "recharts";

// Import the new Chatbot component
import Chatbot from './Chatbot';

const HomePage = ({ user }) => {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false); // Only this state remains for controlling Chatbot visibility

  // Dummy Data (keep these as they are part of your HomePage)
  const companyVisits = [
    { month: "Jan", visits: 12 },
    { month: "Feb", visits: 18 },
    { month: "Mar", visits: 25 },
    { month: "Apr", visits: 20 },
    { month: "May", visits: 30 },
  ];

  const topicFrequency = [
    { topic: "DSA", frequency: 40 },
    { topic: "OOPs", frequency: 25 },
    { topic: "DBMS", frequency: 20 },
    { topic: "OS", frequency: 15 },
  ];

  const difficultyTrends = [
    { year: "2021", easy: 30, medium: 50, hard: 20 },
    { year: "2022", easy: 25, medium: 55, hard: 20 },
    { year: "2023", easy: 20, medium: 60, hard: 20 },
  ];

  const modules = [
    {
      title: "Placement Trends",
      icon: <BarChart3 className="w-8 h-8 text-indigo-600" />,
      desc: "Visualize company visits, hiring patterns & difficulty levels.",
      path: "/placements/data",
    },
    {
      title: "Mock Interview Bot",
      icon: <Brain className="w-8 h-8 text-indigo-600" />,
      desc: "Simulate HR & technical interviews with our AI bot.",
      path: "/interview",
    },
    {
      title: "Company Insights",
      icon: <Building2 className="w-8 h-8 text-indigo-600" />,
      desc: "Explore FAQs, alumni experiences & interview difficulty by company.",
      path: "/company-insights",
    },
    {
      title: "Academic Papers",
      icon: <FileText className="w-8 h-8 text-indigo-600" />,
      desc: "Browse previous question papers with smart filters.",
      path: "/question-bank",
    },
    {
      title: "Upload Academic Papers",
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      desc: "Learn from alumni stories and interview experiences.",
      path: "/academic-papers-upload",
    },
    {
      title: "Share your experience",
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      desc: "Share your personal interview experiences.",
      path: "/share-experience",
    },
  ];

  // The handleSend function is no longer needed here, as Chatbot component handles it.

  return (
    <div className="min-h-screen bg-gray-50 relative p-8">
      {/* Dashboard Content */}
      <main className="container mx-auto px-6 py-10">
        {/* Overview Section (UNCHANGED) */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quick Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Company Visits */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2">
                Monthly Company Visits
              </h3>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={companyVisits}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="#4F46E5" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Topic Frequency */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2">Topic Frequency</h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={topicFrequency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="topic" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="frequency" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Difficulty Trends */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2">Difficulty Trends</h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={difficultyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="easy" stackId="a" fill="#34D399" />
                  <Bar dataKey="medium" stackId="a" fill="#FBBF24" />
                  <Bar dataKey="hard" stackId="a" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Modules Grid (UNCHANGED) */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Explore Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((m, i) => (
              <div
                key={i}
                onClick={() => navigate(m.path)}
                className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-lg transition p-6 flex flex-col"
              >
                <div className="mb-4">{m.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{m.title}</h3>
                <p className="text-gray-600 flex-grow">{m.desc}</p>
                <button className="mt-4 text-indigo-600 font-semibold hover:underline">
                  Open →
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Chat Bot Button (unchanged) */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Render the new Chatbot component */}
      <Chatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default HomePage;