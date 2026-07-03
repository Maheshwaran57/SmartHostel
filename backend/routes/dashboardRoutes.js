const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
  getAdminDashboard,
  getStudentDashboard,
  getStaffDashboard
} = require('../controllers/dashboardController');

const router = express.Router();

router.use(protect);

router.get('/admin', authorize('admin'), getAdminDashboard);
router.get('/student', authorize('student'), getStudentDashboard);
router.get('/staff', authorize('staff'), getStaffDashboard);

module.exports = router;