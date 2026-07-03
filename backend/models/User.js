const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['student', 'admin', 'staff'], default: 'student' },
  phone: { type: String },
  department: { type: String },
  year: { type: Number, min: 1, max: 5 },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  avatar: { type: String, default: '' },
  staffRole: { type: String, enum: ['electrician', 'plumber', 'cleaner', ''], default: '' },
  refreshToken: { type: String, select: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);