const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Staff = require('../models/Staff');
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const { paginate } = require('../utils/helpers');
const { sendComplaintStatusEmail } = require('../services/emailService');
const { emitToUser } = require('../services/socketService');

const getComplaints = async (req, res, next) => {
  try {
    const { status, category, priority, search, page, limit } = req.query;
    const filter = {};

    if (req.user.role === 'student') {
      filter.student = req.user.id;
    } else if (req.user.role === 'staff') {
      filter.assignedTo = req.user.id;
    }

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const { skip, limit: limitVal, page: pageVal } = paginate(req.query, page, limit);

    const complaints = await Complaint.find(filter)
      .skip(skip)
      .limit(limitVal)
      .populate('student', 'name email phone department year')
      .populate('assignedTo', 'name email phone staffRole')
      .sort({ createdAt: -1 });

    const total = await Complaint.countDocuments(filter);

    res.status(200).json({
      success: true,
      complaints,
      page: pageVal,
      totalPages: Math.ceil(total / limitVal),
      total
    });
  } catch (error) {
    next(error);
  }
};

const getComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('student', 'name email phone department year')
      .populate('assignedTo', 'name email phone staffRole')
      .populate('timeline.updatedBy', 'name role');

    if (!complaint) {
      return next(new AppError('Complaint not found', 404));
    }

    // Role-based auth checks
    if (req.user.role === 'student' && complaint.student._id.toString() !== req.user.id.toString()) {
      return next(new AppError('You do not have permission to access this complaint', 403));
    }

    res.status(200).json({
      success: true,
      complaint
    });
  } catch (error) {
    next(error);
  }
};

const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      student: req.user.id,
      images,
      timeline: [{
        status: 'pending',
        notes: 'Complaint submitted successfully.',
        updatedBy: req.user.id
      }]
    });

    res.status(201).json({
      success: true,
      complaint
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return next(new AppError('Complaint not found', 404));
    }

    complaint.status = status;
    complaint.timeline.push({
      status,
      notes: notes || `Complaint status marked as ${status}`,
      updatedBy: req.user.id
    });
    await complaint.save();

    const student = await User.findById(complaint.student);
    if (student) {
      await Notification.create({
        user: student._id,
        title: 'Complaint Update',
        message: `Your complaint "${complaint.title}" is now ${status}.`,
        type: 'complaint',
        link: `/student/complaints/${complaint._id}`
      });
      emitToUser(student._id, 'notification:new', {
        title: 'Complaint Update',
        message: `Your complaint "${complaint.title}" is now ${status}.`
      });

      await sendComplaintStatusEmail(complaint, student);
    }

    res.status(200).json({
      success: true,
      complaint
    });
  } catch (error) {
    next(error);
  }
};

const assignComplaint = async (req, res, next) => {
  try {
    const { staffId } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return next(new AppError('Complaint not found', 404));
    }

    const staffUser = await User.findById(staffId);
    if (!staffUser || staffUser.role !== 'staff') {
      return next(new AppError('Invalid staff member selected', 400));
    }

    complaint.assignedTo = staffId;
    complaint.status = 'assigned';
    complaint.timeline.push({
      status: 'assigned',
      notes: `Assigned complaint to staff member ${staffUser.name}`,
      updatedBy: req.user.id
    });
    await complaint.save();

    // Update Staff model
    await Staff.findOneAndUpdate(
      { user: staffId },
      { $addToSet: { assignedComplaints: complaint._id } }
    );

    // Send notifications
    const student = await User.findById(complaint.student);
    if (student) {
      await Notification.create({
        user: student._id,
        title: 'Complaint Assigned',
        message: `Your complaint "${complaint.title}" has been assigned to ${staffUser.name}.`,
        type: 'complaint',
        link: `/student/complaints/${complaint._id}`
      });
      emitToUser(student._id, 'notification:new', {
        title: 'Complaint Assigned',
        message: `Your complaint "${complaint.title}" has been assigned to ${staffUser.name}.`
      });
    }

    await Notification.create({
      user: staffId,
      title: 'New Complaint Assigned',
      message: `You have been assigned a complaint: "${complaint.title}".`,
      type: 'complaint',
      link: `/staff/dashboard`
    });
    emitToUser(staffId, 'notification:new', {
      title: 'New Complaint Assigned',
      message: `You have been assigned a complaint: "${complaint.title}".`
    });

    res.status(200).json({
      success: true,
      complaint
    });
  } catch (error) {
    next(error);
  }
};

const resolveComplaint = async (req, res, next) => {
  try {
    const { resolutionNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return next(new AppError('Complaint not found', 404));
    }

    const resolutionImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    complaint.status = 'resolved';
    complaint.resolutionNotes = resolutionNotes;
    if (resolutionImage) complaint.resolutionImage = resolutionImage;

    complaint.timeline.push({
      status: 'resolved',
      notes: resolutionNotes || 'Complaint resolved successfully.',
      updatedBy: req.user.id
    });

    await complaint.save();

    // Increment completedCount for Staff
    if (complaint.assignedTo) {
      await Staff.findOneAndUpdate(
        { user: complaint.assignedTo },
        { $inc: { completedCount: 1 }, $pull: { assignedComplaints: complaint._id } }
      );
    }

    const student = await User.findById(complaint.student);
    if (student) {
      await Notification.create({
        user: student._id,
        title: 'Complaint Resolved',
        message: `Your complaint "${complaint.title}" has been marked as resolved.`,
        type: 'complaint',
        link: `/student/complaints/${complaint._id}`
      });
      emitToUser(student._id, 'notification:new', {
        title: 'Complaint Resolved',
        message: `Your complaint "${complaint.title}" has been marked as resolved.`
      });

      await sendComplaintStatusEmail(complaint, student);
    }

    res.status(200).json({
      success: true,
      complaint
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComplaints,
  getComplaint,
  createComplaint,
  updateStatus,
  assignComplaint,
  resolveComplaint
};