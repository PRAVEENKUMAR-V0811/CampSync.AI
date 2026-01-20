// const User = require('../models/User');

// const getFacultyStats = async (req, res) => {
//   try {
//     const facultyId = req.user._id;

//     // 1. Basic Class Counts
//     const totalStudents = await User.countDocuments({ assignedFaculty: facultyId, role: 'user' });
//     const placedCount = await User.countDocuments({ assignedFaculty: facultyId, role: 'user', placementStatus: 'Placed' });
//     const unplacedCount = totalStudents - placedCount;

//     // 2. Leaderboards (Top 3)
//     const topCgpa = await User.find({ assignedFaculty: facultyId, role: 'user' })
//       .sort({ cgpa: -1 }).limit(3).select('name cgpa regNo');
    
//     const topOffers = await User.find({ assignedFaculty: facultyId, role: 'user' })
//       .sort({ offersCount: -1 }).limit(1).select('name offersCount regNo branch passingYear');

//     // 3. Package & Company Analytics
//     const analytics = await User.aggregate([
//       { $match: { assignedFaculty: facultyId, role: 'user', placementStatus: 'Placed' } },
//       { $group: {
//           _id: null,
//           highestPackage: { $max: "$packageLPA" },
//           avgPackage: { $avg: "$packageLPA" },
//           companies: { $addToSet: "$recentCompany" } // unique companies
//       }}
//     ]);


//     const stats = analytics[0] || { highestPackage: 0, avgPackage: 0, companies: [] };

//     res.json({
//       totalStudents,
//       placedCount,
//       unplacedCount,
//       topCgpa,
//       topOffers,
//       highestPackage: stats.highestPackage,
//       avgPackage: stats.avgPackage?.toFixed(2) || 0,
//       totalCompanies: stats.companies.filter(c => c !== "").length
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const getMyStudents = async (req, res) => {
//   const students = await User.find({ assignedFaculty: req.user._id, role: 'user' }).select('-password');
//   res.json(students || []); // Always return array
// };

// const updateStudentPlacement = async (req, res) => {
//   const student = await User.findOneAndUpdate(
//     { _id: req.params.id, assignedFaculty: req.user._id },
//     req.body,
//     { new: true }
//   );
//   if (!student) return res.status(404).json({ message: "Student not found in your class" });
//   res.json(student);
// };

// const getMyAcademicRequests = async (req, res) => {
//   const requests = await User.find({ 
//     assignedFaculty: req.user._id, 
//     academicUpdatePending: true 
//   }).select('-password');
//   res.json(requests || []);
// };

// module.exports = { getFacultyStats, getMyStudents, updateStudentPlacement, getMyAcademicRequests };

const User = require('../models/User');
const Class = require('../models/Class');

/**
 * Helper: Build student filter for a faculty
 * Priority:
 * 1. Class-based mapping (NEW, correct)
 * 2. assignedFaculty fallback (OLD, backward compatible)
 */
const buildStudentFilter = async (facultyId, extra = {}) => {
  const assignedClasses = await Class.find({ faculty: facultyId });

  // ✅ NEW LOGIC (Preferred)
  if (assignedClasses.length > 0) {
    return {
      role: 'user',
      ...extra,
      $or: assignedClasses.map(c => ({
        education: c.education,
        branch: c.branch,
        section: c.section,
        passingYear: c.passingYear
      }))
    };
  }

  // ⚠️ OLD FALLBACK (Backward compatibility)
  return {
    role: 'user',
    assignedFaculty: facultyId,
    ...extra
  };
};

/* ============================
   FACULTY DASHBOARD STATS
============================ */
const getFacultyStats = async (req, res) => {
  try {
    const facultyId = req.user._id;

    const studentFilter = await buildStudentFilter(facultyId);

    const totalStudents = await User.countDocuments(studentFilter);
    const placedCount = await User.countDocuments({
      ...studentFilter,
      placementStatus: 'Placed'
    });
    const unplacedCount = totalStudents - placedCount;

    const topCgpa = await User.find(studentFilter)
      .sort({ cgpa: -1 })
      .limit(3)
      .select('name cgpa regNo');

    const topOffers = await User.find(studentFilter)
      .sort({ offersCount: -1 })
      .limit(1)
      .select('name offersCount regNo branch passingYear');

    const analytics = await User.aggregate([
      { $match: { ...studentFilter, placementStatus: 'Placed' } },
      {
        $group: {
          _id: null,
          highestPackage: { $max: '$packageLPA' },
          avgPackage: { $avg: '$packageLPA' },
          companies: { $addToSet: '$recentCompany' }
        }
      }
    ]);

    const stats = analytics[0] || { highestPackage: 0, avgPackage: 0, companies: [] };

    res.json({
      totalStudents,
      placedCount,
      unplacedCount,
      topCgpa,
      topOffers,
      highestPackage: stats.highestPackage || 0,
      avgPackage: stats.avgPackage ? stats.avgPackage.toFixed(2) : 0,
      totalCompanies: stats.companies.filter(c => c).length
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

/* ============================
   GET MY STUDENTS
============================ */
const getMyStudents = async (req, res) => {
  try {
    const studentFilter = await buildStudentFilter(req.user._id);
    const students = await User.find(studentFilter)
      .select('-password')
      .sort({ name: 1 });

    res.json(students || []);
  } catch (error) {
    res.status(500).json({ message: 'Fetch failed', error: error.message });
  }
};

/* ============================
   UPDATE STUDENT PLACEMENT
============================ */
const updateStudentPlacement = async (req, res) => {
  try {
    const studentFilter = await buildStudentFilter(req.user._id);

    const student = await User.findOneAndUpdate(
      { _id: req.params.id, ...studentFilter },
      req.body,
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found in your class' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

/* ============================
   ACADEMIC UPDATE REQUESTS
============================ */
const getMyAcademicRequests = async (req, res) => {
  try {
    const studentFilter = await buildStudentFilter(req.user._id, {
      academicUpdatePending: true
    });

    const requests = await User.find(studentFilter).select('-password');
    res.json(requests || []);
  } catch (error) {
    res.status(500).json({ message: 'Fetch failed', error: error.message });
  }
};

module.exports = {
  getFacultyStats,
  getMyStudents,
  updateStudentPlacement,
  getMyAcademicRequests
};
