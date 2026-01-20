const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  key: { type: String, default: "placement_update_window" },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  message: { type: String, default: "Placement records are being updated by the faculty. Finalized content will be live soon." }
});

module.exports = mongoose.model('SystemConfig', systemConfigSchema);