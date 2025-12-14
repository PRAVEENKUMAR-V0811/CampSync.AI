// backend/routes/questionPaperNew.js
const express = require('express');
const router = express.Router();
const QuestionPaper = require('../QuestionPaper/QuestionPaper'); // Ensure this path matches your folder structure
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');
const supabase = require('../config/supabaseConfig'); // Make sure you created this file!
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Run 'npm install uuid' if you haven't

// @desc    Upload a new question paper
// @route   POST /api/question-papers/upload
// @access  Private
router.post('/upload', protect, upload.single('questionPaperFile'), async (req, res) => {
  
  // --- DEBUG LOG: IF YOU DON'T SEE THIS IN TERMINAL, OLD CODE IS RUNNING ---
  console.log("----------------------------------------------------");
  console.log("🚀 SUPABASE UPLOAD ROUTE HIT! (New Code is Running)");
  console.log("----------------------------------------------------");

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const { title, description, subject, exam_name, year, tags } = req.body;

  if (!title || !subject || !exam_name || !year) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    // 1. Generate Filename
    const fileExtension = req.file.originalname.split('.').pop();
    const fileName = `${Date.now()}_${uuidv4()}.${fileExtension}`;
    const filePath = `uploads/${fileName}`;

    console.log(`Attempting to upload to Supabase: ${filePath}`);

    // 2. Upload to Supabase
    const { data, error } = await supabase
      .storage
      .from('question-papers') // CHECK YOUR SUPABASE BUCKET NAME HERE
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error("Supabase Error Details:", error);
      throw error;
    }

    // 3. Get Public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('question-papers')
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;
    console.log(`File uploaded successfully: ${publicUrl}`);

    // 4. Save to MongoDB
    const newPaper = new QuestionPaper({
      title,
      description,
      subject,
      exam_name,
      year: parseInt(year),
      file_url: publicUrl,
      original_filename: req.file.originalname,
      uploaded_by_user: req.user._id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: 'Pending',
      storage_path: filePath 
    });

    const createdPaper = await newPaper.save();
    res.status(201).json(createdPaper);

  } catch (error) {
    console.error('Upload Process Failed:', error);
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

// @desc    Get approved paper by ID (Duplicate route logic, but keeping it as per your file)
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
    
    // Note: We are keeping the file in Supabase for safety.
    // If you want to DELETE the file from Supabase permanently, uncomment below:
    /*
    if (paper.storage_path) {
      const { error } = await supabase.storage.from('question-papers').remove([paper.storage_path]);
      if(error) console.error("Error removing file from Supabase:", error);
    }
    */

    res.json({ message: 'Question paper marked as inactive (soft deleted)' });

  } catch (error) {
    console.error('Error deleting question paper:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
