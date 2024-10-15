const express = require('express');
const router = express.Router();
const { 
  createTeacher, 
  getTeachers, 
  getTeacherById, 
  updateTeacher, 
  deleteTeacher,
  evaluatePdf  // Import the PDF evaluation controller function
} = require('../controllers/teacherController');

// Teacher Routes
router.post('/', createTeacher);
router.get('/', getTeachers);
router.get('/:id', getTeacherById);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

// Route to evaluate the PDF (for teacher's assessment tool)
router.post('/evaluate-pdf', evaluatePdf); // Assume this has been added to your teacherController

module.exports = router;