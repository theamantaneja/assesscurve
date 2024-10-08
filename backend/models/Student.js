const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: false },
  age: { type: Number, required: false },
  class: { type: String, required: true },
  stream: { type: String, required: true, default: "general"},
  school: { type: String, required: false },
  board: { type: String, required: true },
  email: { type: String, required: false, unique: true },
  mobile: { type: String, required: false },
  // Stream field
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;











