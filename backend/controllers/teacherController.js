const Teacher = require('../models/Teacher');

const createTeacher = async (req, res) => {
  try {
    const { name, age, subject, grade_levels, email, mobile } = req.body;

    const teacher = new Teacher({
      name,
      age,
      subject,
      grade_levels,
      email,
      mobile
    });

    await teacher.save();
    res.status(201).send(teacher);
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(400).send(error);
  }
};

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).send(teachers);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).message('Teacher not found').send();
    }
    res.status(200).send(teacher);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { name, age, subject, grade_levels, email, mobile } = req.body;

    const teacher = await Teacher.findByIdAndUpdate(req.params.id, { name, age, subject, grade_levels, email, mobile }, { new: true, runValidators: true });
    if (!teacher) {
      return res.status(404).message('Teacher not found').send();
    }
    res.status(200).send(teacher);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).message('Teacher not found').send();
    }
    res.status(200).send(teacher);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createTeacher, getTeachers, getTeacherById, updateTeacher, deleteTeacher };