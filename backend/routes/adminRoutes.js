// const express = require('express');
// const router = express.Router();
// const { protect, admin } = require('../middleware/authMiddleware'); // 'admin' middleware should check for 'faculty' or 'admin' roles
// const { 
//   searchStudentByRegNo, 
//   updatePlacementStatus,
//   getAcademicRequests,
//   verifyAcademicUpdate,
//   getAdminStats,
//   getPapersByStatus,
//   updatePaperStatus,
//   deletePaper,
//   getManagedStudents 
// } = require('../controllers/adminController');

// // Existing Routes
// router.get('/stats', protect, admin, getAdminStats);
// router.get('/papers', protect, admin, getPapersByStatus);
// router.put('/paper-status/:id', protect, admin, updatePaperStatus);
// router.delete('/question-papers/:id', protect, admin, deletePaper);

// // --- NEW PLACEMENT & ACADEMIC ROUTES ---
// router.get('/students/search/:regNo', protect, admin, searchStudentByRegNo);
// router.put('/students/placement-update/:id', protect, admin, updatePlacementStatus);
// router.get('/academic-requests', protect, admin, getAcademicRequests);
// router.put('/academic-verification/:id', protect, admin, verifyAcademicUpdate);
// router.get('/managed-by-me', protect, admin, getManagedStudents);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  getAdminStats, searchStudentByRegNo, updatePlacementStatus,
  getAcademicRequests, verifyAcademicUpdate, 
  getAllUsers, createUserAccount, updateUserAccount, deleteUserAccount,
  getPapersByStatus, updatePaperStatus, deletePaper 
} = require('../controllers/adminController');

// --- DASHBOARD (Faculty & Admin) ---
router.get('/stats', protect, authorize('faculty', 'admin'), getAdminStats);

// --- STUDENT MANAGEMENT (Faculty & Admin) ---
router.get('/students/search/:regNo', protect, authorize('faculty', 'admin'), searchStudentByRegNo);
router.put('/students/placement-update/:id', protect, authorize('faculty', 'admin'), updatePlacementStatus);
router.get('/academic-requests', protect, authorize('faculty', 'admin'), getAcademicRequests);
router.put('/academic-verification/:id', protect, authorize('faculty', 'admin'), verifyAcademicUpdate);

// --- DOCUMENT MANAGEMENT (Faculty & Admin) ---
router.get('/papers', protect, authorize('faculty', 'admin'), getPapersByStatus);
router.put('/paper-status/:id', protect, authorize('faculty', 'admin'), updatePaperStatus);
router.delete('/question-papers/:id', protect, authorize('faculty', 'admin'), deletePaper);

// --- SUPER ADMIN ONLY: USER CRUD ---
router.get('/users', protect, authorize('admin'), getAllUsers);
router.post('/users', protect, authorize('admin'), createUserAccount);
router.put('/users/:id', protect, authorize('admin'), updateUserAccount);
router.delete('/users/:id', protect, authorize('admin'), deleteUserAccount);

module.exports = router;