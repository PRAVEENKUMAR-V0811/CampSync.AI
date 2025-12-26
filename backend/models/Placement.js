// backend/models/Placement.js
const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  department: { 
    type: String, 
    required: true, 
    enum: ['CSE', 'CSE AIML', 'CSE IoT', 'CSE Cyber Security', 'AIDS', 'IT', 'EEE', 'ECE', 'CIVIL', 'MECHANICAL'] 
  },
  year: { type: Number, required: true },
  status: { type: String, enum: ['Placed', 'Unplaced'], default: 'Unplaced' },
  company: { type: String, default: 'Not Applicable' },
  lpa: { type: Number, default: 0 }, // LPA Compensation
  stipend: { type: Number, default: 0 }, // Internship Stipend
  offers: { type: Number, default: 0 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Faculty ID
}, { timestamps: true });

module.exports = mongoose.model('Placement', placementSchema);