// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Class = require('../models/Class');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { protect } = require('../middleware/authMiddleware');
const axios = require('axios'); 
const SystemConfig = require('../models/SystemConfig');

// --- EMAIL CONFIGURATION HELPER (API METHOD) ---
const sendEmail = async (options) => {
  const brevoData = {
    sender: { name: "CampSync.AI", email: process.env.EMAIL_FROM },
    to: [{ email: options.email }],
    subject: options.subject,
    htmlContent: options.message, // Brevo API uses htmlContent field
  };

  try {
    await axios.post('https://api.brevo.com/v3/smtp/email', brevoData, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Brevo API Error:", error.response ? error.response.data : error.message);
    throw new Error("Email could not be sent");
  }
};

// --- EMAIL ASSETS ---
const logoUrl = "https://campsync-ai.vercel.app/assets/5-D8xfYK55.jpg";
const frontendUrl = process.env.FRONTEND_URL;
const contactUrl = `${frontendUrl}/contact`;

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '2h',
  });
};

// ------------------ AUTH ROUTES ------------------

// @desc    Register a new student & Auto-assign Faculty
// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { 
    name, gender, email, password, phone, education, 
    branch, passingYear, section, college, regNo, 
    cgpa, currentSemester, historyOfArrear, currentBacklog 
  } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { phone }, { regNo }] });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const classMapping = await Class.findOne({ 
      education, 
      branch, 
      section, 
      passingYear 
    });

    // --- AUTOMATIC FACULTY MAPPING ---
    // Look for a faculty member mapped to this specific class
    const assignedFaculty = await User.findOne({
      role: 'faculty',
      education,
      branch,
      section,
      passingYear // Or yearOfStudy depending on your mapping preference
    });

    const user = await User.create({
      name, gender, email, password, phone, education, branch, 
      passingYear, section, college, regNo,
      role: 'user',
      assignedFaculty: classMapping ? classMapping.faculty : null,
      academicUpdatePending: true,
      pendingData: { cgpa, currentSemester, historyOfArrear, currentBacklog }
    });
      if (user) {
      // --- WELCOME EMAIL TEMPLATE ---
      const welcomeMessage = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
          <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-bottom: 1px solid #e2e8f0;">
            <img src="${logoUrl}" alt="Logo" style="height: 50px; width: auto; margin: 0 auto;">
          </div>
          <div style="padding: 40px 30px; text-align: center;">
            <h2 style="color: #1e293b; font-size: 24px; font-weight: 800;">Welcome to CampSync.AI, ${name.split(' ')[0]}! </h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              We're thrilled to have you on board. CampSync.AI is built to help you bridge the gap between academics and your dream career.
            </p>
            <div style="text-align: left; background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 25px 0;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #1e293b;">What's next?</p>
              <ul style="color: #475569; font-size: 14px; padding-left: 20px;">
                <li>Practice with AI Mock Interviews</li>
                <li>Analyze Top Company Placement Trends</li>
                <li>Access Academic Resources and Papers</li>
              </ul>
            </div>
            <a href="${frontendUrl}/login" style="background-color: #4f46e5; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
            <div style="margin-top: 30px; text-align: center; color: #334155;">
              <p style="margin: 0; font-size: 14px;">Best Wishes from</p>
              <p style="margin: 6px 0 0 0; font-size: 15px; font-weight: 700;">
                Mr. V. Praveen Kumar
              </p>
              <p style="margin: 6px 0 0 0; font-size: 13px; font-weight: 600; color: #4f46e5;">
                Founder of CampSync.AI
              </p>
            </div>
          </div>
          <p style="margin-top: 25px; font-size: 11px; color: #64748b;">
            &copy; ${new Date().getFullYear()} CampSync.AI. All rights reserved.
          </p>
        </div>
      `;
      }
      // Send email (we don't 'await' this so the user doesn't wait for the email to send before seeing 'Success')
      sendEmail({
        email: user.email,
        subject: 'Welcome to CampSync.AI! Your journey starts here.',
        message: welcomeMessage
      }).catch(err => console.error("Welcome email failed", err));


    res.status(201).json({ _id: user._id, token: generateToken(user._id), role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});


// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ------------------ PASSWORD RESET ------------------

// @desc    Request Password Reset Link
// @route   POST /api/auth/forgotpassword
// @access  Public
router.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;
  let user; // ✅ declare here

  try {
    user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User with that email not found' });
    }

    const resetToken = user.getResetPasswordToken();

    // ✅ IMPORTANT: disable password validation
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;


const message = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
    
    <!-- Header with Logo -->
    <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-bottom: 1px solid #e2e8f0;">
      <img src="${logoUrl}" alt="CampSync.AI Logo" style="height: 50px; width: auto; display: block; margin: 0 auto;">
    </div>

    <!-- Body Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #1e293b; margin-top: 0; font-size: 24px; font-weight: 800; text-align: center;">Password Reset Request</h2>
      <p style="color: #475569; font-size: 16px; line-height: 1.6; text-align: center;">
        We received a request to reset your password for your <strong>CampSync.AI</strong> account.
      </p>
      <p style="color: #475569; font-size: 16px; line-height: 1.6; text-align: center;">
        Please click the button below to reset it. This link is valid for <strong>15 minutes</strong>.
      </p>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 35px 0;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
          Reset My Password
        </a>
      </div>

      <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; text-align: center;">
        If the button doesn't work, copy and paste this link into your browser:
      </p>
      <p style="word-break: break-all; color: #6366f1; font-size: 13px; text-align: center; padding: 10px; background-color: #f1f5f9; border-radius: 8px;">
        ${resetUrl}
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #1e293b; padding: 30px; text-align: center; color: #cbd5e1;">
      <p style="margin: 0; font-size: 14px; font-weight: bold;">Powered by CampSync.AI</p>
      <p style="margin: 10px 0 20px 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
        Intelligent tools for campus placements and academic excellence.
      </p>
      
      <div style="border-top: 1px solid #334155; padding-top: 20px;">
        <a href="${contactUrl}" style="color: #818cf8; text-decoration: none; font-size: 13px; font-weight: 600; margin: 0 10px;">Contact Us</a>
        <span style="color: #475569;">•</span>
        <a href="${frontendUrl}" style="color: #818cf8; text-decoration: none; font-size: 13px; font-weight: 600; margin: 0 10px;">Visit Website</a>
      </div>
      
      <p style="margin-top: 25px; font-size: 11px; color: #64748b;">
        &copy; ${new Date().getFullYear()} CampSync.AI. All rights reserved.
      </p>
    </div>
  </div>
`;

    // --- UPDATED BREVO TRANSPORTER ---
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: process.env.BREVO_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });

    const mailOptions = {
      from: `CampSync.AI <${process.env.EMAIL_FROM}>`, // Must be a verified sender in Brevo
      to: user.email,
      subject: 'Password Reset Request | CampSync.AI',
      html: message,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset link sent to email' });

  } catch (error) {
    console.error('Forgot password error:', error);
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }
    res.status(500).json({ message: 'Error sending reset email' });
  }
});

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resetToken
// @access  Public
router.put('/resetpassword/:resetToken', async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// Public check for the dashboard
router.get('/update-status', protect, async (req, res) => {
  const config = await SystemConfig.findOne({ key: "placement_update_window" });
  if (!config) return res.json({ isActive: false });

  const now = new Date();
  const isActive = now >= new Date(config.startTime) && now <= new Date(config.endTime);
  
  res.json({ 
    isActive, 
    endTime: config.endTime,
    message: config.message 
  });
});

// backend/routes/placement.js
router.get('/trends', protect, async (req, res) => {
  try {
    // Only fetch fields needed for charts to protect student privacy
    const placementData = await User.find({ role: 'user' })
      .select('branch passingYear placementStatus packageLPA recentCompany createdAt placedDate offersCount');
    
    res.json(placementData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trends", error: error.message });
  }
});

router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password'); // Exclude password

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      regNo: user.regNo,
      gender: user.gender,
      email: user.email,
      phone: user.phone,
      education: user.education,
      college: user.college,
      branch: user.branch,
      passingYear: user.passingYear,
      role: user.role,
      // --- ADD THESE FIELDS BELOW ---
      cgpa: user.cgpa,
      historyOfArrear: user.historyOfArrear,
      currentBacklog: user.currentBacklog,
      currentSemester: user.currentSemester,
      academicUpdatePending: user.academicUpdatePending,
      pendingData: user.pendingData,
      
      placementStatus: user.placementStatus,
      recentCompany: user.recentCompany,
      packageLPA: user.packageLPA,
      jobType: user.jobType,
      internStipend: user.internStipend,
      offersCount: user.offersCount,
      // ------------------------------
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Update Basic Info immediately
    user.name = req.body.name || user.name;
    user.gender = req.body.gender || user.gender;
    user.education = req.body.education || user.education;
    user.college = req.body.college || user.college;
    user.branch = req.body.branch || user.branch;

    // 2. Move Academic Info to Pending (Match your schema: pendingData)
    if (req.body.cgpa !== undefined || req.body.currentSemester !== undefined) {
      user.academicUpdatePending = true;
      user.pendingData = {
        cgpa: req.body.cgpa || user.cgpa,
        historyOfArrear: req.body.historyOfArrear || user.historyOfArrear,
        currentBacklog: req.body.currentBacklog || user.currentBacklog,
        currentSemester: req.body.currentSemester || user.currentSemester
      };
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;