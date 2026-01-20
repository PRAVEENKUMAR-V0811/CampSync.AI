import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LogoLoader from './components/LogoLoader';

// --- GLOBAL COMPONENTS ---
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './pages/Auth/ProtectedRoute';
import FacultyDashboard from './pages/Admin/FacultyDashboard';

// --- LAZY LOADED PAGES ---
// Public Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ContactUs = lazy(() => import('./pages/Contact/ContactUs'));
const TermsPage = lazy(() => import('./pages/Terms & Privacy/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/Terms & Privacy/PrivacyPage'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const SubmitFeedback = lazy(() => import('./pages/Feedback/SubmitFeedback'));

// Auth Pages
const Login = lazy(() => import('./pages/Auth/Login'));
const Signup = lazy(() => import('./pages/Auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));

// Protected User Pages (Students)
const HomePage = lazy(() => import('./pages/Home/HomePage'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const CompanyInsightsPage = lazy(() => import('./pages/Company Insights/CompanyInsightsPage'));
const InterviewExperienceDetailPage = lazy(() => import('./pages/Company Insights/InterviewExperienceDetailPage'));
const InterviewExperienceSharingPage = lazy(() => import('./pages/Company Insights/InterviewExperienceSharingPage'));
const PlacementTrendDashboard = lazy(() => import('./pages/PlacementTrends/PlacementTrendDashboard'));
const QuestionPaperUpload = lazy(() => import('./pages/Academics/QuestionPaperUpload'));
const QuestionBank = lazy(() => import('./pages/Academics/QuestionBank'));
const MyUploads = lazy(() => import('./pages/Academics/MyUploads'));

// Standalone AI Interview
const AIMockInterview = lazy(() => import('./pages/AI Interview/AIMockInterview'));

// Admin & Faculty Pages
// Note: As per your requirement, Faculty now handles Document Approval (previously Admin roles)
const AdminDashboard = lazy(() => import('../src/pages/Admin/AdminDashboard'));

// 404 Page
const NotFound = lazy(() => import('../src/components/NotFound'));

// --- LAYOUT DEFINITIONS ---

const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <ScrollToTop />
    <Header />
    <main className="flex-grow">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
  </div>
);

const CleanLayout = () => (
  <div className="min-h-screen">
    <ScrollToTop />
    <main>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </main>
  </div>
);

const PageLoader = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-[#eff0f7] text-indigo-500">
    <Loader2 className="animate-spin mb-4" size={48} />
    <p className="text-xs font-black tracking-[0.3em] text-slate-800 animate-pulse">Hang On! Loading Content...</p>
  </div>
);

// --- MAIN APP COMPONENT ---

const App = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 4000); 
    return () => clearTimeout(timer);
  }, []);

  if (isAppLoading) {
    return <LogoLoader />;
  }

  return (
    <>
      <Router>
        <Routes>
          
          {/* A. ROUTES WITH HEADER & FOOTER */}
          <Route element={<MainLayout />}>
            {/* Public */}
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/submit-feedback" element={<SubmitFeedback />} />

            {/* Protected Student Routes (role: user) */}
            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
              <Route path="/dashboard" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/company-insights" element={<CompanyInsightsPage />} />
              <Route path="/company-insights/:id" element={<InterviewExperienceDetailPage />} />
              <Route path="/share-experience" element={<InterviewExperienceSharingPage />} />
              <Route path="/placements/data" element={<PlacementTrendDashboard />} />
              <Route path="/academic-papers-upload" element={<QuestionPaperUpload />} />
              <Route path="/question-bank" element={<QuestionBank />} />
              <Route path="/my-uploads" element={<MyUploads />} />
            </Route>

            
          </Route>


          {/* B. STANDALONE ROUTES (NO HEADER / NO FOOTER) */}
          <Route element={<CleanLayout />}>
            {/* Auth */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword/:resetToken" element={<ResetPassword />} />

            {/* Protected Full-Screen (Interview) - Students Only */}
            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
              <Route path="/interview" element={<AIMockInterview />} />
            </Route>

            {/* Protected Admin Routes (role: admin) */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>


            {/* Protected Faculty Routes (role: faculty) */}
            {/* Faculty handles document approval and student management */}
            <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
               <Route path="/faculty" element={<FacultyDashboard />} />
            </Route>

            {/* 404 NOT FOUND (Catch-all) */}
            <Route path="*" element={<NotFound />} />
          </Route>

        </Routes>
      </Router>

      {/* Global Toast Notifications */}
      <Toaster
        toastOptions={{
          className: "w-auto h-auto p-4 text-sm rounded shadow-lg bg-white text-black font-medium",
          duration: 3000,
          style: { 
            fontSize: "14px", 
            border: '1px solid #e2e8f0',
            borderRadius: '12px'
          },
        }}
        position="top-center"
      />
    </>
  );
};

export default App;