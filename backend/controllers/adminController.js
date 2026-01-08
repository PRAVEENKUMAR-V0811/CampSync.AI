// const User = require('../models/User');
// const QuestionPaper = require('../QuestionPaper/QuestionPaper');

// // --- PLACEMENT & STUDENT MANAGEMENT FUNCTIONS ---

// // Search student by Register Number for Placement Management
// const searchStudentByRegNo = async (req, res) => {
//     try {
//         const { regNo } = req.params;
//         // Search by regNo (Ensure your signup route is saving this field now!)
//         const student = await User.findOne({ regNo, role: 'user' }).select('-password');

//         if (!student) {
//             return res.status(404).json({ message: "Student not found with that Register Number" });
//         }

//         // Ownership Check: If student is already managed by another faculty
//         if (student.managedBy && student.managedBy.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ 
//                 message: "This student is already being managed by another faculty member." 
//             });
//         }

//         res.json(student);
//     } catch (error) {
//         console.error("Search Error:", error);
//         res.status(500).json({ message: "Server error during search" });
//     }
// };

// // Get all students managed by the logged-in faculty/admin
// const getManagedStudents = async (req, res) => {
//     try {
//         // Find users where managedBy is the current logged-in user's ID
//         const students = await User.find({ managedBy: req.user._id }).select('-password');
//         res.json(students);
//     } catch (error) {
//         console.error("Fetch Managed Students Error:", error);
//         res.status(500).json({ message: "Error fetching managed students" });
//     }
// };

// // Faculty updates placement status
// const updatePlacementStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { 
//             placementStatus, recentCompany, packageLPA, 
//             jobType, internStipend, offersCount // Changed from noOfOffers to offersCount to match schema
//         } = req.body;

//         const student = await User.findById(id);
//         if (!student) return res.status(404).json({ message: "Student not found" });

//         // Enforce Ownership (Only the faculty who first searched/updated them or if they are unmanaged)
//         if (student.managedBy && student.managedBy.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: "Unauthorized: Managed by another faculty" });
//         }

//         // Update fields
//         student.managedBy = req.user._id; 
//         student.placementStatus = placementStatus || student.placementStatus;
//         student.recentCompany = recentCompany || student.recentCompany;
//         student.packageLPA = packageLPA || student.packageLPA;
//         student.jobType = jobType || student.jobType;
//         student.internStipend = internStipend || student.internStipend;
//         student.offersCount = offersCount || student.offersCount;

//         await student.save();
//         res.json({ message: "Placement details updated successfully" });
//     } catch (error) {
//         console.error("Placement Update Error:", error);
//         res.status(500).json({ message: "Update failed" });
//     }
// };

// // View all students who submitted academic updates for approval
// const getAcademicRequests = async (req, res) => {
//     try {
//         // Query based on your schema's boolean flag
//         const requests = await User.find({ academicUpdatePending: true })
//                                    .select('name regNo cgpa currentSemester historyOfArrear currentBacklog pendingData');
//         res.json(requests);
//     } catch (error) {
//         res.status(500).json({ message: "Failed to fetch requests" });
//     }
// };

// // Verify/Approve or Reject academic updates
// const verifyAcademicUpdate = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { approve } = req.body;

//         const student = await User.findById(id);
//         if (!student) return res.status(404).json({ message: "User not found" });

//         // Only copy data if approved AND pendingData exists
//         if (approve && student.pendingData) {
//             // Use logical nullish assignment to prevent crashing if fields are missing
//             student.cgpa = student.pendingData.cgpa ?? student.cgpa;
//             student.currentSemester = student.pendingData.currentSemester ?? student.currentSemester;
//             student.historyOfArrear = student.pendingData.historyOfArrear ?? student.historyOfArrear;
//             student.currentBacklog = student.pendingData.currentBacklog ?? student.currentBacklog;
//         }

//         // Reset the flag
//         student.academicUpdatePending = false;
        
//         // Clear the pendingData object properly for Mongoose
//         student.pendingData = {
//             cgpa: undefined,
//             currentSemester: undefined,
//             historyOfArrear: undefined,
//             currentBacklog: undefined
//         };

//         await student.save();
//         res.json({ message: approve ? "Profile Verified & Updated" : "Update Request Discarded" });
//     } catch (error) {
//         console.error("Verification Error:", error);
//         res.status(500).json({ message: "Verification failed: " + error.message });
//     }
// };

// // --- ADMIN & QUESTION PAPER FUNCTIONS ---

// const getAdminStats = async (req, res) => {
//   try {
//     const userCount = await User.countDocuments({ role: 'user' });
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
//     res.status(500).json({ message: "Error fetching stats" });
//   }
// };

