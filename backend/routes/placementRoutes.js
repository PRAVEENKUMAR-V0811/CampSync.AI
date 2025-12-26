// backend/routes/placementRoutes.js
const express = require('express');
const router = express.Router();
const Placement = require('../models/Placement');
const { protect, admin } = require('../middleware/authMiddleware');// Use your existing auth middleware

// Get stats for the logged-in faculty's students
router.get('/faculty-stats', protect, async (req, res) => {
  try {
    const students = await Placement.find({ addedBy: req.user.id });
    const placed = students.filter(s => s.status === 'Placed');
    const packages = placed.map(s => s.lpa).filter(l => l > 0);

    res.json({
      totalStudents: students.length,
      placedCount: placed.length,
      unplacedCount: students.length - placed.length,
      highestLPA: packages.length ? Math.max(...packages) : 0,
      lowestLPA: packages.length ? Math.min(...packages) : 0,
      avgLPA: packages.length ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2) : 0
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// CRUD Operations
router.get('/my-students', protect, async (req, res) => {
  const students = await Placement.find({ addedBy: req.user.id });
  res.json(students);
});

router.post('/add', protect, async (req, res) => {
  const studentData = { ...req.body, addedBy: req.user.id };
  if (studentData.status === 'Unplaced') {
    studentData.company = 'Not Applicable';
    studentData.lpa = 0;
  }
  const newStudent = new Placement(studentData);
  await newStudent.save();
  res.json(newStudent);
});

router.put('/update/:id', protect, async (req, res) => {
  const student = await Placement.findOne({ _id: req.params.id, addedBy: req.user.id });
  if (!student) return res.status(404).json({ msg: "Not authorized or not found" });
  
  Object.assign(student, req.body);
  await student.save();
  res.json(student);
});

router.delete('/delete/:id', protect, async (req, res) => {
  await Placement.findOneAndDelete({ _id: req.params.id, addedBy: req.user.id });
  res.json({ msg: "Deleted" });
});

// Public route for the Trend Dashboard (All students)
router.get('/all-placements', async (req, res) => {
  const data = await Placement.find({});
  res.json(data);
});

module.exports = router;