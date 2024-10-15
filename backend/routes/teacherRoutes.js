// const express = require('express');
// const router = express.Router();
// const multer = require('multer'); // Import multer for file uploads
// const { 
//   createTeacher, 
//   getTeachers, 
//   getTeacherById, 
//   updateTeacher, 
//   deleteTeacher,
//   evaluatePdf  // Import the PDF evaluation controller function
// } = require('../controllers/teacherController');

// // Configure Multer to handle file uploads
// const upload = multer({ 
//   dest: 'uploads/', // Define folder for temporary file storage
//   limits: { fileSize: 10 * 1024 * 1024 } // Optional: Limit file size (here set to 10 MB max)
// });

// // Teacher Routes
// router.post('/', createTeacher);
// router.get('/', getTeachers);
// router.get('/:id', getTeacherById);
// router.put('/:id', updateTeacher);
// router.delete('/:id', deleteTeacher);

// // Route to evaluate the PDF (for teacher's assessment tool)
// // Handles two fields - questionPaper and answersPDF
// router.post('/evaluate', upload.fields([  // Use '/evaluate' instead of '/evaluate-pdf'
//     { name: 'questionPaper', maxCount: 1 },
//     { name: 'answersPDF', maxCount: 1 }
//   ]), evaluatePdf);

// module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { evaluatePdf } = require('../controllers/teacherController'); 
// Ensure you're importing the controller function

// Configure Multer to handle file uploads
const upload = multer({ 
  dest: 'uploads/', 
  limits: { fileSize: 10 * 1024 * 1024 }  // 10MB limit
});

// Define the POST route for evaluating PDFs as '/evaluate-pdf'
router.post('/evaluate-pdf', upload.fields([
  { name: 'questionPaper', maxCount: 1 },  
  { name: 'answersPDF', maxCount: 1 }      
]), evaluatePdf);  // Connect this route to the evaluatePdf controller

// Export the router
module.exports = router;