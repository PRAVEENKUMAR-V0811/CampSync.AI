const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
    getFacultyStats, 
    getMyStudents, 
    updateStudentPlacement, 
    getMyAcademicRequests 
} = require('../controllers/facultyController');

router.use(protect, authorize('faculty'));

router.get('/stats', getFacultyStats);
router.get('/my-students', getMyStudents);
router.get('/academic-requests', getMyAcademicRequests);
router.put('/update-placement/:id', updateStudentPlacement);

module.exports = router;