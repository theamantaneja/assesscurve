const Student = require('../models/Student');

const createStudent = async (req, res) => {
  try {
    console.log('Received student data:', req.body);
    const { name, age, class: classStandard, school, board, email, mobile } = req.body;

    const student = new Student({
      name,
      age,
      class: classStandard,
      school,
      board,
      email,
      mobile
    });

    console.log('Student object created:', student);
    const savedStudent = await student.save();
    console.log('Student saved successfully:', savedStudent);
    res.status(201).send(savedStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(400).send(error.message);
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).message('Student not found').send();
    }
    res.status(200).send(student);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateStudent = async (req, res) => {
  try {
    const { name, age, class: classStandard, school, board, email, mobile } = req.body;

    const student = await Student.findByIdAndUpdate(req.params.id, { name, age, class: classStandard, school, board, email, mobile }, { new: true, runValidators: true });
    if (!student) {
      return res.status(404).message('Student not found').send();
    }
    res.status(200).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).message('Student not found').send();
    }
    res.status(200).send(student);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createStudent, getStudents, getStudentById, updateStudent, deleteStudent };