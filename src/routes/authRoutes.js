const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  refresh,
  logout
} = require('../controllers/authController');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication requests. Try again later.' }
});

router.post('/register', authRateLimit, asyncHandler(register));
router.post('/login', authRateLimit, asyncHandler(login));
router.post('/refresh', asyncHandler(refresh));
router.post('/logout', asyncHandler(logout));

module.exports = router;
