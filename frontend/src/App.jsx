import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ContactUs from './pages/Contact/ContactUs';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import HomePage from './pages/Home/HomePage';
import ProfilePage from './pages/Profile/ProfilePage';
import TermsPage from './pages/Terms & Privacy/TermsPage';
import PrivacyPage from './pages/Terms & Privacy/PrivacyPage';
import CompanyInsightsPage from './pages/Company Insights/CompanyInsightsPage';
import InterviewExperienceSharingPage from './pages/Company Insights/InterviewExperienceSharingPage';
import QuestionPaperUpload from './pages/Academics/QuestionPaperUpload';
import PlacementTrendDashboard from './pages/PlacementTrends/PlacementTrendDashboard';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import ProtectedRoute from './pages/Auth/ProtectedRoute';
import AIMockInterview from './pages/AI Interview/AIMockInterview';
import QuestionBank from './pages/Academics/QuestionBank';
import MyUploads from './pages/Academics/MyUploads';
import InterviewExperienceDetailPage from './pages/Company Insights/InterviewExperienceDetailPage';
import AboutUs from './components/AboutUs';
import SubmitFeedback from './pages/Feedback/SubmitFeedback';
import ScrollToTop from './components/ScrollToTop';
// --- NEW IMPORTS FOR ADMIN ---
import AdminDashboard from '../src/pages/Admin/AdminDashboard'; // Your admin dashboard page
// --- END NEW IMPORTS ---

// Create a wrapper component to use useLocation
const AppWrapper = () => {
  const location = useLocation();
  // Ensure the noHeaderFooter array includes all paths that shouldn't have them,
  // including specific dynamic routes if needed, or refine the logic.
  // Note: /mock-interview is still here if you want to hide header/footer on the bot page
  const noHeaderFooter = ['/login', '/signup', '/mock-interview', '/forgotpassword', '/resetpassword', '/admin']; 

  const showHeaderFooter = !noHeaderFooter.some(path => location.pathname.startsWith(path));

  return (
    <>
      <ScrollToTop />
      {showHeaderFooter && <Header />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:resetToken" element={<ResetPassword />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/submit-feedback" element={<SubmitFeedback />} />


        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/company-insights" element={<CompanyInsightsPage />} />
          <Route path="/company-insights/:id" element={<InterviewExperienceDetailPage />} />
          <Route path="/share-experience" element={<InterviewExperienceSharingPage />} />
          <Route path="/placements/data" element={<PlacementTrendDashboard />} />
          <Route path="/academic-papers-upload" element={<QuestionPaperUpload />} />
          <Route path="/interview" element={<AIMockInterview />} />
          <Route path="/question-bank" element={<QuestionBank />} />
          <Route path="/my-uploads" element={<MyUploads />} />
        </Route>


        {/* --- ADMIN PROTECTED ROUTES --- */}
        {/* This route group will only be accessible to users with the 'admin' role */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />}> {/* AdminLayout will be the parent for all admin pages */}
            {/* <Route path="dashboard" element={<AdminDashboard />} /> /admin/dashboard */}
            {/* Add other admin-specific routes here */}
          </Route>
        </Route>
        {/* --- END ADMIN PROTECTED ROUTES --- */}
         {/* Catch-all route for 404 - Optional */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>

      {showHeaderFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <>
      <Router>
        <AppWrapper />
      </Router>

      {/* Toast Notifications */}
      <Toaster
        toastOptions={{
          className: "w-auto h-auto p-4 text-sm rounded shadow-lg bg-white text-black",
          duration: 2000,
          style: { fontSize: "16px", border: '1px solid #e2e8f0' },
        }}
        position="top-center"
      />
    </>
  );
};

export default App;