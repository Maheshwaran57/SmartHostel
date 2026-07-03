const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialization: { type: String, enum: ['electrician', 'plumber', 'cleaner'], required: true },
  availability: { type: Boolean, default: true },
  assignedComplaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }],
  completedCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);