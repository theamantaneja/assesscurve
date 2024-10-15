const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// Function to create a new student
const createStudent = async (req, res) => {
  try {
    const { name, age, class: classStandard, school, board, email, mobile, username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      age,
      class: classStandard,
      school,
      board,
      email,
      mobile,
      username,
      password: hashedPassword, // Save hashed password
    });

    await student.save();
    res.status(201).send(student);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(400).send(error);
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.status(200).send(student);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { name, age, class: classStandard, school, board, email, mobile } = req.body;

    const student = await Student.findByIdAndUpdate(req.params.id, 
      { name, age, class: classStandard, school, board, email, mobile }, 
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.status(200).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.status(200).send(student);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createStudent, getStudents, getStudentById, updateStudent, deleteStudent };