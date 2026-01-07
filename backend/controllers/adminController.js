// const QuestionPaper = require('../QuestionPaper/QuestionPaper');
// const User = require('../models/User');

// // @desc    Get Admin Dashboard Stats
// // @route   GET /api/admin/stats
// const getAdminStats = async (req, res) => {
//   try {
//     const userCount = await User.countDocuments({});
    
//     // Case insensitive regex for status counting
//     const totalDocs = await QuestionPaper.countDocuments({});
//     const approvedDocs = await QuestionPaper.countDocuments({ status: 'Approved' });
//     const rejectedDocs = await QuestionPaper.countDocuments({ status: 'Rejected' });
//     const pendingDocs = await QuestionPaper.countDocuments({ status: 'Pending' });

//     res.json({
//       userCount,
//       totalDocs,
//       approvedDocs,
//       rejectedDocs,
//       pendingDocs
//     });
//   } catch (error) {
//     console.error("Stats Error:", error);
//     res.status(500).json({ message: "Error fetching stats" });
//   }
// };

// // @desc    Get Papers based on Status (Unified endpoint)
// // @route   GET /api/admin/papers?status=...
// const getPapersByStatus = async (req, res) => {
//   try {
//     const { status } = req.query;
//     let filter = {};

//     // If status is specific (Pending, Approved, Rejected), filter by it.
//     // If status is 'dashboard' or empty, we might return recent ones or all.
//     if (status && status !== 'dashboard' && status !== 'All') {
//       filter = { status: status }; 
//     }

//     const papers = await QuestionPaper.find(filter)
//       .populate('uploaded_by_user', 'name email')
//       .sort({ createdAt: -1 });

//     res.json(papers);
//   } catch (error) {
//     console.error("Fetch Papers Error:", error);
//     res.status(500).json({ message: "Error fetching papers" });
//   }
// };

// // @desc    Update Paper Status (Approve/Reject)
// // @route   PUT /api/admin/paper-status/:id
// const updatePaperStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status, rejection_reason } = req.body;

//   try {
//     const updateData = {
//       status,
//       approved_by_admin: req.user._id,
//       approval_date: Date.now(),
//     };

//     if (status === 'Rejected') {
//       updateData.rejection_reason = rejection_reason;
//     }

//     const updatedPaper = await QuestionPaper.findByIdAndUpdate(
//       id, 
//       updateData, 
//       { new: true }
//     );

//     if (!updatedPaper) {
//       return res.status(404).json({ message: "Paper not found" });
//     }

//     res.json(updatedPaper);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Delete Paper Permanently
// // @route   DELETE /api/admin/question-papers/:id
// const deletePaper = async (req, res) => {
//   try {
//     const paper = await QuestionPaper.findById(req.params.id);
//     if (!paper) return res.status(404).json({ message: 'Paper not found' });

//     // Optional: Add logic here to delete the actual file from Supabase/Uploads folder if needed
    
//     await paper.deleteOne();
//     res.json({ message: 'Paper deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { 
//   getAdminStats, 
//   getPapersByStatus, 
//   updatePaperStatus, 
//   deletePaper 
// };



const User = require('../models/User');
const QuestionPaper = require('../QuestionPaper/QuestionPaper');

// --- PLACEMENT & STUDENT MANAGEMENT FUNCTIONS ---

// Search student by Register Number for Placement Management
const searchStudentByRegNo = async (req, res) => {
    try {
        const { regNo } = req.params;
        // Search by regNo (Ensure your signup route is saving this field now!)
        const student = await User.findOne({ regNo, role: 'user' }).select('-password');

        if (!student) {
            return res.status(404).json({ message: "Student not found with that Register Number" });
        }

        // Ownership Check: If student is already managed by another faculty
        if (student.managedBy && student.managedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                message: "This student is already being managed by another faculty member." 
            });
        }

        res.json(student);
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ message: "Server error during search" });
    }
};

// Get all students managed by the logged-in faculty/admin
const getManagedStudents = async (req, res) => {
    try {
        // Find users where managedBy is the current logged-in user's ID
        const students = await User.find({ managedBy: req.user._id }).select('-password');
        res.json(students);
    } catch (error) {
        console.error("Fetch Managed Students Error:", error);
        res.status(500).json({ message: "Error fetching managed students" });
    }
};

// Faculty updates placement status
const updatePlacementStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            placementStatus, recentCompany, packageLPA, 
            jobType, internStipend, offersCount // Changed from noOfOffers to offersCount to match schema
        } = req.body;

        const student = await User.findById(id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        // Enforce Ownership (Only the faculty who first searched/updated them or if they are unmanaged)
        if (student.managedBy && student.managedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: Managed by another faculty" });
        }

        // Update fields
        student.managedBy = req.user._id; 
        student.placementStatus = placementStatus || student.placementStatus;
        student.recentCompany = recentCompany || student.recentCompany;
        student.packageLPA = packageLPA || student.packageLPA;
        student.jobType = jobType || student.jobType;
        student.internStipend = internStipend || student.internStipend;
        student.offersCount = offersCount || student.offersCount;

        await student.save();
        res.json({ message: "Placement details updated successfully" });
    } catch (error) {
        console.error("Placement Update Error:", error);
        res.status(500).json({ message: "Update failed" });
    }
};

// View all students who submitted academic updates for approval
const getAcademicRequests = async (req, res) => {
    try {
        // Query based on your schema's boolean flag
        const requests = await User.find({ academicUpdatePending: true })
                                   .select('name regNo cgpa currentSemester historyOfArrear currentBacklog pendingData');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch requests" });
    }
};

// Verify/Approve or Reject academic updates
const verifyAcademicUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { approve } = req.body;

        const student = await User.findById(id);
        if (!student) return res.status(404).json({ message: "User not found" });

        // Only copy data if approved AND pendingData exists
        if (approve && student.pendingData) {
            // Use logical nullish assignment to prevent crashing if fields are missing
            student.cgpa = student.pendingData.cgpa ?? student.cgpa;
            student.currentSemester = student.pendingData.currentSemester ?? student.currentSemester;
            student.historyOfArrear = student.pendingData.historyOfArrear ?? student.historyOfArrear;
            student.currentBacklog = student.pendingData.currentBacklog ?? student.currentBacklog;
        }

        // Reset the flag
        student.academicUpdatePending = false;
        
        // Clear the pendingData object properly for Mongoose
        student.pendingData = {
            cgpa: undefined,
            currentSemester: undefined,
            historyOfArrear: undefined,
            currentBacklog: undefined
        };

        await student.save();
        res.json({ message: approve ? "Profile Verified & Updated" : "Update Request Discarded" });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ message: "Verification failed: " + error.message });
    }
};

// --- ADMIN & QUESTION PAPER FUNCTIONS ---

const getAdminStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: 'user' });
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
    res.status(500).json({ message: "Error fetching stats" });
  }
};

const getPapersByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status && status !== 'dashboard' && status !== 'All') {
      filter = { status: status }; 
    }

    const papers = await QuestionPaper.find(filter)
      .populate('uploaded_by_user', 'name email')
      .sort({ createdAt: -1 });

    res.json(papers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching papers" });
  }
};

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

    const updatedPaper = await QuestionPaper.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedPaper) return res.status(404).json({ message: "Paper not found" });

    res.json(updatedPaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePaper = async (req, res) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });

    await paper.deleteOne();
    res.json({ message: 'Paper deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  searchStudentByRegNo,
  updatePlacementStatus,
  getAcademicRequests,
  verifyAcademicUpdate,
  getAdminStats, 
  getPapersByStatus, 
  updatePaperStatus, 
  deletePaper,
  getManagedStudents
};