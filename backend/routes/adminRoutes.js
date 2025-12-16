const express = require('express');
const router = express.Router();
const { 
  getAdminStats, 
  getPapersByStatus, 
  updatePaperStatus,
  deletePaper
} = require('../controllers/adminController');

// Middleware to protect routes (Ensure user is logged in and is Admin)
// Assuming you have these middleware functions. If not, see Step 2.5
const { protect, admin } = require('../middleware/authMiddleware'); 

// Stats Route
router.get('/stats', protect, admin, getAdminStats);

// Get Papers (Unified)
router.get('/papers', protect, admin, getPapersByStatus);

// Update Status
router.put('/paper-status/:id', protect, admin, updatePaperStatus);

// Delete Paper
router.delete('/question-papers/:id', protect, admin, deletePaper);

module.exports = router;