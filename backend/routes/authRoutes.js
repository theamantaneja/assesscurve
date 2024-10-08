const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');  // Ensure imports are correct
const router = express.Router();

router.post('/register', registerUser);  // Register route
router.post('/login', loginUser);  // Login route

router.post('/logout', logoutUser);

module.exports = router;