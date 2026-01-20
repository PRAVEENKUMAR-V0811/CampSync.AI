// backend/models/QuestionPaper.js
const mongoose = require('mongoose');

const questionPaperSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    subject: { type: String, required: true, trim: true },
    exam_name: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    
    // Updated comment: This will now store the Supabase Public URL
    file_url: { type: String, required: true }, 
    
    original_filename: { type: String, required: true }, 

    // --- NEW FIELD ADDED BELOW ---
    // Stores the internal path (e.g., "uploads/171543.pdf") to help with deletion
    storage_path: { type: String, required: false }, 
    // -----------------------------

    uploaded_by_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploaded_by_role: {
      type: String,
      enum: ['admin', 'faculty', 'user'],
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    approved_by_admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    approval_date: { type: Date, required: false },
    rejection_reason: { type: String, required: false },
    is_active: { type: Boolean, default: true },
    extracted_text: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
    collection: 'questionpapers' 
  }
);

// Create text index for search functionality
questionPaperSchema.index({ title: 'text', description: 'text', subject: 'text', exam_name: 'text', extracted_text: 'text', tags: 'text' });

const QuestionPaper = mongoose.model('QuestionPaper', questionPaperSchema);
module.exports = QuestionPaper;