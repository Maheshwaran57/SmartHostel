const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  block: { type: String, required: true, uppercase: true },
  floor: { type: Number, required: true },
  roomNumber: { type: String, required: true, uppercase: true },
  capacity: { type: Number, required: true, min: 1, max: 6, default: 3 },
  occupancy: { type: Number, default: 0, min: 0 },
  roomType: { type: String, enum: ['single', 'double', 'triple', 'quad'], default: 'triple' },
  status: { type: String, enum: ['available', 'partial', 'full', 'maintenance'], default: 'available' },
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  amenities: [String]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

roomSchema.index({ block: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ status: 1 });

roomSchema.virtual('availableSlots').get(function() {
  return this.capacity - this.occupancy;
});

roomSchema.pre('save', function(next) {
  if (this.occupancy === 0) {
    if (this.status !== 'maintenance') this.status = 'available';
  } else if (this.occupancy < this.capacity) {
    if (this.status !== 'maintenance') this.status = 'partial';
  } else {
    this.status = 'full';
  }
  next();
});

module.exports = mongoose.model('Room', roomSchema);