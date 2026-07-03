const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['water', 'electricity', 'internet', 'cleaning', 'furniture', 'security', 'others'], required: true },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  status: { type: String, enum: ['pending', 'assigned', 'in-progress', 'resolved'], default: 'pending' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [String],
  resolutionImage: { type: String },
  resolutionNotes: { type: String },
  timeline: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String }
  }]
}, { timestamps: true });

complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ student: 1 });

complaintSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date(),
      notes: `Status changed to ${this.status}`
    });
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);