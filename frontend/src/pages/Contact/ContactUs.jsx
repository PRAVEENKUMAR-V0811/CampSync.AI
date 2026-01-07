import React, { useState } from "react";
import emailjs from '@emailjs/browser';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import contact from "../../assets/contactus.avif";
import { 
  ArrowLeft, 
  Mail, 
  User, 
  MessageSquare, 
  Send, 
  Loader2, 
  Sparkles,
  CheckCircle2,
  Home
} from "lucide-react";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setStatus("Sending...");

    emailjs
      .send(
        "service_bss2a6h",
        "template_bg1lvnu",
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "Gw41erOgGgrGjyrIh"
      )
      .then(
        () => {
          setStatus("");
          setFormData({ name: "", email: "", message: "" });
          setShowSuccessModal(true);
          
          // Auto redirect after 4 seconds
          setTimeout(() => {
            navigate("/");
          }, 4000);
        },
        (error) => {
          console.error(error);
          toast.error("Failed to send message. Try again later.");
          setStatus("");
        }
      );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* <Toaster position="top-right" /> */}
      
      {/* SUCCESS POPUP MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"></div>
          
          <div className="relative bg-white rounded-[40px] p-8 md:p-12 max-w-sm w-full shadow-2xl text-center transform animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 size={48} className="animate-bounce" />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-3">Message Sent!</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              Thank you for reaching out, <span className="text-indigo-600 font-bold">Team will get back to you</span> shortly via email.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-center space-x-3 text-indigo-600 font-bold text-sm">
                <Loader2 size={16} className="animate-spin" />
                <span>Returning to Home...</span>
              </div>
              
              <button 
                onClick={() => navigate('/')}
                className="w-full py-3 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <Home size={18} />
                <span>Go Home Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left: Contact Form */}
      <div className="md:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24 relative bg-white">
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div className="relative z-10 max-w-md w-full mx-auto">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition-all font-bold mb-10 group cursor-pointer"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-widest">Back Home</span>
          </button>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
              Contact Us
            </h2>
            <p className="text-slate-500 font-medium">
              Have questions or need assistance? Our team is here to help you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <User size={18} />
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-indigo-600 focus:outline-none transition-all font-medium text-slate-700"
              />
            </div>

            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-indigo-600 focus:outline-none transition-all font-medium text-slate-700"
              />
            </div>

            <div className="relative group">
              <span className="absolute left-4 top-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <MessageSquare size={18} />
              </span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="How can we help?"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-indigo-600 focus:outline-none transition-all font-medium text-slate-700 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "Sending..."}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-indigo-600 shadow-xl shadow-slate-200 hover:shadow-indigo-200 transition-all transform hover:-translate-y-1 active:scale-95 cursor-pointer flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === "Sending..." ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span className="uppercase tracking-widest text-sm">Sending...</span>
                </>
              ) : (
                <>
                  <span className="uppercase tracking-widest text-sm">Send Message</span>
                  <Send size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right: Image + Message Overlay */}
      <div
        className="md:w-1/2 relative min-h-[400px] md:min-h-screen flex flex-col justify-center items-center p-8 overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
          style={{ backgroundImage: `url(${contact})` }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-slate-900/40 to-transparent"></div>

        <div className="relative z-10 backdrop-blur-md bg-white/10 border border-white/20 p-8 md:p-12 rounded-[40px] max-w-sm text-center shadow-2xl">
          <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-6">
            <Mail className="text-sky-300" size={24} />
          </div>
          <h3 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight">We're Here <br/>to Help!</h3>
          <p className="text-indigo-50 font-medium leading-relaxed mb-6">
            Our support team typically responds within 2 hours during business hours.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-white/80 text-xs font-bold uppercase tracking-[0.2em]">
             <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
             <span>System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;