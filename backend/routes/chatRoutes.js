const express = require('express');
const router = express.Router();
const { storeUserResponse, handleFurtherRequests } = require('../controllers/chatController');

router.post('/saveResponse', storeUserResponse);
router.post('/furtherRequest', handleFurtherRequests);

module.exports = router;