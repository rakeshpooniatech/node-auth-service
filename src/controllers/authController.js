const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const {
  createAccessToken,
  createRefreshToken,
  hashToken,
  getExpiryDateFromJwt
} = require('../utils/token');
const { refreshSecret } = require('../config/env');

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

async function issueTokenPair(user) {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: getExpiryDateFromJwt(refreshToken)
  });

  return { accessToken, refreshToken };
}

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const exists = await User.findOne({ email: normalizedEmail });

  if (exists) {
    return res.status(409).json({ message: 'Email is already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash
  });

  const tokens = await issueTokenPair(user);

  return res.status(201).json({
    message: 'Registration successful',
    ...tokens,
    user: sanitizeUser(user)
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const matches = await bcrypt.compare(password, user.passwordHash);

  if (!matches) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const tokens = await issueTokenPair(user);

  return res.json({
    message: 'Login successful',
    ...tokens,
    user: sanitizeUser(user)
  });
}

async function refresh(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'refreshToken is required' });
  }

  let payload;

  try {
    payload = jwt.verify(refreshToken, refreshSecret);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }

  if (payload.type !== 'refresh') {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const stored = await RefreshToken.findOne({
    tokenHash: hashToken(refreshToken),
    revokedAt: null
  });

  if (!stored || stored.expiresAt < new Date()) {
    return res.status(401).json({ message: 'Refresh token is not active' });
  }

  const user = await User.findById(payload.sub);

  if (!user) {
    return res.status(401).json({ message: 'User no longer exists' });
  }

  stored.revokedAt = new Date();
  await stored.save();

  const tokens = await issueTokenPair(user);

  return res.json({
    message: 'Token refreshed successfully',
    ...tokens
  });
}

async function logout(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'refreshToken is required' });
  }

  await RefreshToken.findOneAndUpdate(
    { tokenHash: hashToken(refreshToken), revokedAt: null },
    { revokedAt: new Date() }
  );

  return res.json({ message: 'Logout successful' });
}

async function me(req, res) {
  return res.json({
    user: sanitizeUser(req.user)
  });
}

async function adminOnly(req, res) {
  return res.json({
    message: 'Welcome, admin',
    user: sanitizeUser(req.user)
  });
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
  adminOnly
};
