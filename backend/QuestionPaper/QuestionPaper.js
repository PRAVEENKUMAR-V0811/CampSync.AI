// backend/models/QuestionPaper.js
const mongoose = require('mongoose');

const questionPaperSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    subject: { type: String, required: true, trim: true },
    exam_name: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    file_url: { type: String, required: true }, // URL to the file in Cloudinary/Firebase
    original_filename: { type: String, required: true }, // Original filename for download
    uploaded_by_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    approved_by_admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model (admin)
      required: false, // Not required if pending or rejected
    },
    approval_date: { type: Date, required: false },
    rejection_reason: { type: String, required: false },
    is_active: { type: Boolean, default: true }, // For soft deletion/disabling
    // You can add more fields here like extracted_text, tags, difficulty_level if you integrate AI
    extracted_text: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create text index for search functionality
questionPaperSchema.index({ title: 'text', description: 'text', subject: 'text', exam_name: 'text', extracted_text: 'text', tags: 'text' });

const QuestionPaper = mongoose.model('QuestionPaper', questionPaperSchema);
module.exports = QuestionPaper;