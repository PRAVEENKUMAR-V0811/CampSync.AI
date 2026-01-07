// // src/components/modules/auth/Signup.js
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import TestimonialSlider from '../TestimonialSlider';
// import CompanyScroller from '../CompanyScroller';
// import { API_BASE_URL } from '../../api';

// const Signup = ({ onSwitchToLogin }) => {
//   const [name, setName] = useState('');
//   const [gender, setGender] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [phone, setPhone] = useState('');
//   const [education, setEducation] = useState('');
//   const [college, setCollege] = useState('');
//   const [branch, setBranch] = useState('');
//   const [passingYear, setPassingYear] = useState('');
//   const [agreedToTerms, setAgreedToTerms] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [passwordError, setPasswordError] = useState('');
//   const [confirmPasswordError, setConfirmPasswordError] = useState('');
//   const [phoneError, setPhoneError] = useState('');
//   const [termsError, setTermsError] = useState('');
//   const [signupError, setSignupError] = useState('');

//   const navigate = useNavigate();

//   const educationOptions = ["B.E", "B.Tech", "M.E", "M.Tech", "PhD", "MBA"];
//   const branchOptions = ["CSE", "CSE(AIML)", "EEE", "ECE", "IT"];
//   const currentYear = new Date().getFullYear();
//   const passingYearOptions = Array.from({ length: 10 }, (_, i) => currentYear + 5 - i);

//   const handleSignIn = () => {
//   navigate('/login')
// }

//   const validatePassword = (pwd) => {
//     if (!pwd) return "Password cannot be empty.";
//     if (pwd.length < 8) return "Password must be at least 8 characters long.";
//     if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter.";
//     if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter.";
//     if (!/\d/.test(pwd)) return "Password must contain at least one number.";
//     if (!/[!@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]/.test(pwd)) return "Password must contain at least one special character.";
//     return '';
//   };

//   const handlePasswordChange = (e) => {
//     const newPassword = e.target.value;
//     setPassword(newPassword);
//     setPasswordError(validatePassword(newPassword));
//     if (newPassword && confirmPassword && newPassword !== confirmPassword) {
//       setConfirmPasswordError("Passwords do not match.");
//     } else {
//       setConfirmPasswordError('');
//     }
//   };

//   const handleConfirmPasswordChange = (e) => {
//     const newConfirmPassword = e.target.value;
//     setConfirmPassword(newConfirmPassword);
//     if (password !== newConfirmPassword) {
//       setConfirmPasswordError("Passwords do not match.");
//     } else {
//       setConfirmPasswordError('');
//     }
//   };

//   const handlePhoneChange = (e) => {
//     const newPhone = e.target.value;
//     setPhone(newPhone);
//     if (!/^\d{10}$/.test(newPhone) && newPhone.length > 0) {
//       setPhoneError("Phone number must be 10 digits.");
//     } else {
//       setPhoneError('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSignupError('');
//     setIsLoading(true);

//     let isValid = true;
//     if (validatePassword(password)) {
//       setPasswordError(validatePassword(password));
//       isValid = false;
//     } else setPasswordError('');

//     if (password !== confirmPassword) {
//       setConfirmPasswordError("Passwords do not match.");
//       isValid = false;
//     } else setConfirmPasswordError('');

//     if (!/^\d{10}$/.test(phone)) {
//       setPhoneError("Phone number must be 10 digits.");
//       isValid = false;
//     } else setPhoneError('');

//     if (!agreedToTerms) {
//       setTermsError("You must agree to the Terms & Conditions.");
//       isValid = false;
//     } else setTermsError('');

//     if (!name || !gender || !email || !education || !college || !branch || !passingYear || !phone || !password || !confirmPassword) {
//       setSignupError('Please fill out all required fields.');
//       isValid = false;
//     }

//     if (isValid) {
//       try {
//         const config = { headers: { 'Content-Type': 'application/json' } };
//         const { data } = await axios.post(
//           `${API_BASE_URL}/api/auth/signup`,
//           {
//             name, gender, email, password, phone,
//             education, college, branch,
//             passingYear: parseInt(passingYear),
//           },
//           config
//         );
//         alert(`Account created for ${data.name}!`);
//         navigate('/login');
//       } catch (error) {
//         const errorMessage = error.response?.data?.message || error.message;
//         setSignupError(errorMessage);
//         alert(`Signup failed: ${errorMessage}`);
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       alert('Please correct the form errors.');
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col lg:flex-row">
//       {/* Left Side: Signup Form */}
//       <div className="flex-1 flex items-center justify-center bg-white px-8 py-12 overflow-y-auto">
//         <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
//           <h2 className="text-3xl font-bold text-gray-900 text-center">Sign Up</h2>
//           {signupError && <p className="mt-2 text-sm text-red-600 text-center">{signupError}</p>}

