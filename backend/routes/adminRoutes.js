const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

const { 
  getAdminStats,
  updateUserAccount,
  deleteUserAccount,
  getPapersByStatus,
  updatePaperStatus,
  deletePaper,
  createClass,
  getClasses,
  deleteClass,
  deleteFeedback,
  deleteExperience,
  getUsers,
  createFaculty,
  assignFacultyToClass,
  verifyAcademicUpdate
} = require('../controllers/adminController');
const SystemConfig = require('../models/SystemConfig');

// --- DASHBOARD (Faculty & Admin) ---
router.get('/stats', protect, authorize('faculty', 'admin'), getAdminStats);

// --- DOCUMENT MANAGEMENT (Faculty & Admin) ---
router.get('/papers', protect, authorize('faculty', 'admin'), getPapersByStatus);
router.put('/paper-status/:id', protect, authorize('faculty', 'admin'), updatePaperStatus);
router.delete('/question-papers/:id', protect, authorize('faculty', 'admin'), deletePaper);
router.put('/academic-verification/:id', protect, authorize('admin', 'faculty'), verifyAcademicUpdate);

router.use(protect, authorize('admin'));

// Admin sets the window
router.post('/set-update-window', protect, authorize('admin'), async (req, res) => {
  const { startTime, endTime, message } = req.body;

  await SystemConfig.findOneAndUpdate(
    { key: "placement_update_window" },
    { startTime, endTime, message },
    { upsert: true, new: true }
  );

  res.json({ message: "Update window scheduled successfully." });
});


// --- SUPER ADMIN ONLY: USER CRUD ---
router.get('/users', getUsers);
router.put('/users/:id', updateUserAccount);
router.delete('/users/:id', deleteUserAccount);

// --- FACULTY MANAGEMENT ---
router.post('/faculty-create', createFaculty);
router.post('/faculty-assign-class', assignFacultyToClass);

// --- CLASS MANAGEMENT ---
router.get('/classes', getClasses);
router.post('/classes', createClass);
router.delete('/classes/:id', deleteClass);

// --- FEEDBACK & EXPERIENCE ---
router.delete('/experiences/:id', deleteExperience);
router.delete('/feedback/:id', deleteFeedback);

module.exports = router;
