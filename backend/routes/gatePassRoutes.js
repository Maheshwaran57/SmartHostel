const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
  applyGatePass,
  getGatePasses,
  updateGatePassStatus
} = require('../controllers/gatePassController');

const router = express.Router();

router.use(protect);

router.post('/', authorize('student'), applyGatePass);
router.get('/', getGatePasses);
router.put('/:id/status', authorize('admin'), updateGatePassStatus);

module.exports = router;