//           {/* Full Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//             <input
//               type="text"
//               required
//               disabled={isLoading}
//               className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="John Doe"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>

//           {/* Gender */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//             <div className="mt-1 flex space-x-4">
//               <label className="inline-flex items-center cursor-pointer">
//                 <input type="radio" name="gender" value="male" checked={gender === 'male'}
//                   onChange={(e) => setGender(e.target.value)} className="form-radio text-indigo-600 h-4 w-4" required disabled={isLoading} />
//                 <span className="ml-2">Male</span>
//               </label>
//               <label className="inline-flex items-center cursor-pointer">
//                 <input type="radio" name="gender" value="female" checked={gender === 'female'}
//                   onChange={(e) => setGender(e.target.value)} className="form-radio text-indigo-600 h-4 w-4" required disabled={isLoading} />
//                 <span className="ml-2">Female</span>
//               </label>
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//             <input
//               type="email"
//               required
//               disabled={isLoading}
//               className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="your.email@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//             <input
//               type="password"
//               required
//               disabled={isLoading}
//               className={`block w-full px-4 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-indigo-500`}
//               value={password}
//               onChange={handlePasswordChange}
//             />
//             {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//             <input
//               type="password"
//               required
//               disabled={isLoading}
//               className={`block w-full px-4 py-2 border ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-indigo-500`}
//               value={confirmPassword}
//               onChange={handleConfirmPasswordChange}
//             />
//             {confirmPasswordError && <p className="mt-1 text-xs text-red-600">{confirmPasswordError}</p>}
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//             <input
//               type="tel"
//               required
//               maxLength="10"
//               disabled={isLoading}
//               className={`block w-full px-4 py-2 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-indigo-500`}
//               value={phone}
//               onChange={handlePhoneChange}
//             />
//             {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
//           </div>

//           {/* Education */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
//             <select
//               required
//               disabled={isLoading}
//               className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-indigo-500"
//               value={education}
//               onChange={(e) => setEducation(e.target.value)}
//             >
//               <option value="" disabled>Select Education</option>
//               {educationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//             </select>
//           </div>

//           {/* College */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
//             <input
//               type="text"
//               required
//               disabled={isLoading}
//               className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500"
//               value={college}
//               onChange={(e) => setCollege(e.target.value)}
//             />
//           </div>

//           {/* Branch */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
//             <select
//               required
//               disabled={isLoading}
//               className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-indigo-500"
//               value={branch}
//               onChange={(e) => setBranch(e.target.value)}
//             >
//               <option value="" disabled>Select Branch</option>
//               {branchOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//             </select>
//           </div>

//           {/* Passing Year */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Passing Year</label>
//             <select
//               required
//               disabled={isLoading}
//               className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-indigo-500"
//               value={passingYear}
//               onChange={(e) => setPassingYear(e.target.value)}
//             >
//               <option value="" disabled>Select Passing Year</option>
//               {passingYearOptions.map(year => <option key={year} value={year}>{year}</option>)}
//             </select>
//           </div>

//           {/* Terms */}
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               checked={agreedToTerms}
//               onChange={(e) => { setAgreedToTerms(e.target.checked); setTermsError(''); }}
//               className="h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
//               required
//               disabled={isLoading}
//             />
//             <label className="ml-2 text-sm text-gray-900">
//               I agree to <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">Terms & Conditions</a>
//             </label>
//           </div>
//           {termsError && <p className="mt-1 text-xs text-red-600">{termsError}</p>}

//           {/* Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full py-2 px-4 rounded-md text-white font-semibold 
//               ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'}
//               focus:ring-2 focus:ring-indigo-500 transition duration-300`}
//           >
//             {isLoading ? (
//               <div className="flex items-center justify-center gap-2">
//                 <svg className="animate-spin h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
//                 </svg>
//                 Signing Up...
//               </div>
//             ) : 'Sign Up'}
//           </button>

//           <p className="mt-4 text-center text-sm text-gray-600">
//             Already have an account?{' '}
//             <button
//               type="button"
//               onClick={handleSignIn}
//               className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
//               disabled={isLoading}
//             >
//               Sign In
//             </button>
//           </p>
//         </form>
//       </div>

