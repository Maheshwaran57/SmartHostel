const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  allocatedDate: { type: Date, default: Date.now },
  releasedDate: { type: Date },
  isActive: { type: Boolean, default: true },
  allocatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

allocationSchema.index({ student: 1, isActive: 1 });

module.exports = mongoose.model('Allocation', allocationSchema);