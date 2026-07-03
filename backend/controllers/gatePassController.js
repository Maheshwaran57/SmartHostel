const GatePass = require('../models/GatePass');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const { emitToUser } = require('../services/socketService');

const applyGatePass = async (req, res, next) => {
  try {
    const { reason, departureDate, arrivalDate } = req.body;
    const gatePass = await GatePass.create({
      student: req.user.id,
      reason,
      departureDate,
      arrivalDate
    });

    res.status(201).json({
      success: true,
      gatePass
    });
  } catch (error) {
    next(error);
  }
};

const getGatePasses = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'student') {
      filter.student = req.user.id;
    }

    const gatePasses = await GatePass.find(filter)
      .populate('student', 'name email department year phone')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      gatePasses
    });
  } catch (error) {
    next(error);
  }
};

const updateGatePassStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    const gatePass = await GatePass.findById(req.params.id);
    if (!gatePass) {
      return next(new AppError('Gate Pass request not found', 404));
    }

    gatePass.status = status;
    gatePass.approvedBy = req.user.id;
    if (rejectionReason) gatePass.rejectionReason = rejectionReason;
    await gatePass.save();

    await Notification.create({
      user: gatePass.student,
      title: `Gate Pass ${status.toUpperCase()}`,
      message: `Your gate pass request has been ${status} by the warden.`,
      type: 'general',
      link: '/student/room'
    });

    emitToUser(gatePass.student, 'notification:new', {
      title: `Gate Pass ${status.toUpperCase()}`,
      message: `Your gate pass request has been ${status} by the warden.`
    });

    res.status(200).json({
      success: true,
      gatePass
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyGatePass,
  getGatePasses,
  updateGatePassStatus
};