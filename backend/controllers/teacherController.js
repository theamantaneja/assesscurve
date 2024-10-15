const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');

// Create a new teacher
const createTeacher = async (req, res) => {
  try {
    const { name, age, subject, grade_levels, email, mobile, username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new Teacher({
      name,
      age,
      subject,
      grade_levels,
      email,
      mobile,
      username,
      password: hashedPassword, // Save hashed password
    });

    await teacher.save();
    res.status(201).send(teacher);
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(400).send(error);
  }
};

// Get all teachers
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).send(teachers);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get teacher by ID
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).send('Teacher not found');
    }
    res.status(200).send(teacher);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update teacher
const updateTeacher = async (req, res) => {
  try {
    const { name, age, subject, grade_levels, email, mobile } = req.body;

    const teacher = await Teacher.findByIdAndUpdate(req.params.id, 
      { name, age, subject, grade_levels, email, mobile }, 
      { new: true, runValidators: true }
    );

    if (!teacher) {
      return res.status(404).send('Teacher not found');
    }
    res.status(200).send(teacher);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete teacher
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).send('Teacher not found');
    }
    res.status(200).send(teacher);
  } catch (error) {
    res.status(500).send(error);
  }
};

const { runVertexAIPdfEvaluation } = require('../services/vertexAiService'); // Import the new Vertex AI service for PDFs

// Handle the evaluation of a PDF containing question/answer content
const evaluatePdf = async (req, res) => {
  try {
    const { filePath } = req.body; // Get the PDF file path from the request body (after upload handling)

    if (!filePath) {
      return res.status(400).json({ error: 'PDF file path is required for evaluation.' });
    }

    console.log(`Received request to evaluate PDF: ${filePath}`);

    // Send the PDF file path to the Vertex AI service for evaluation
    const vertexAIResponse = await runVertexAIPdfEvaluation(filePath);

    // Return the evaluation result from Vertex AI to the frontend
    return res.status(200).json({
      reply: vertexAIResponse
    });

  } catch (error) {
    console.error('Error processing PDF evaluation request:', error);
    return res.status(500).json({ error: 'An error occurred while evaluating the PDF.' });
  }
};


module.exports = { createTeacher, getTeachers, getTeacherById, updateTeacher, deleteTeacher, evaluatePdf };