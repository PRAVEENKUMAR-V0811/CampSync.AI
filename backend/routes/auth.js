// // backend/routes/auth.js
// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const User = require('../models/user'); // User model
// const { protect } = require('../middleware/authMiddleware'); // We'll create this middleware
// const nodemailer = require('nodemailer');
// const crypto = require('crypto'); // Required for token hashing on verification

// // Generate JWT
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '1h', // Token expires in 1 hour
//   });
// };


// // --- NEW FORGOT PASSWORD ROUTES ---

// // @desc    Request Password Reset Link
// // @route   POST /api/auth/forgotpassword
// // @access  Public
// router.post('/forgotpassword', async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: 'User with that email not found' });
//     }

//     // Get reset token from User model method
//     const resetToken = user.getResetPasswordToken();
//     await user.save(); // Save user with the new hashed token and expiry

//     // Create reset URL for the frontend
//     // IMPORTANT: Replace with your actual frontend URL
//     const resetUrl = `http://localhost:5173/resetpassword/${resetToken}`;

//     const message = `
//       <h1>You have requested a password reset</h1>
//       <p>Please go to this link to reset your password:</p>
//       <a href="${resetUrl}" target="_blank">${resetUrl}</a>
//       <p>This link will expire in 15 minutes.</p>
//       <p>If you did not request this, please ignore this email.</p>
//     `;

//     // Configure Nodemailer transporter
//     const transporter = nodemailer.createTransport({
//       service: 'gmail', // or 'smtp' if using custom server
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       to: user.email,
//       from: process.env.EMAIL_USER,
//       subject: 'Password Reset Request',
//       html: message,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: 'Email sent successfully' });

//   } catch (error) {
//     console.error('Forgot password error:', error);
//     // Clear reset token fields if there was an email sending error
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save();
//     res.status(500).json({ message: 'Error sending email' });
//   }
// });

// // @desc    Reset Password
// // @route   PUT /api/auth/resetpassword/:resetToken
// // @access  Public
// router.put('/resetpassword/:resetToken', async (req, res) => {
//   // Compare the token from the URL with the hashed token in the database
//   const resetPasswordToken = crypto
//     .createHash('sha256')
//     .update(req.params.resetToken)
//     .digest('hex');

//   try {
//     const user = await User.findOne({
//       resetPasswordToken,
//       resetPasswordExpire: { $gt: Date.now() }, // Token must not be expired
//     });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired reset token' });
//     }

//     // Set new password
//     user.password = req.body.password; // The pre-save hook will hash this
//     user.resetPasswordToken = undefined; // Clear the token
//     user.resetPasswordExpire = undefined; // Clear the expiry
//     await user.save();

//     res.status(200).json({ message: 'Password reset successful. You can now log in with your new password.' });

//   } catch (error) {
//     console.error('Reset password error:', error);
//     res.status(500).json({ message: 'Error resetting password' });
//   }
// });


// // @desc    Register a new user
// // @route   POST /api/auth/signup
// // @access  Public
// router.post('/signup', async (req, res) => {
//   const { name, gender, email, password, phone, education, college, branch, passingYear } = req.body;

//   try {
//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const user = await User.create({
//       name,
//       gender,
//       email,
//       password, // Password will be hashed in the pre-save hook
//       phone,
//       education,
//       college,
//       branch,
//       passingYear,
//     });

//     if (user) {
//       res.status(201).json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         token: generateToken(user._id),
//         message: 'Registration successful'
//       });
//     } else {
//       res.status(400).json({ message: 'Invalid user data' });
//     }
//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({ message: 'Server error during signup' });
//   }
// });

// // @desc    Authenticate user & get token
// // @route   POST /api/auth/login
// // @access  Public
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (user && (await user.matchPassword(password))) {
//       res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         token: generateToken(user._id),
//         message: 'Login successful'
//       });
//     } else {
//       res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// });

// // @desc    Get user profile (example of a protected route)
// // @route   GET /api/auth/profile
// // @access  Private
// router.get('/profile', protect, (req, res) => {
//   // req.user is set by the protect middleware
//   res.json({
//     _id: req.user._id,
//     name: req.user.name,
//     email: req.user.email,
//     // You can send other non-sensitive user data here
//   });
// });

// module.exports = router;


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
  const { name, gender, email, password, phone, education, college, branch, passingYear } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });

    if (userExists) {
      return res.status(400).json({ message: 'User with that email or phone already exists' });
    }

    const user = await User.create({
      name,
      gender,
      email,
      password, // hashed in pre-save hook
      phone,
      education,
      college,
      branch,
      passingYear,
      role: 'user', // Default role
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
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
      gender: user.gender,
      email: user.email,
      phone: user.phone,
      education: user.education,
      college: user.college,
      branch: user.branch,
      passingYear: user.passingYear,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});
module.exports = router;
