const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
  markAttendance,
  getTodayAttendance,
  getHistory,
  getAllTodayAttendance
} = require('../controllers/attendanceController');

const router = express.Router();

router.use(protect);

router.post('/mark', authorize('student'), markAttendance);
router.get('/today', authorize('student'), getTodayAttendance);
router.get('/history', getHistory);
router.get('/today-all', authorize('admin'), getAllTodayAttendance);

module.exports = router;