// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { protect } = require('../middleware/authMiddleware');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// ------------------ AUTH ROUTES ------------------

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', async (req, res) => {
  const { name, gender, email, password, phone, education, college, branch, passingYear, regNo, cgpa, historyOfArrear, currentBacklog, currentSemester } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { phone }, { regNo }] });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({
      name, gender, email, password, phone, education, college, branch, passingYear, regNo,
      role: 'user',
      // Store academic data as pending immediately
      academicUpdatePending: true,
      pendingData: {
        cgpa: cgpa || 0,
        historyOfArrear: historyOfArrear || 'No',
        currentBacklog: currentBacklog || 0,
        currentSemester: currentSemester || 1
      }
    });

    if (user) {
      res.status(201).json({ _id: user._id, token: generateToken(user._id) });
    }
  } catch (error) {
    res.status(500).json({ message: 'Signup failed' });
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

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User with that email not found' });
    }

    // Get reset token from user model method
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Frontend reset page URL
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    const message = `
      <h1>Password Reset Request</h1>
      <p>Please click below link to reset your password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
    `;

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      html: message,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
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
