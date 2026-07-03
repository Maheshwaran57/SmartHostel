const User = require('../models/User');
const AppError = require('../utils/AppError');
const { generateToken, generateRefreshToken, generateResetToken } = require('../utils/helpers');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../services/emailService');
const crypto = require('crypto');

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, department, year, emergencyContact } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      phone,
      department,
      year,
      emergencyContact
    });

    const token = generateToken({ id: user._id }, process.env.JWT_SECRET, process.env.JWT_EXPIRE);
    const refreshToken = generateRefreshToken({ id: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    await sendWelcomeEmail(user);

    res.status(201).json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated.', 403));
    }

    const token = generateToken({ id: user._id }, process.env.JWT_SECRET, process.env.JWT_EXPIRE);
    const refreshToken = generateRefreshToken({ id: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return next(new AppError('Refresh token is required', 400));
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return next(new AppError('Invalid refresh token', 401));
    }

    const newAccessToken = generateToken({ id: user._id }, process.env.JWT_SECRET, process.env.JWT_EXPIRE);
    res.status(200).json({
      success: true,
      token: newAccessToken
    });
  } catch (error) {
    next(new AppError('Invalid or expired refresh token', 401));
  }
};

const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};

const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'phone', 'department', 'year', 'emergencyContact', 'avatar'];
    const filteredBody = {};
    Object.keys(req.body).forEach(el => {
      if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
    });

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError('Incorrect current password', 401));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('There is no user with that email address.', 404));
    }

    const resetToken = generateResetToken();
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(user, resetUrl);
      res.status(200).json({ success: true, message: 'Token sent to email!' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return next(new AppError('There was an error sending the email. Try again later.', 500));
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful!' });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload an image file', 400));
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, { avatar: avatarUrl }, {
      new: true
    });

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};