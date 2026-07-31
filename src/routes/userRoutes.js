const express = require('express');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const { me, adminOnly } = require('../controllers/authController');

const router = express.Router();

router.get('/me', protect, asyncHandler(me));
router.get('/admin-only', protect, authorize('admin'), asyncHandler(adminOnly));

module.exports = router;