//       {/* Right Side */}
//       <div className="flex-1 hidden lg:flex flex-col items-center justify-center p-12 bg-gray-900 text-white overflow-hidden">
//         <div className="w-full text-center mb-10">
//           <h2 className="text-2xl font-bold">Companies</h2>
//           <p className="text-xl text-gray-300 mt-4">Want to know the secret behind cracking the below company exams?</p>
//           <CompanyScroller direction="ltr" speed="medium" theme="dark" />
//           <CompanyScroller direction="rtl" speed="medium" theme="dark" />
//         </div>

//         <section id="login" className="py-20 bg-indigo-700 text-white text-center mt-12 rounded-2xl shadow-lg">
//           <div className="container mx-auto px-6">
//             <h2 className="text-4xl font-bold mb-6">Ready to Boost Your Career?</h2>
//             <p className="text-xl mb-10 max-w-3xl mx-auto">
//               - Then Login with Us!
//             </p>
//             <Link
//               to="/login"
//               className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-lg px-10 py-5 rounded-full shadow-xl transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
//             >
//               Login now
//             </Link>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Signup;

// src/components/modules/auth/Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TestimonialSlider from '../TestimonialSlider';
import CompanyScroller from '../CompanyScroller';
import { API_BASE_URL } from '../../api';

const Signup = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [education, setEducation] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [passingYear, setPassingYear] = useState('');
  
  // New Fields State
  const [regNo, setRegNo] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [currentSemester, setCurrentSemester] = useState('');
  const [historyOfArrear, setHistoryOfArrear] = useState('No');
  const [currentBacklog, setCurrentBacklog] = useState('0');

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [signupError, setSignupError] = useState('');

  const navigate = useNavigate();

  const educationOptions = ["B.E", "B.Tech", "M.E", "M.Tech", "PhD", "MBA"];
  const branchOptions = ["CSE", "CSE(AIML)", "EEE", "ECE", "IT"];
  const currentYear = new Date().getFullYear();
  const passingYearOptions = Array.from({ length: 10 }, (_, i) => currentYear + 5 - i);

  const handleSignIn = () => {
    navigate('/login')
  }

  const validatePassword = (pwd) => {
    if (!pwd) return "Password cannot be empty.";
    if (pwd.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter.";
    if (!/\d/.test(pwd)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]/.test(pwd)) return "Password must contain at least one special character.";
    return '';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (password !== newConfirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError('');
    }
  };

  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    if (!/^\d{10}$/.test(newPhone) && newPhone.length > 0) {
      setPhoneError("Phone number must be 10 digits.");
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    setIsLoading(true);

    let isValid = true;
    if (validatePassword(password)) {
      setPasswordError(validatePassword(password));
      isValid = false;
    } else setPasswordError('');

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else setConfirmPasswordError('');

    if (!/^\d{10}$/.test(phone)) {
      setPhoneError("Phone number must be 10 digits.");
      isValid = false;
    } else setPhoneError('');

    if (!agreedToTerms) {
      setTermsError("You must agree to the Terms & Conditions.");
      isValid = false;
    } else setTermsError('');

    if (!name || !gender || !email || !education || !college || !branch || !passingYear || !phone || !password || !confirmPassword || !regNo) {
      setSignupError('Please fill out all required fields.');
      isValid = false;
    }

    if (isValid) {
      try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.post(
          `${API_BASE_URL}/api/auth/signup`,
          {
            name, gender, email, password, phone,
            education, college, branch,
            passingYear: parseInt(passingYear),
            regNo,
            cgpa: parseFloat(cgpa),
            currentSemester: parseInt(currentSemester),
            historyOfArrear,
            currentBacklog: parseInt(currentBacklog)
          },
          config
        );
        alert(`Account created for ${data.name}!`);
        navigate('/login');
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        setSignupError(errorMessage);
        alert(`Signup failed: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please correct the form errors.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex-1 flex items-center justify-center bg-white px-8 py-12 overflow-y-auto">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Sign Up</h2>
          {signupError && <p className="mt-2 text-sm text-red-600 text-center">{signupError}</p>}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              disabled={isLoading}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <div className="mt-1 flex space-x-4">
              <label className="inline-flex items-center cursor-pointer">
                <input type="radio" name="gender" value="male" checked={gender === 'male'}
                  onChange={(e) => setGender(e.target.value)} className="form-radio text-indigo-600 h-4 w-4" required disabled={isLoading} />
                <span className="ml-2">Male</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input type="radio" name="gender" value="female" checked={gender === 'female'}
                  onChange={(e) => setGender(e.target.value)} className="form-radio text-indigo-600 h-4 w-4" required disabled={isLoading} />
                <span className="ml-2">Female</span>
              </label>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              disabled={isLoading}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              disabled={isLoading}
              className={`block w-full px-4 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-indigo-500`}
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              disabled={isLoading}
              className={`block w-full px-4 py-2 border ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-indigo-500`}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {confirmPasswordError && <p className="mt-1 text-xs text-red-600">{confirmPasswordError}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              maxLength="10"
              disabled={isLoading}
              className={`block w-full px-4 py-2 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-indigo-500`}
              value={phone}
              onChange={handlePhoneChange}
            />
            {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
          </div>

          {/* Register Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Register Number</label>
            <input 
              name="regNo" 
              placeholder="Register Number" 
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)} 
              required 
              disabled={isLoading}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
            <select
              required
              disabled={isLoading}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-indigo-500"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            >
              <option value="" disabled>Select Education</option>
              {educationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          {/* College */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
            <input
              type="text"
              required
              disabled={isLoading}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <select
              required
              disabled={isLoading}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-indigo-500"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              <option value="" disabled>Select Branch</option>
              {branchOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          {/* Current Semester */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Semester</label>
            <input 
                name="currentSemester" 
                type="number" 
                placeholder="Current Semester" 
                value={currentSemester}
                onChange={(e) => setCurrentSemester(e.target.value)} 
                disabled={isLoading}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500" 
            />
          </div>

          {/* Passing Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passing Year</label>
            <select
              required
              disabled={isLoading}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-indigo-500"
              value={passingYear}
              onChange={(e) => setPassingYear(e.target.value)}
            >
              <option value="" disabled>Select Passing Year</option>
              {passingYearOptions.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>

          {/* CGPA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current CGPA</label>
            <input 
                name="cgpa" 
                type="number" 
                step="0.01" 
                placeholder="Current CGPA" 
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)} 
                disabled={isLoading}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500" 
            />
          </div>

          {/* History of Arrear */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">History of Arrear</label>
            <select 
                name="historyOfArrear" 
                value={historyOfArrear}
                onChange={(e) => setHistoryOfArrear(e.target.value)} 
                disabled={isLoading}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-indigo-500"
            >
                <option value="No">No History of Arrears</option>
                <option value="Yes">Has History of Arrears</option>
            </select>
          </div>

          {/* Current Backlog */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Backlog Count</label>
            <input 
                name="currentBacklog" 
                type="number" 
                placeholder="Current Backlog Count" 
                value={currentBacklog}
                onChange={(e) => setCurrentBacklog(e.target.value)} 
                disabled={isLoading}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500" 
            />
          </div>

          {/* Terms */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => { setAgreedToTerms(e.target.checked); setTermsError(''); }}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
              required
              disabled={isLoading}
            />
            <label className="ml-2 text-sm text-gray-900">
              I agree to <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">Terms & Conditions</a>
            </label>
          </div>
          {termsError && <p className="mt-1 text-xs text-red-600">{termsError}</p>}

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold 
              ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'}
              focus:ring-2 focus:ring-indigo-500 transition duration-300`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Signing Up...
              </div>
            ) : 'Sign Up'}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={handleSignIn}
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
              disabled={isLoading}
            >
              Sign In
            </button>
          </p>
        </form>
      </div>

      {/* Right Side */}
      <div className="flex-1 hidden lg:flex flex-col items-center justify-center p-12 bg-gray-900 text-white overflow-hidden">
        <div className="w-full text-center mb-10">
          <h2 className="text-2xl font-bold">Companies</h2>
          <p className="text-xl text-gray-300 mt-4">Want to know the secret behind cracking the below company exams?</p>
          <CompanyScroller direction="ltr" speed="medium" theme="dark" />
          <CompanyScroller direction="rtl" speed="medium" theme="dark" />
        </div>

        <section id="login" className="py-20 bg-indigo-700 text-white text-center mt-12 rounded-2xl shadow-lg">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-6">Ready to Boost Your Career?</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto">
              - Then Login with Us!
            </p>
            <Link
              to="/login"
              className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-lg px-10 py-5 rounded-full shadow-xl transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
            >
              Login now
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Signup;