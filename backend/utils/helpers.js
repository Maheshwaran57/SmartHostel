const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
  });
};

const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const paginate = (query, page = 1, limit = 10) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  return { skip, limit: limitNum, page: pageNum };
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

module.exports = {
  generateToken,
  generateRefreshToken,
  generateResetToken,
  paginate,
  filterObj
};