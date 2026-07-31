const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {
  accessSecret,
  refreshSecret,
  accessExpiresIn,
  refreshExpiresIn
} = require('../config/env');

function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role
    },
    accessSecret,
    { expiresIn: accessExpiresIn }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      type: 'refresh'
    },
    refreshSecret,
    { expiresIn: refreshExpiresIn }
  );
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getExpiryDateFromJwt(token) {
  const payload = jwt.decode(token);
  if (!payload?.exp) {
    throw new Error('Invalid token expiry');
  }
  return new Date(payload.exp * 1000);
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  hashToken,
  getExpiryDateFromJwt
};
