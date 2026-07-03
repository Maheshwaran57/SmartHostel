const User = require('../models/User');
const Room = require('../models/Room');
const Complaint = require('../models/Complaint');
const Staff = require('../models/Staff');
const Allocation = require('../models/Allocation');
const MessMenu = require('../models/MessMenu');

const getAdminDashboard = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalRooms = await Room.countDocuments({});
    const availableRooms = await Room.countDocuments({ status: 'available' });
    const occupiedRooms = await Room.countDocuments({ status: 'full' });
    const partialRooms = await Room.countDocuments({ status: 'partial' });
    const maintenanceRooms = await Room.countDocuments({ status: 'maintenance' });
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const totalStaff = await User.countDocuments({ role: 'staff', isActive: true });

    // Aggregate Occupancy Data per Block
    const occupancyData = await Room.aggregate([
      {
        $group: {
          _id: '$block',
          occupied: { $sum: '$occupancy' },
          capacity: { $sum: '$capacity' }
        }
      },
      {
        $project: {
          block: '$_id',
          occupied: 1,
          capacity: 1,
          _id: 0
        }
      },
      { $sort: { block: 1 } }
    ]);

    // Complaint category breakdown
    const complaintCategoryData = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          value: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          value: 1,
          _id: 0
        }
      }
    ]);

    // Monthly complaint trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyComplaintTrend = await Complaint.aggregate([
      {
        $match: { createdAt: { $gte: sixMonthsAgo } }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              { $toString: '$_id.month' }
            ]
          },
          count: 1,
          _id: 0
        }
      },
      { $sort: { month: 1 } }
    ]);

    // Room utilization summary
    const roomUtilization = await Room.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalRooms,
        availableRooms,
        occupiedRooms,
        partialRooms,
        maintenanceRooms,
        pendingComplaints,
        resolvedComplaints,
        totalStaff
      },
      occupancyData,
      complaintCategoryData,
      monthlyComplaintTrend,
      roomUtilization
    });
  } catch (error) {
    next(error);
  }
};

const getStudentDashboard = async (req, res, next) => {
  try {
    const student = await User.findById(req.user.id);
    const allocation = await Allocation.findOne({ student: req.user.id, isActive: true })
      .populate({
        path: 'room',
        populate: {
          path: 'occupants',
          select: 'name email department year avatar phone'
        }
      });

    const recentComplaints = await Complaint.find({ student: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    const totalC = await Complaint.countDocuments({ student: req.user.id });
    const pendingC = await Complaint.countDocuments({ student: req.user.id, status: { $ne: 'resolved' } });
    const resolvedC = await Complaint.countDocuments({ student: req.user.id, status: 'resolved' });

    // Today's Mess Menu
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMenu = await MessMenu.findOne({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    res.status(200).json({
      success: true,
      profile: student,
      roomInfo: allocation ? allocation.room : null,
      recentComplaints,
      complaintStats: {
        total: totalC,
        pending: pendingC,
        resolved: resolvedC
      },
      todayMenu
    });
  } catch (error) {
    next(error);
  }
};

const getStaffDashboard = async (req, res, next) => {
  try {
    const staff = await Staff.findOne({ user: req.user.id });
    const assignedComplaints = await Complaint.find({ assignedTo: req.user.id, status: { $ne: 'resolved' } })
      .populate('student', 'name email phone department year');

    res.status(200).json({
      success: true,
      assignedComplaints,
      completedCount: staff ? staff.completedCount : 0,
      pendingCount: assignedComplaints.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getStudentDashboard,
  getStaffDashboard
};