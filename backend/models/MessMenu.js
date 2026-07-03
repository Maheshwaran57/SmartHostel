const mongoose = require('mongoose');

const messMenuSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], required: true },
  breakfast: [String],
  lunch: [String],
  dinner: [String],
  snacks: [String],
  isHoliday: { type: Boolean, default: false },
  isSpecial: { type: Boolean, default: false },
  specialNote: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MessMenu', messMenuSchema);