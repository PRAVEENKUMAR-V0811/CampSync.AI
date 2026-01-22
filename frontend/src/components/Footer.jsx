import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Github, Linkedin, Twitter, Mail, ArrowUp, 
  ChevronRight, BookOpen, GraduationCap, Cpu 
} from "lucide-react";
import toast from 'react-hot-toast';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    placement: [
      { name: "Placement Dashboard", path: "/placements/data" },
      { name: "Interview Insights", path: "/company-insights" },
      { name: "AI Mock Interview", path: "/interview" },
      { name: "Company Wise Prep", path: "/company-insights" },
    ],
    academics: [
      { name: "Study Materials", path: "/question-bank" },
      { name: "Upload Material", path: "/academic-papers-upload" },
      { name: "Mock Assessment", path: "/academics/tests" },
      { name: "Subject Roadmap", path: "/academics/roadmap" },
      { name: "AI Doubt Solver", path: "/academics/ai-tutor" },
    ],
    support: [
      { name: "Contact Support", path: "/contact" },
      { name: "Submit Feedback", path: "/submit-feedback" },
      { name: "Join Community", path: "/contact" },
    ]
  };

  // Function to handle navigation with screen size check for the Interview module
  const handleNavigation = (name, path) => {
    if (name === "AI Mock Interview") {
      const isLargeScreen = window.innerWidth >= 1024;

      if (!isLargeScreen) {
        toast.error(
          "This is enabled only for larger device like laptop or desktop",
          {
            duration: 3000,
            style: {
              borderRadius: '12px',
              background: '#0f172a',
              color: '#fff',
              fontWeight: '500'
            }
          }
        );
        return;
      }
    }
    navigate(path);
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & AI Tagline */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-2xl font-bold text-white">
                Camp<span className="text-sky-400">Sync.ai</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              The ultimate <span className="text-white">AI-powered</span> ecosystem for campus placements and academic excellence. Bridging the gap between learning and hiring.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-900 rounded-lg hover:text-sky-400 hover:bg-slate-800 transition-all cursor-pointer border border-slate-800"><Linkedin size={18} /></a>
              <a href="#" className="p-2 bg-slate-900 rounded-lg hover:text-sky-400 hover:bg-slate-800 transition-all cursor-pointer border border-slate-800"><Twitter size={18} /></a>
              <a href="#" className="p-2 bg-slate-900 rounded-lg hover:text-sky-400 hover:bg-slate-800 transition-all cursor-pointer border border-slate-800"><Github size={18} /></a>
            </div>
          </div>

          {/* Placement Features */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-[11px]">
              <Cpu size={14} className="text-sky-400" /> Placement Cell
            </h4>
            <ul className="space-y-4">
              {footerLinks.placement.map((link) => (
                <li key={link.name}>
                  <div 
                    onClick={() => handleNavigation(link.name, link.path)} 
                    className="flex items-center group hover:text-white transition-colors cursor-pointer text-sm"
                  >
                    <ChevronRight size={14} className="mr-2 text-indigo-500 opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" />
                    {link.name}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic Features */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-[11px]">
              <BookOpen size={14} className="text-sky-400" /> Academic Hub
            </h4>
            <ul className="space-y-4">
              {footerLinks.academics.map((link) => (
                <li key={link.name}>
                  <div 
                    onClick={() => handleNavigation(link.name, link.path)} 
                    className="flex items-center group hover:text-white transition-colors cursor-pointer text-sm"
                  >
                    <ChevronRight size={14} className="mr-2 text-indigo-500 opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" />
                    {link.name}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact/Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-[11px]">
              <GraduationCap size={14} className="text-sky-400" /> Career Growth
            </h4>
            <p className="text-sm mb-4">Subscribe to get AI-curated placement alerts and study notes.</p>
            <div className="flex group">
              <input 
                type="email" 
                placeholder="College Email" 
                className="bg-slate-900 border border-slate-800 rounded-l-xl px-4 py-2.5 w-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
              <button className="bg-indigo-600 hover:bg-indigo-50 text-white px-4 py-2.5 rounded-r-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/20">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal + About Grouping */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-xs tracking-wide">
            &copy; {currentYear} <span className="text-white font-bold">CampSync.ai</span>. Built for the next generation of engineers.
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[13px]">
            <Link to="/about-us" className="text-slate-400 hover:text-sky-400 transition-colors cursor-pointer font-medium">About Us</Link>
            <Link to="/Privacy" className="text-slate-400 hover:text-sky-400 transition-colors cursor-pointer font-medium">Privacy Policy</Link>
            <Link to="/Terms" className="text-slate-400 hover:text-sky-400 transition-colors cursor-pointer font-medium">Terms of Service</Link>
          </div>

          <button 
            onClick={scrollToTop}
            className="p-3 bg-slate-900 hover:bg-indigo-600 text-indigo-500 hover:text-white rounded-full transition-all duration-300 cursor-pointer group border border-slate-800"
            title="Back to Top"
          >
            <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;