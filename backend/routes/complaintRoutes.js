const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const { uploadSingle, uploadMultiple } = require('../middlewares/upload');
const {
  getComplaints,
  getComplaint,
  createComplaint,
  updateStatus,
  assignComplaint,
  resolveComplaint
} = require('../controllers/complaintController');

const router = express.Router();

router.use(protect);

router.get('/', getComplaints);
router.get('/:id', getComplaint);
router.post('/', authorize('student'), uploadMultiple, createComplaint);
router.put('/:id/status', authorize('admin', 'staff'), updateStatus);
router.put('/:id/assign', authorize('admin'), assignComplaint);
router.put('/:id/resolve', authorize('admin', 'staff'), uploadSingle, resolveComplaint);

module.exports = router;