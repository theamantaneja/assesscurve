const express = require('express');
const router = express.Router();

// Import routes
router.use('/auth', require('./authRoutes')); // Authentication routes
router.use('/chat', require('./chatRoutes')); // Chat-related routes
router.use('/student', require('./studentRoutes')); // Student-related routes
router.use('/teacher', require('./teacherRoutes')); // Teacher-related routes

module.exports = router;