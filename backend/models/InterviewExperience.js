const mongoose = require('mongoose');

const interviewExperienceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  anonymous: { type: String, required: true }, // "Yes" or "No"
  passOutYear: { type: String, required: true },
  department: { type: String, required: true },
  yearOfStudy: { type: String, required: true },
  companyName: { type: String, required: true },
  interviewType: { type: String, required: true },
  role: { type: String, required: true },
  package: { type: String, required: true },
  focusSkills: { type: String, required: true },
  roundsFaced: { type: [String], required: true },
  otherRound: { type: String },
  unexpectedQuestions: { type: String, required: true },
  codingQuestions: { type: String, required: true },
  interviewTopics: { type: String, required: true },
  comfortLevel: { type: String, required: true },
  outcome: { type: String, required: true },
  feedback: { type: String },
  resources: { type: String },
  features: { type: String, required: true },
  experienceRating: { type: Number, required: true, min: 1, max: 5 },
  additionalComments: { type: String },
  votes: { // NEW FIELD
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InterviewExperience', interviewExperienceSchema);