import React, { useState, useEffect} from 'react';
import { 
    FaRobot, FaChartLine, FaBuilding, FaBookOpen, 
    FaUserGraduate, FaLightbulb 
} from "react-icons/fa";
import { 
    Menu, X, LogIn 
} from 'lucide-react';
import { useNavigate, Link} from 'react-router-dom';

// Assets
import HeroImg from "../assets/heroimg.png"; 
import campsyncPromoVideo from "../assets/Videos/CampSync.AI Promo.mp4";
import logo from "../assets/logofinal.png"; 

// Components
import CompanyScroller from './CompanyScroller';
import FAQSection from '../components/FAQSection';
import ScrollDownButton from './ScrollDownButton';
import TestimonialSlider from './TestimonialSlider';

const LandingPage = () => {
    const navigate = useNavigate();
    
    // Header States
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle Scroll for Glassmorphism
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCTA = () => {
      navigate("/signup");
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 overflow-x-hidden">
            
            {/* --- INTEGRATED HEADER --- */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled 
                ? 'bg-white/80 backdrop-blur-lg shadow-lg py-2' 
                : 'bg-white py-4'
            }`}>
                <nav className="container mx-auto px-5 md:px-8 flex items-center justify-between">
                    
                    {/* Logo Section */}
                    <div 
                        className="flex shrink-0 items-center space-x-3 cursor-pointer group" 
                        onClick={() => navigate('/')}
                    >
                        <img src={logo} alt="Logo" className="h-12 w-auto group-hover:scale-110 transition-transform duration-300" />
                        <div className="hidden sm:block">
                            <p className="text-sm font-black text-slate-900 leading-none">CampSync.AI</p>
                            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Intelligent Campus Management</p>
                        </div>
                    </div>

                    

                    {/* Desktop Auth Actions */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <button 
                            onClick={() => navigate('/login')}
                            className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => navigate('/signup')}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all cursor-pointer"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden p-2.5 text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                    >
                        <Menu size={28} />
                    </button>
                </nav>

                {/* Mobile Sidebar Overlay */}
                <div 
                    className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${
                        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                />

                {/* Mobile Sidebar Content */}
                <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[60] lg:hidden transform transition-transform duration-500 ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    <div className="flex flex-col h-full p-6">
                        <div className="flex justify-between items-center mb-10">
                            <img src={logo} alt="Logo" className="h-8 w-auto" />
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                            <button 
                                onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                                className="flex items-center space-x-4 w-full p-4 text-slate-700 hover:bg-slate-50 rounded-2xl font-semibold cursor-pointer"
                            >
                                <LogIn size={22} className="text-slate-400" />
                                <span>Login</span>
                            </button>
                            <button 
                                onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }}
                                className="w-full p-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 cursor-pointer text-center"
                            >
                                Get Started Free
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Wrapper */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">

                {/* Hero Section */}
                <section className="flex flex-col md:flex-row items-center justify-between py-12 md:py-20 gap-10">
                    <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 leading-[1.1]">
                            Your Future Starts Here.{" "}
                            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-emerald-500 to-indigo-600 bg-[length:200%_200%] animate-text-shine">
                                Powered by AI.
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto md:mx-0 leading-relaxed">
                            CampSync.AI empowers students and alumni with intelligent tools 
                            <span className="block font-semibold text-emerald-600 mt-1">for campus placements and academic excellence.</span>
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
                            <button
                                className="w-full sm:w-auto bg-gray-900 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                onClick={handleCTA}
                            >
                                Get Started Free
                            </button>
                            <button 
                                onClick={() => document.getElementById('features').scrollIntoView({behavior: 'smooth'})}
                                className="w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 hover:border-indigo-600 transition-all cursor-pointer"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-1/2 relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-100 to-emerald-100 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition duration-1000"></div>
                        <img
                            src={HeroImg}
                            alt="CampSync.AI Hero"
                            className="relative w-full h-auto max-h-[500px] object-contain mx-auto rounded-3xl shadow-2xl transform transition duration-500 group-hover:scale-[1.02]"
                        />
                    </div>
                </section>

                <div className="flex justify-center pb-12 cursor-pointer">
                    <ScrollDownButton targetId="promotional-video" />
                </div>

                {/* Promotional Video Section */}
                <section id="promotional-video" className="py-20">
                    <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-xl border border-gray-100">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">See CampSync.AI in Action</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Discover how our platform transforms your career journey with powerful AI-driven insights.
                            </p>
                        </div>
                        <div className="relative max-w-5xl mx-auto overflow-hidden shadow-2xl border-white group cursor-pointer">
                            <video
                                src={campsyncPromoVideo}
                                title="CampSync.AI Promotional Video"
                                controls
                                loop
                                className="w-full aspect-video object-cover"
                            />
                        </div>
                        <p className="text-center mt-6 text-sm font-medium text-indigo-500 animate-pulse">
                           CampSync.AI - Designed by the students for the students
                        </p>
                    </div>
                </section>

                {/* Companies Section */}
                <section id="companies-section" className="py-20">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-bold tracking-widest uppercase text-sm">Top Recruiters</span>
                        <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Crack the Top Companies</h2>
                        <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
                            From syllabus breakdowns to mock interview prep—everything you need to land your dream job.
                        </p>
                    </div>
                    <div className="space-y-10">
                        <CompanyScroller direction="ltr" speed="medium" />
                        <CompanyScroller direction="rtl" speed="medium" />
                        <CompanyScroller direction="ltr" speed="medium" />
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900">Platform Features</h2>
                        <div className="h-1.5 w-20 bg-indigo-600 mx-auto mt-4 rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="group p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 ${feature.bgColor} ${feature.color} group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Testimonial Section */}
                <div className="py-16">
                    <TestimonialSlider />
                </div>
                
                {/* FAQ Section */}
                <div className="py-16">
                    <FAQSection />
                </div>

                {/* Call to Action */}
                <section id="signup" className="py-20 my-20">
                    <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 rounded-[3rem] p-8 md:p-20 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6">Ready to Boost Your Career?</h2>
                            <p className="text-indigo-100 text-xl mb-12 max-w-2xl mx-auto">
                                Join thousands of students leveraging AI to secure placements at world-class companies.
                            </p>
                            <Link to="/signup" className="inline-block bg-white text-indigo-700 hover:bg-emerald-50 font-black text-xl px-14 py-5 rounded-2xl shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
                                Get Started for Free
                            </Link>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

// Features Data
const features = [
    {
        icon: <FaRobot />,
        title: "AI Mock Interviews",
        desc: "Practice HR and technical interviews with our AI bot, getting instant feedback and personalized tips.",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50"
    },
    {
        icon: <FaChartLine />,
        title: "Placement Trends",
        desc: "Visualize company visits, hiring patterns, and difficulty trends to strategize your preparation.",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50"
    },
    {
        icon: <FaBuilding />,
        title: "Company Insights",
        desc: "Get deep dives into specific companies: most-asked questions, difficulty levels, and hiring patterns.",
        color: "text-rose-600",
        bgColor: "bg-rose-50"
    },
    {
        icon: <FaBookOpen />,
        title: "Academic Papers",
        desc: "Access a repository of previous year question papers, filterable by subject and year.",
        color: "text-amber-600",
        bgColor: "bg-amber-50"
    },
    {
        icon: <FaUserGraduate />,
        title: "Personalized Profile",
        desc: "Track your progress, get tailored recommendations, and see alumni contributions.",
        color: "text-purple-600",
        bgColor: "bg-purple-50"
    },
    {
        icon: <FaLightbulb />,
        title: "Smart Recommendations",
        desc: "Our AI suggests learning paths and resources based on your goals and performance.",
        color: "text-cyan-600",
        bgColor: "bg-cyan-50"
    }
];

export default LandingPage;