const express = require('express');
const { handleChatRequest } = require('../controllers/chatController');  // Unified function
const router = express.Router();

// Route to handle both initial and further requests via POST
router.post('/further', handleChatRequest);  // Same endpoint for both initial and further interactions

module.exports = router;