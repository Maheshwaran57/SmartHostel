const Attendance = require('../models/Attendance');
const AppError = require('../utils/AppError');

const markAttendance = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({ student: req.user.id, date: today });
    if (existing) {
      return next(new AppError('Attendance already marked for today', 400));
    }

    const attendance = await Attendance.create({
      student: req.user.id,
      date: today,
      status: 'present'
    });

    res.status(201).json({
      success: true,
      attendance
    });
  } catch (error) {
    next(error);
  }
};

const getTodayAttendance = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({ student: req.user.id, date: today });
    res.status(200).json({
      success: true,
      marked: !!attendance,
      attendance
    });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const { studentId } = req.query;
    const filter = {};
    if (req.user.role === 'student') {
      filter.student = req.user.id;
    } else if (studentId) {
      filter.student = studentId;
    }

    const history = await Attendance.find(filter).sort({ date: -1 }).limit(100);
    res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    next(error);
  }
};

const getAllTodayAttendance = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceList = await Attendance.find({ date: today }).populate('student', 'name email department year');
    res.status(200).json({
      success: true,
      attendance: attendanceList
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAttendance,
  getTodayAttendance,
  getHistory,
  getAllTodayAttendance
};