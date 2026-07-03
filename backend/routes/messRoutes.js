const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
  getTodayMenu,
  getWeekMenu,
  getMonthMenu,
  createMenu,
  updateMenu,
  deleteMenu
} = require('../controllers/messController');

const router = express.Router();

router.use(protect);

router.get('/today', getTodayMenu);
router.get('/week', getWeekMenu);
router.get('/month', getMonthMenu);

router.post('/', authorize('admin'), createMenu);
router.put('/:id', authorize('admin'), updateMenu);
router.delete('/:id', authorize('admin'), deleteMenu);

module.exports = router;