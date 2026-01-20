const express = require('express');
const router = express.Router();
const QuestionPaper = require('../QuestionPaper/QuestionPaper'); 
const { protect, admin, authorize } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');
const supabase = require('../config/supabaseConfig'); 
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); 

const { 
  getPapersByStatus, 
  updatePaperStatus, 
  deletePaper,
  getMyUploads
} = require('../controllers/adminController');

// ==========================================
// 1. SPECIFIC/STATIC ROUTES (Must be FIRST)
// ==========================================

// @desc    Get papers uploaded by the logged-in user
// @route   GET /api/question-papers/my-uploads
router.get('/my-uploads', protect, getMyUploads);

// @desc    Get all papers filtered by status (Faculty & Admin)
// @route   GET /api/question-papers/papers?status=Pending
router.get('/papers', protect, authorize('faculty', 'admin'), getPapersByStatus);

// ==========================================
// 2. UPLOAD & MANAGEMENT ACTIONS
// ==========================================

// @desc    Upload a new question paper (Student/User)
router.post('/upload', protect, upload.single('questionPaperFile'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

  const { title, description, subject, exam_name, year, tags } = req.body;

  if (!title || !subject || !exam_name || !year) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const fileExtension = req.file.originalname.split('.').pop();
    const fileName = `${Date.now()}_${uuidv4()}.${fileExtension}`;
    const filePath = `uploads/${fileName}`;

    const { data, error } = await supabase.storage.from('question-papers').upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
    });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage.from('question-papers').getPublicUrl(filePath);

    const newPaper = new QuestionPaper({
      title, description, subject, exam_name,
      year: parseInt(year),
      file_url: publicUrlData.publicUrl,
      original_filename: req.file.originalname,
      uploaded_by_user: req.user._id,
      uploaded_by_role: req.user.role,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: 'Pending',
      storage_path: filePath 
    });

    const createdPaper = await newPaper.save();
    res.status(201).json(createdPaper);
  } catch (error) {
    res.status(500).json({ message: 'Upload Failed', error: error.message });
  }
});

// @desc    Update status (Approve/Reject)
// @route   PUT /api/question-papers/status/:id
router.put('/status/:id', protect, authorize('faculty', 'admin'), updatePaperStatus);

// @desc    Delete paper permanently
// @route   DELETE /api/question-papers/:id
router.delete('/:id', protect, authorize('faculty', 'admin'), deletePaper);

// ==========================================
// 3. PUBLIC DATA ACCESS
// ==========================================

// @desc    Get all APPROVED question papers (for users bank)
// @route   GET /api/question-papers
router.get('/', async (req, res) => {
  try {
    const { subject, exam_name, year, search } = req.query;
    const query = { status: 'Approved', is_active: true };

    if (subject) query.subject = new RegExp(subject, 'i');
    if (exam_name) query.exam_name = new RegExp(exam_name, 'i');
    if (year) query.year = parseInt(year);
    if (search) {
      query.$or = [{ title: new RegExp(search, 'i') }, { subject: new RegExp(search, 'i') }];
    }

    const papers = await QuestionPaper.find(query)
      .populate('uploaded_by_user', 'name') 
      .sort({ createdAt: -1 });
      
    res.json(papers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================================
// 4. DYNAMIC PARAMETER ROUTES (Must be LAST)
// ==========================================

// @desc    Get specific paper details by ID
// @route   GET /api/question-papers/:id
router.get('/:id', async (req, res) => {
  try {
    const paper = await QuestionPaper.findOne({ _id: req.params.id, status: 'Approved', is_active: true });
    if (!paper) return res.status(404).json({ message: 'Paper not found or not approved.' });
    res.json(paper);
  } catch (error) {
    res.status(400).json({ message: 'Invalid Paper ID format' });
  }
});

module.exports = router;