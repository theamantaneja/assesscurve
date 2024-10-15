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
    // Ensure the file has been uploaded with Multer's help
    const questionPaper = req.files['questionPaper'] ? req.files['questionPaper'][0] : null;
    const answersPDF = req.files['answersPDF'] ? req.files['answersPDF'][0] : null;

    // Ensure both PDFs are uploaded
    if (!questionPaper || !answersPDF) {
      return res.status(400).json({ error: 'Both question paper and answers PDF are required for evaluation.' });
    }

    // Log the paths for debugging purposes (Multer stores files in the temp directory on the server)
    console.log('Evaluating question paper path:', questionPaper.path);
    console.log('Evaluating answers PDF path:', answersPDF.path);

    // Call the Vertex AI evaluation service, passing the files' paths
    const vertexAIResponse = await runVertexAIPdfEvaluation(questionPaper.path, answersPDF.path);

    // Respond to the frontend with Vertex AI's evaluation result
    return res.status(200).json({
      reply: vertexAIResponse
    });

  } catch (error) {
    console.error('Error processing PDF evaluation request:', error);
    return res.status(500).json({ error: 'An error occurred while evaluating the PDFs.' });
  }
};


module.exports = { createTeacher, getTeachers, getTeacherById, updateTeacher, deleteTeacher, evaluatePdf };