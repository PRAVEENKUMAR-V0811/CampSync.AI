const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect, admin } = require('../middleware/authMiddleware'); // Your existing auth middleware

// @desc    Submit feedback (User)
// @route   POST /api/feedback
router.post('/', protect, async (req, res) => {
  try {
    const { category, rating, message } = req.body;
    const feedback = await Feedback.create({
      user: req.user._id,
      category,
      rating,
      message
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all feedback (Admin)
// @route   GET /api/admin/feedback
router.get('/all', protect, admin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;