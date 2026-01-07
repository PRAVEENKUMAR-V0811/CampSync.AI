import React, { useState, useContext } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../api';
import AuthContext from '../Auth/AuthContext';
import { 
  ArrowLeft, Send, Star, MessageSquare, Layout, 
  Bug, Lightbulb, Smile, Loader2, CheckCircle2, Home, Sparkles
} from 'lucide-react';

const SubmitFeedback = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('General');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const categories = [
    { id: 'General', icon: Layout, label: 'General' },
    { id: 'Feature Request', icon: Lightbulb, label: 'Feature' },
    { id: 'Bug Report', icon: Bug, label: 'Bug' },
    { id: 'Improvement', icon: Smile, label: 'UI/UX' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return toast.error("Please share your thoughts.");

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_BASE_URL}/api/feedback`, { rating, category, message }, config);
      
      setLoading(false);
      setShowSuccessModal(true);

      setTimeout(() => {
        navigate('/');
      }, 3500);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to submit feedback.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center pt-20">
      {/* <Toaster position="top-right" /> */}
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-sky-200/30 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-indigo-200/30 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold mb-6 group cursor-pointer"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Dashboard</span>
        </button>

        {/* Main Split-Window Container */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-indigo-100/50 border border-white overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
          
          {/* LEFT SECTION: Assessment & Rating */}
          <div className="lg:w-5/12 bg-indigo-600 p-8 md:p-12 text-white relative overflow-hidden">
            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                  <MessageSquare className="text-sky-300" size={28} />
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-4">Share Your Thoughts</h2>
                <p className="text-indigo-100 font-medium">Your feedback helps us shape the future of this platform.</p>
              </div>

              <div className="space-y-10 mt-auto">
                {/* Category Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-indigo-200 uppercase tracking-[0.2em] mb-4">Feedback Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          category === cat.id 
                          ? 'border-white bg-white text-indigo-600 shadow-lg' 
                          : 'border-indigo-400/30 bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/40'
                        }`}
                      >
                        <cat.icon size={18} />
                        <span className="text-xs font-bold uppercase tracking-tighter">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Picker */}
                <div>
                  <label className="block text-[10px] font-bold text-indigo-200 uppercase tracking-[0.2em] mb-4">Your Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none group cursor-pointer"
                      >
                        <Star
                          size={32}
                          className={`transition-all duration-300 transform group-hover:scale-110 ${
                            star <= rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-indigo-400 fill-transparent'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-black text-sky-300 uppercase tracking-widest">
                    {rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                  </p>
                </div>
              </div>
            </div>

            {/* Background Decorative Icon */}
            <MessageSquare className="absolute -bottom-10 -left-10 text-white/5 w-64 h-64 rotate-12" />
          </div>

          {/* RIGHT SECTION: Message & Submit */}
          <div className="lg:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-slate-50/30">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-800">Details</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full">
                    {message.length} / 500
                  </span>
                </div>
                <textarea
                  rows="10"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:outline-none transition-all resize-none text-slate-700 font-medium placeholder:text-slate-300 shadow-sm"
                  placeholder="Tell us more about your experience, what you loved, or what we can fix..."
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center space-x-3 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <span className="uppercase tracking-[0.15em] text-sm">Submit Feedback</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
              
              <p className="text-[11px] text-slate-400 font-medium text-center italic">
                By submitting, you agree to help us improve your experience.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL POPUP */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"></div>
          
          <div className="relative bg-white rounded-[40px] p-8 md:p-12 max-w-sm w-full shadow-2xl text-center transform animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 size={48} className="animate-bounce" />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-3">Submission Success!</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              Your feedback has been recorded. We truly appreciate the time you took to help us improve.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-center space-x-3 text-indigo-600 font-bold text-sm">
                <Loader2 size={16} className="animate-spin" />
                <span>Redirecting you shortly...</span>
              </div>
              
              <button 
                onClick={() => navigate('/')}
                className="w-full py-3 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <Home size={18} />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitFeedback;