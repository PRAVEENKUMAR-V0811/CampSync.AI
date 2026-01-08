// src/components/TeamPage.js
import React from 'react';
import { Linkedin, Mail, MessageSquareQuote, GraduationCap, Award } from 'lucide-react';
import logo from "../assets/logofinal.png"; // Use your existing logo
import founder from '../assets/IMG_3269.jpg';

// --- DATA STRUCTURE (Update these values with real names/images) ---
const teamData = {
    founder: {
        name: "Mr. V. Praveen Kumar (B.E AIML)",
        role: "Founder & CEO",
        image: founder, // Replace with real image path
        message: "CampSync.AI was born out of a simple observation: the gap between academic learning and corporate expectations is widening. Our mission is to empower every student with AI-driven insights to navigate their career path with confidence and clarity. We aren't just building a tool; we're building a bridge to the future.",
        linkedin: "#"
    },
    coFounders: [
        { name: "Co-Founder One", role: "Chief Technical Officer", image: "https://via.placeholder.com/300x350", linkedin: "#" },
        { name: "Co-Founder Two", role: "Chief Operating Officer", image: "https://via.placeholder.com/300x350", linkedin: "#" }
    ],
    facultyMentors: [
        { name: "Dr. Mentor One", dept: "Dept. of Computer Science", title: "Professor & Head", image: "https://via.placeholder.com/200x200" },
        { name: "Dr. Mentor Two", dept: "Dept. of Information Technology", title: "Associate Professor", image: "https://via.placeholder.com/200x200" },
        { name: "Dr. Mentor Three", dept: "Placement Cell", title: "Placement Coordinator", image: "https://via.placeholder.com/200x200" },
        { name: "Dr. Mentor Four", dept: "Dept. of EEE", title: "Assistant Professor", image: "https://via.placeholder.com/200x200" },
        { name: "Dr. Mentor Five", dept: "Soft Skills Training", title: "Lead Trainer", image: "https://via.placeholder.com/200x200" }
    ]
};

const TeamPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-20 overflow-x-hidden">
            
            {/* --- HEADER SECTION --- */}
            <section className="container mx-auto px-6 mb-20 text-center">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="CampSync.AI" className="h-16 w-auto" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
                    The Visionaries Behind <span className="text-indigo-600">CampSync.AI</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                    Guided by academic excellence and fueled by technological innovation.
                </p>
                <div className="h-1.5 w-24 bg-indigo-600 mx-auto mt-8 rounded-full"></div>
            </section>

            {/* --- FOUNDER SECTION --- */}
            <section className="container mx-auto px-6 mb-32 min-h-[300px]">
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-slate-100">
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-3/5 relative">
                            <img 
                                src={teamData.founder.image} 
                                alt={teamData.founder.name} 
                                className="w-200 h-50 object-cover min-h-[600px]"
                            />
                            <div className="absolute bottom-6 left-6">
                                <a href={teamData.founder.linkedin} className="p-3 bg-white text-indigo-600 rounded-2xl shadow-xl hover:scale-110 transition-transform inline-block">
                                    <Linkedin size={24} />
                                </a>
                            </div>
                        </div>
                        <div className="lg:w-3/5 p-8 md:p-16 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-4">
                                <Award className="text-emerald-500" size={24} />
                                <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">Founder Spotlight</span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-2">{teamData.founder.name}</h2>
                            <p className="text-indigo-600 font-bold text-xl mb-8">{teamData.founder.role}</p>
                            
                            <div className="relative">
                                <MessageSquareQuote className="absolute -top-6 -left-6 text-slate-100 h-16 w-16 -z-10" />
                                <p className="text-slate-600 text-lg italic leading-relaxed relative z-10">
                                    "{teamData.founder.message}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CO-FOUNDERS SECTION --- */}
            <section className="container mx-auto px-6 mb-32">
                <div className="text-center mb-16">
                    <h3 className="text-3xl font-black text-slate-900 mb-2">The Leadership Team</h3>
                    <p className="text-slate-500 font-medium">Driving the technology and operations of our platform.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {teamData.coFounders.map((cofounder, index) => (
                        <div key={index} className="group relative bg-white p-4 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-50">
                            <img 
                                src={cofounder.image} 
                                alt={cofounder.name} 
                                className="w-full h-80 object-cover rounded-[2rem] mb-6 group-hover:scale-[1.02] transition-transform"
                            />
                            <div className="text-center pb-4">
                                <h4 className="text-2xl font-black text-slate-900">{cofounder.name}</h4>
                                <p className="text-indigo-600 font-bold mb-4">{cofounder.role}</p>
                                <div className="flex justify-center gap-3">
                                    <a href={cofounder.linkedin} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
                                        <Linkedin size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- FACULTY MENTORS SECTION --- */}
            <section className="bg-slate-900 py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full mb-4 border border-white/10">
                            <GraduationCap className="text-indigo-400" size={20} />
                            <span className="text-indigo-300 font-bold text-xs uppercase tracking-widest">Academic Council</span>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black text-white mb-4">Faculty Mentors</h3>
                        <p className="text-slate-400 font-medium max-w-xl mx-auto">Our platform is constantly refined under the guidance of industry experts and esteemed professors.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {teamData.facultyMentors.map((mentor, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[2rem] text-center hover:bg-white/10 transition-colors group">
                                <img 
                                    src={mentor.image} 
                                    alt={mentor.name} 
                                    className="w-24 h-24 rounded-2xl mx-auto mb-4 object-cover border-2 border-indigo-500/30 group-hover:border-indigo-500 transition-colors"
                                />
                                <h5 className="text-white font-bold text-lg leading-tight mb-1">{mentor.name}</h5>
                                <p className="text-indigo-400 text-xs font-black uppercase tracking-wider mb-2">{mentor.title}</p>
                                <p className="text-slate-500 text-[11px] font-medium leading-tight">{mentor.dept}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA FOOTER --- */}
            <section className="container mx-auto px-6 pt-24 text-center">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[3rem] p-12 text-white shadow-2xl shadow-indigo-200">
                    <h2 className="text-3xl font-black mb-6">Have questions for the team?</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-50 transition-colors cursor-pointer">
                            <Mail size={20} />
                            Contact Us
                        </button>
                        <button className="bg-indigo-500/30 border border-white/20 px-8 py-4 rounded-2xl font-bold backdrop-blur-md hover:bg-indigo-500/50 transition-colors cursor-pointer">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TeamPage;