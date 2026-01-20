const User = require('../models/User');
const QuestionPaper = require('../QuestionPaper/QuestionPaper');
const Class = require('../models/Class');
const Feedback = require('../models/Feedback');
const InterviewExperience = require('../models/InterviewExperience');

// --- DASHBOARD STATS WITH ADVANCED FILTERING ---
const getAdminStats = async (req, res) => {
  try {
    const { branch, section, passingYear } = req.query;
    
    let studentQuery = { role: 'user' };
    if (branch) studentQuery.branch = branch;
    if (section) studentQuery.section = section;
    if (passingYear) studentQuery.passingYear = Number(passingYear);

    const userCount = await User.countDocuments(studentQuery);
    const facultyCount = await User.countDocuments({ role: 'faculty' });
    const totalDocs = await QuestionPaper.countDocuments({});

    const placementData = await User.aggregate([
      { $match: { ...studentQuery, placementStatus: 'Placed' } },
      { $group: {
          _id: null,
          highestPackage: { $max: "$packageLPA" },
          avgPackage: { $avg: "$packageLPA" },
          totalPlaced: { $sum: 1 },
          recruiters: { $addToSet: "$recentCompany" }
      }}
    ]);

    const stats = placementData[0] || { highestPackage: 0, avgPackage: 0, totalPlaced: 0, recruiters: [] };

    const toppers = await User.find(studentQuery).sort({ cgpa: -1 }).limit(3).select('name cgpa branch');
    const topOfferStudent = await User.findOne(studentQuery).sort({ offersCount: -1 }).select('name offersCount regNo');

    res.json({
      userCount,
      facultyCount,
      totalDocs,
      totalRecruiters: stats.recruiters.length,
      totalPlaced: stats.totalPlaced,
      placementPercentage: userCount > 0 ? ((stats.totalPlaced / userCount) * 100).toFixed(1) : 0,
      toppers,
      topOfferStudent,
      highestPackage: stats.highestPackage || 0,
      avgPackage: stats.avgPackage ? stats.avgPackage.toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: "Stats sync error", error: error.message });
  }
};

// --- FACULTY CREATION ---
const createFaculty = async (req, res) => {
  try {
    const { facultyId, name, email, password, phone, education, branch, gender, passingYear, regNo } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { facultyId }] });
    if (userExists) return res.status(400).json({ message: 'Faculty ID or Email already exists' });

    const faculty = await User.create({
      facultyId,
      regNo,
      name,
      email,
      password,
      phone,
      role: 'faculty',
      gender: gender || 'male',
      education: education || 'B.E',
      branch: branch || 'CSE',
      college: 'Main Campus',
      passingYear: passingYear || 0
    });

    res.status(201).json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- CLASS MANAGEMENT ---
const createClass = async (req, res) => {
  try {
    const { education, branch, section, passingYear, facultyId } = req.body;

    const className = `${education}-${branch}-${section}-${passingYear}`;
    
    // Check if class mapping already exists
    const existing = await Class.findOne({ className });
    if (existing) return res.status(400).json({ message: "This Class (Branch/Sec/Year) already exists." });

    // If faculty is provided, check if they are already assigned elsewhere
    if (facultyId) {
      const busy = await Class.findOne({ faculty: facultyId });
      if (busy) return res.status(400).json({ message: "Selected faculty is already assigned to another class." });
    }

    const newClass = await Class.create({
      education,
      branch,
      section,
      passingYear: Number(passingYear),
      className,
      faculty: facultyId || null // Ensure your Schema has required: false for this to work optionally
    });

    const populated = await newClass.populate('faculty', 'name email facultyId');
    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(500).json({ message: "Database Index Conflict: Please drop 'classId_1' index in MongoDB classes collection." });
    }
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

const assignFacultyToClass = async (req, res) => {
  try {
    const { facultyId, classId } = req.body;

    if (!facultyId || !classId) {
      return res.status(400).json({ message: "Faculty and Class selection required" });
    }

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { faculty: facultyId }, // This is the User _id
      { new: true }
    ).populate('faculty', 'name');

    if (!updatedClass) return res.status(404).json({ message: "Class not found" });
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: "Assignment failed", error: error.message });
  }
};

const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('faculty', 'name email branch facultyId');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

const deleteClass = async (req, res) => {
  await Class.findByIdAndDelete(req.params.id);
  res.json({ message: "Class mapping removed" });
};

// --- GENERIC CRUD ---
const getUsers = async (req, res) => {
  const users = await User.find({ role: req.query.role })
    // .populate('assignedFaculty', 'name')
    .select('-password')
    .sort({ createdAt: -1 });
  res.json(users);
};

