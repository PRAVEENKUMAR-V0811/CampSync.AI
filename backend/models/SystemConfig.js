const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  key: { type: String, default: "placement_update_window" },
  isActive: { type: Boolean, default: false }, // New authoritative toggle
  startTime: { type: Date }, // Removed required constraint
  endTime: { type: Date },   // Removed required constraint
  message: { type: String, default: "Placement records are being updated by the faculty. Finalized content will be live soon." }
});

module.exports = mongoose.model('SystemConfig', systemConfigSchema);