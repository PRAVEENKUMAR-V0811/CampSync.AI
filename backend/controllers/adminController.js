const QuestionPaper = require('../QuestionPaper/QuestionPaper');
const User = require('../models/User');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments({});
    
    // Case insensitive regex for status counting
    const totalDocs = await QuestionPaper.countDocuments({});
    const approvedDocs = await QuestionPaper.countDocuments({ status: 'Approved' });
    const rejectedDocs = await QuestionPaper.countDocuments({ status: 'Rejected' });
    const pendingDocs = await QuestionPaper.countDocuments({ status: 'Pending' });

    res.json({
      userCount,
      totalDocs,
      approvedDocs,
      rejectedDocs,
      pendingDocs
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

// @desc    Get Papers based on Status (Unified endpoint)
// @route   GET /api/admin/papers?status=...
const getPapersByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    // If status is specific (Pending, Approved, Rejected), filter by it.
    // If status is 'dashboard' or empty, we might return recent ones or all.
    if (status && status !== 'dashboard' && status !== 'All') {
      filter = { status: status }; 
    }

    const papers = await QuestionPaper.find(filter)
      .populate('uploaded_by_user', 'name email')
      .sort({ createdAt: -1 });

    res.json(papers);
  } catch (error) {
    console.error("Fetch Papers Error:", error);
    res.status(500).json({ message: "Error fetching papers" });
  }
};

// @desc    Update Paper Status (Approve/Reject)
// @route   PUT /api/admin/paper-status/:id
const updatePaperStatus = async (req, res) => {
  const { id } = req.params;
  const { status, rejection_reason } = req.body;

  try {
    const updateData = {
      status,
      approved_by_admin: req.user._id,
      approval_date: Date.now(),
    };

    if (status === 'Rejected') {
      updateData.rejection_reason = rejection_reason;
    }

    const updatedPaper = await QuestionPaper.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );

    if (!updatedPaper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    res.json(updatedPaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Paper Permanently
// @route   DELETE /api/admin/question-papers/:id
const deletePaper = async (req, res) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });

    // Optional: Add logic here to delete the actual file from Supabase/Uploads folder if needed
    
    await paper.deleteOne();
    res.json({ message: 'Paper deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getAdminStats, 
  getPapersByStatus, 
  updatePaperStatus, 
  deletePaper 
};