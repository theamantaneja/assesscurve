const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'userModel' },  
  userModel: { type: String, required: true, enum: ['Student', 'Teacher'] },  
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }  
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
module.exports = ChatHistory;