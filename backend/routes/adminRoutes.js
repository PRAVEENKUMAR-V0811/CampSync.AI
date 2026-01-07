// const express = require('express');
// const router = express.Router();
// const { 
//   getAdminStats, 
//   getPapersByStatus, 
//   updatePaperStatus,
//   deletePaper
// } = require('../controllers/adminController');

// // Middleware to protect routes (Ensure user is logged in and is Admin)
// // Assuming you have these middleware functions. If not, see Step 2.5
// const { protect, admin } = require('../middleware/authMiddleware'); 

// // Stats Route
// router.get('/stats', protect, admin, getAdminStats);

// // Get Papers (Unified)
// router.get('/papers', protect, admin, getPapersByStatus);

// // Update Status
// router.put('/paper-status/:id', protect, admin, updatePaperStatus);

// // Delete Paper
// router.delete('/question-papers/:id', protect, admin, deletePaper);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware'); // 'admin' middleware should check for 'faculty' or 'admin' roles
const { 
  searchStudentByRegNo, 
  updatePlacementStatus,
  getAcademicRequests,
  verifyAcademicUpdate,
  getAdminStats,
  getPapersByStatus,
  updatePaperStatus,
  deletePaper,
  getManagedStudents 
} = require('../controllers/adminController');

// Existing Routes
router.get('/stats', protect, admin, getAdminStats);
router.get('/papers', protect, admin, getPapersByStatus);
router.put('/paper-status/:id', protect, admin, updatePaperStatus);
router.delete('/question-papers/:id', protect, admin, deletePaper);

// --- NEW PLACEMENT & ACADEMIC ROUTES ---
router.get('/students/search/:regNo', protect, admin, searchStudentByRegNo);
router.put('/students/placement-update/:id', protect, admin, updatePlacementStatus);
router.get('/academic-requests', protect, admin, getAcademicRequests);
router.put('/academic-verification/:id', protect, admin, verifyAcademicUpdate);
router.get('/managed-by-me', protect, admin, getManagedStudents);

module.exports = router;