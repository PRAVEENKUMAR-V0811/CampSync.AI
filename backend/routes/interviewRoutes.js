const express = require('express');
const router = express.Router();
const InterviewExperience = require('../models/InterviewExperience');
const mongoose = require('mongoose'); // Import mongoose to use isValidObjectId

// POST a new interview experience
router.post('/', async (req, res) => {
  try {
    const newExperience = new InterviewExperience(req.body);
    await newExperience.save();
    res.status(201).json({ message: 'Experience submitted successfully!', experience: newExperience });
  } catch (error) {
    console.error('Error submitting experience:', error);
    res.status(400).json({ message: 'Failed to submit experience', error: error.message });
  }
});

// GET all interview experiences, with optional companyName filter
router.get('/', async (req, res) => {
  try {
    const { companyName } = req.query;
    let query = {};
    if (companyName) {
      query.companyName = { $regex: companyName, $options: 'i' }; // Case-insensitive search
    }
    const experiences = await InterviewExperience.find(query).sort({ createdAt: -1 });
    res.status(200).json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ message: 'Failed to fetch experiences', error: error.message });
  }
});

// GET unique company names for filter
router.get('/companies', async (req, res) => {
  try {
    const companies = await InterviewExperience.distinct('companyName');
    res.status(200).json(companies.sort());
  } catch (error) {
    console.error('Error fetching unique companies:', error);
    res.status(500).json({ message: 'Failed to fetch unique companies', error: error.message });
  }
});

// GET a single interview experience by ID for the detail page
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const experience = await InterviewExperience.findById(id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(200).json(experience);
  } catch (error) {
    console.error('Error fetching single experience:', error);
    res.status(500).json({ message: 'Failed to fetch experience', error: error.message });
  }
});

// POST to upvote an experience
router.post('/:id/upvote', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const experience = await InterviewExperience.findByIdAndUpdate(
      id,
      { $inc: { 'votes.upvotes': 1 } },
      { new: true } // Return the updated document
    );
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(200).json({ message: 'Upvoted successfully', experience });
  } catch (error) {
    console.error('Error upvoting experience:', error);
    res.status(500).json({ message: 'Failed to upvote experience', error: error.message });
  }
});

// POST to downvote an experience
router.post('/:id/downvote', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const experience = await InterviewExperience.findByIdAndUpdate(
      id,
      { $inc: { 'votes.downvotes': 1 } },
      { new: true } // Return the updated document
    );
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(200).json({ message: 'Downvoted successfully', experience });
  } catch (error) {
    console.error('Error downvoting experience:', error);
    res.status(500).json({ message: 'Failed to downvote experience', error: error.message });
  }
});

module.exports = router;