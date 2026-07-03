const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true }, // Normalized to midnight
  status: { type: String, enum: ['present', 'absent'], default: 'present' },
  markedAt: { type: Date, default: Date.now }
}, { timestamps: true });

attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);