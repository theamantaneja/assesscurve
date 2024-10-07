const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  class: { type: String, required: true },
  stream: { type: String, required: true, default: "general"},
  school: { type: String, required: true },
  board: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  // Stream field
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;