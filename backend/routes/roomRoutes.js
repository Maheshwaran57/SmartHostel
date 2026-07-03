const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  allocateRoom,
  manualAllocate,
  transferRoom,
  deallocateRoom
} = require('../controllers/roomController');

const router = express.Router();

router.use(protect);

router.get('/', getRooms);
router.get('/:id', getRoom);

// Admin-only room administration
router.post('/', authorize('admin'), createRoom);
router.put('/:id', authorize('admin'), updateRoom);
router.delete('/:id', authorize('admin'), deleteRoom);
router.post('/allocate', authorize('admin'), allocateRoom);
router.post('/allocate/manual', authorize('admin'), manualAllocate);
router.post('/transfer', authorize('admin'), transferRoom);
router.post('/deallocate', authorize('admin'), deallocateRoom);

module.exports = router;