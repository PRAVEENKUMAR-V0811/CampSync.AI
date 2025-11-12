// backend/routes/questionPaper.js
const express = require('express');
const router = express.Router();
const QuestionPaper = require('../QuestionPaper/QuestionPaper');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
// @desc    Upload a new question paper
// @route   POST /api/question-papers/upload
// @access  Private (Users must be logged in)
router.post('/upload', protect, upload.single('questionPaperFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const { title, description, subject, exam_name, year, tags } = req.body;

  if (!title || !subject || !exam_name || !year) {
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting local file after validation failure:', err);
    });
    return res.status(400).json({ message: 'Please provide all required fields: title, subject, exam name, and year.' });
  }

  try {
    let resourceType = 'auto';
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    if (fileExtension === '.pdf') {
      resourceType = 'raw';
    } else if (['.doc', '.docx'].includes(fileExtension)) {
      resourceType = 'raw';
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'question_papers',
      resource_type: resourceType,
      public_id: `qp_${path.parse(req.file.filename).name}`,
    });

    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting local file after successful Cloudinary upload:', err);
    });

    const newPaper = new QuestionPaper({
      title,
      description,
      subject,
      exam_name,
      year: parseInt(year),
      file_url: result.secure_url,
      original_filename: req.file.originalname,
      uploaded_by_user: req.user._id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: 'Pending',
      cloudinary_public_id: result.public_id,
    });

    const createdPaper = await newPaper.save();
    res.status(201).json(createdPaper);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting local file after failed Cloudinary/DB attempt:', err);
      });
    }
    console.error('Error uploading question paper:', error);
    res.status(500).json({ message: 'Server error during upload', error: error.message });
  }
});

// @desc    Get all APPROVED question papers (for users)
// @route   GET /api/question-papers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { subject, exam_name, year, search } = req.query;
    const query = { status: 'Approved', is_active: true };

    if (subject) query.subject = new RegExp(subject, 'i');
    if (exam_name) query.exam_name = new RegExp(exam_name, 'i');
    if (year) query.year = parseInt(year);
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { subject: new RegExp(search, 'i') },
        { exam_name: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    const papers = await QuestionPaper.find(query).sort({ createdAt: -1 });
    res.json(papers);
  } catch (error) {
    console.error('Error fetching approved question papers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get a specific APPROVED question paper by ID
// @route   GET /api/question-papers/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const paper = await QuestionPaper.findOne({ _id: req.params.id, status: 'Approved', is_active: true });
    if (!paper) {
      return res.status(404).json({ message: 'Approved question paper not found' });
    }
    res.json(paper);
  } catch (error) {
    console.error('Error fetching approved question paper by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all PENDING question papers (for Admin)
// @route   GET /api/admin/question-papers/pending
// @access  Private/Admin
router.get('/admin/pending', protect, admin, async (req, res) => {
  try {
    const pendingPapers = await QuestionPaper.find({ status: 'Pending' })
      .populate('uploaded_by_user', 'name email')
      .sort({ createdAt: -1 });
    res.json(pendingPapers);
  } catch (error) {
    console.error('Error fetching pending question papers:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @desc    Get all question papers (Admin)
// @route   GET /api/admin/question-papers/all
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const allPapers = await QuestionPaper.find({})
      .populate('uploaded_by_user', 'name email')
      .populate('approved_by_admin', 'name email')
      .sort({ createdAt: -1 });
    res.json(allPapers);
  } catch (error) {
    console.error('Error fetching all question papers for admin:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @desc    Get question papers uploaded by the logged-in user
// @route   GET /api/question-papers/my-uploads
// @access  Private (User must be logged in)

router.get('/get-approved-question-paper/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid ID format",
      });
    }

    const paper = await QuestionPaper.findOne({ _id: id, status: "Approved" });

    if (!paper) {
      return res.status(404).json({
        status: false,
        message: "Question paper not found",
      });
    }

    res.json({ status: true, data: paper });

  } catch (error) {
    console.error("Error fetching approved question paper by ID:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error
    });
  }
});


// @desc    Approve a question paper
// @route   PUT /api/admin/question-papers/:id/approve
// @access  Private/Admin
router.put('/admin/:id/approve', protect, admin, async (req, res) => {
  try {
    const paper = await QuestionPaper.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Approved',
        approved_by_admin: req.user._id,
        approval_date: new Date(),
        rejection_reason: null,
      },
      { new: true }
    );

    if (!paper) {
      return res.status(404).json({ message: 'Question paper not found' });
    }
    res.json({ message: 'Question paper approved successfully', paper });
  } catch (error) {
    console.error('Error approving question paper:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Reject a question paper
// @route   PUT /api/admin/question-papers/:id/reject
// @access  Private/Admin
router.put('/admin/:id/reject', protect, admin, async (req, res) => {
  const { reason } = req.body;
  if (!reason) {
    return res.status(400).json({ message: 'Rejection reason is required.' });
  }

  try {
    const paper = await QuestionPaper.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Rejected',
        approved_by_admin: req.user._id,
        approval_date: new Date(),
        rejection_reason: reason,
      },
      { new: true }
    );

    if (!paper) {
      return res.status(404).json({ message: 'Question paper not found' });
    }
    res.json({ message: 'Question paper rejected successfully', paper });
  } catch (error) {
    console.error('Error rejecting question paper:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a question paper (Soft delete)
// @route   DELETE /api/admin/question-papers/:id
// @access  Private/Admin
router.delete('/admin/:id', protect, admin, async (req, res) => {
  try {
    const paper = await QuestionPaper.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    );

    if (!paper) {
      return res.status(404).json({ message: 'Question paper not found' });
    }
    res.json({ message: 'Question paper marked as inactive (soft deleted)' });

  } catch (error) {
    console.error('Error deleting question paper:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
