const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  education: { type: String, required: true }, // e.g., B.E
  branch: { type: String, required: true },    // e.g., CSE
  section: { type: String, required: true },   // e.g., A
  passingYear: { type: Number, required: true }, // e.g., 2025
  
  // Link to the Faculty (User model where role is 'faculty')
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  
  className: { type: String } // e.g., "BE-CSE-A-2025"
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);