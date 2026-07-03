const express = require('express');
const { protect } = require('../middlewares/auth');
const { uploadSingle } = require('../middlewares/upload');
const {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  updateAvatar
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.put('/avatar', protect, uploadSingle, updateAvatar);
router.put('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;