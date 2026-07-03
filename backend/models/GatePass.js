const mongoose = require('mongoose');

const gatePassSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  departureDate: { type: Date, required: true },
  arrivalDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String }
}, { timestamps: true });

gatePassSchema.index({ student: 1 });
gatePassSchema.index({ status: 1 });

module.exports = mongoose.model('GatePass', gatePassSchema);