const updateUserAccount = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

const deleteUserAccount = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user?.role === 'faculty') {
    await Class.updateMany({ faculty: user._id }, { $set: { faculty: null } });
  }
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Removed" });
};

// --- DOCUMENT / FEEDBACK ---
const getPapersByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status && status !== 'All') filter.status = status;

    const papers = await QuestionPaper.find(filter)
      .populate('uploaded_by_user', 'name email role')
      .sort({ createdAt: -1 });

    res.json(papers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching papers" });
  }
};

const getMyUploads = async (req, res) => {
  try {
    const papers = await QuestionPaper.find({ uploaded_by_user: req.user._id }).sort({ createdAt: -1 });
    res.json(papers);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

const updatePaperStatus = async (req, res) => {
  const { status, rejection_reason } = req.body;
  const updatedPaper = await QuestionPaper.findByIdAndUpdate(
    req.params.id,
    {
      status,
      rejection_reason,
      approval_date: Date.now()
    },
    { new: true }
  );
  res.json(updatedPaper);
};

const deletePaper = async (req, res) => {
  await QuestionPaper.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

const deleteFeedback = async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

const deleteExperience = async (req, res) => {
  await InterviewExperience.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

// --- ACADEMIC VERIFICATION ---
const verifyAcademicUpdate = async (req, res) => {
  const { id } = req.params;
  const { approve } = req.body;
  const facultyId = req.user._id;

  try {
    const student = await User.findById(id);
    if (!student) return res.status(404).json({ message: "Student record not found." });

    // --- NEW AUTHORIZATION LOGIC ---
    if (req.user.role !== 'admin') {
      // Check if there is a class matching the student's details assigned to this faculty
      const isAssigned = await Class.findOne({
        faculty: facultyId,
        branch: student.branch,
        section: student.section,
        passingYear: student.passingYear,
        education: student.education
      });

      if (!isAssigned) {
        return res.status(403).json({
          message: "Forbidden: You are not authorized to verify this student. They are not in your assigned class/section."
        });
      }
    }
    // -------------------------------

    if (approve === true) {
      if (student.pendingData) {
        student.cgpa = student.pendingData.cgpa ?? student.cgpa;
        student.currentSemester = student.pendingData.currentSemester ?? student.currentSemester;
        student.historyOfArrear = student.pendingData.historyOfArrear ?? student.historyOfArrear;
        student.currentBacklog = student.pendingData.currentBacklog ?? student.currentBacklog;
      }
    }

    student.academicUpdatePending = false;
    student.pendingData = undefined;
    await student.save();

    res.status(200).json({ message: "Verification processed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// const verifyAcademicUpdate = async (req, res) => {
//   const { id } = req.params;
//   const { approve } = req.body;
//   const facultyId = req.user._id;

//   try {
//     const student = await User.findById(id);
//     if (!student) return res.status(404).json({ message: "Student record not found." });

//     if (req.user.role !== 'admin') {
//       if (!student.assignedFaculty || student.assignedFaculty.toString() !== facultyId.toString()) {
//         return res.status(403).json({
//           message: "Forbidden: You are not authorized to verify this student's details as they are not assigned to your class."
//         });
//       }
//     }

//     if (approve === true) {
//       if (student.pendingData) {
//         student.cgpa = student.pendingData.cgpa ?? student.cgpa;
//         student.currentSemester = student.pendingData.currentSemester ?? student.currentSemester;
//         student.historyOfArrear = student.pendingData.historyOfArrear ?? student.historyOfArrear;
//         student.currentBacklog = student.pendingData.currentBacklog ?? student.currentBacklog;
//       } else {
//         return res.status(400).json({ message: "No pending data found to verify." });
//       }
//     }

//     student.academicUpdatePending = false;
//     student.pendingData = undefined;

//     await student.save();

//     res.status(200).json({
//       message: approve
//         ? "Student profile has been successfully verified and updated."
//         : "Update request has been rejected and cleared.",
//       student: {
//         id: student._id,
//         name: student.name,
//         academicUpdatePending: student.academicUpdatePending
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error during verification process.", error: error.message });
//   }
// };

// --- EXPORTS ---
module.exports = {
  getAdminStats,
  createFaculty,
  createClass,
  assignFacultyToClass,
  getClasses,
  deleteClass,
  getUsers,
  updateUserAccount,
  deleteUserAccount,
  getPapersByStatus,
  getMyUploads,
  updatePaperStatus,
  deletePaper,
  deleteFeedback,
  deleteExperience,
  verifyAcademicUpdate
};
