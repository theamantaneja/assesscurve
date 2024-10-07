const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  subject: { type: String, required: true },
  grade_levels: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true }
}, {
  timestamps: true
});

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;