// const getPapersByStatus = async (req, res) => {
//   try {
//     const { status } = req.query;
//     let filter = {};

//     if (status && status !== 'dashboard' && status !== 'All') {
//       filter = { status: status }; 
//     }

//     const papers = await QuestionPaper.find(filter)
//       .populate('uploaded_by_user', 'name email')
//       .sort({ createdAt: -1 });

//     res.json(papers);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching papers" });
//   }
// };

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

//     const updatedPaper = await QuestionPaper.findByIdAndUpdate(id, updateData, { new: true });

//     if (!updatedPaper) return res.status(404).json({ message: "Paper not found" });

//     res.json(updatedPaper);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const deletePaper = async (req, res) => {
//   try {
//     const paper = await QuestionPaper.findById(req.params.id);
//     if (!paper) return res.status(404).json({ message: 'Paper not found' });

//     await paper.deleteOne();
//     res.json({ message: 'Paper deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { 
//   searchStudentByRegNo,
//   updatePlacementStatus,
//   getAcademicRequests,
//   verifyAcademicUpdate,
//   getAdminStats, 
//   getPapersByStatus, 
//   updatePaperStatus, 
//   deletePaper,
//   getManagedStudents
// };


const User = require('../models/User');
const QuestionPaper = require('../QuestionPaper/QuestionPaper');

// --- DASHBOARD STATS ---
const getAdminStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: 'user' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const facultyCount = await User.countDocuments({ role: 'faculty' });
    
    const totalDocs = await QuestionPaper.countDocuments({});
    const approvedDocs = await QuestionPaper.countDocuments({ status: 'Approved' });
    const rejectedDocs = await QuestionPaper.countDocuments({ status: 'Rejected' });

    // Placement Analytics
    const placementStats = await User.aggregate([
      { $match: { role: 'user', placementStatus: 'Placed' } },
      {
        $group: {
          _id: null,
          highestPackage: { $max: "$packageLPA" },
          averagePackage: { $avg: "$packageLPA" },
          companies: { $addToSet: "$recentCompany" }
        }
      }
    ]);

    const stats = placementStats[0] || { highestPackage: 0, averagePackage: 0, companies: [] };

    res.json({
      userCount,
      totalAdmins: adminCount + facultyCount,
      totalDocs,
      approvedDocs,
      rejectedDocs,
      highestPackage: stats.highestPackage,
      averagePackage: stats.averagePackage?.toFixed(2),
      totalCompaniesVisited: stats.companies.length,
      // Placeholder for feedback count if you have a Feedback model
      feedbackCount: 0 
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

// --- USER CRUD (FOR ADMIN) ---

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

const createUserAccount = async (req, res) => {
  const { name, email, password, role, phone, gender, education, college, branch, passingYear } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({
    name, email, password, role, phone, gender, education, college, branch, passingYear
  });
  res.status(201).json(user);
};

const updateUserAccount = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    if (req.body.password) user.password = req.body.password;
    
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const deleteUserAccount = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// --- FACULTY/ADMIN SHARED FUNCTIONS ---

const searchStudentByRegNo = async (req, res) => {
  const student = await User.findOne({ regNo: req.params.regNo, role: 'user' }).select('-password');
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
};

const updatePlacementStatus = async (req, res) => {
  const { id } = req.params;
  const student = await User.findById(id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  Object.assign(student, req.body);
  student.managedBy = req.user._id; 
  await student.save();
  res.json({ message: "Placement details updated" });
};

const getAcademicRequests = async (req, res) => {
  const requests = await User.find({ academicUpdatePending: true });
  res.json(requests);
};

const verifyAcademicUpdate = async (req, res) => {
  const { id } = req.params;
  const { approve } = req.body;
  const student = await User.findById(id);

  if (approve && student.pendingData) {
    student.cgpa = student.pendingData.cgpa ?? student.cgpa;
    student.currentSemester = student.pendingData.currentSemester ?? student.currentSemester;
    student.historyOfArrear = student.pendingData.historyOfArrear ?? student.historyOfArrear;
    student.currentBacklog = student.pendingData.currentBacklog ?? student.currentBacklog;
  }
  student.academicUpdatePending = false;
  student.pendingData = undefined;
  await student.save();
  res.json({ message: approve ? "Verified" : "Rejected" });
};

// Existing paper logic (Keep as is)
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
  getAdminStats, searchStudentByRegNo, updatePlacementStatus, 
  getAcademicRequests, verifyAcademicUpdate, getAllUsers,
  createUserAccount, updateUserAccount, deleteUserAccount,
  getPapersByStatus, updatePaperStatus, deletePaper
};