const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  classStandard: { type: String, required: true },  // Class field (not 'class' as it's reserved)
  stream: { type: String, default: "general" },
  school: { type: String, required: true },
  board: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Add a reference to the chat history
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatHistory' }]  
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;