const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { accessSecret } = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, accessSecret);

    const user = await User.findById(payload.sub).select('name email role');

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
});

module.exports = protect;
