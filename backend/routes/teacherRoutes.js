const express = require('express');
const router = express.Router();
const { createTeacher, getTeachers, getTeacherById, updateTeacher, deleteTeacher } = require('../controllers/teacherController');

// Teacher Routes
router.post('/', createTeacher);
router.get('/', getTeachers);
router.get('/:id', getTeacherById);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

module.exports = router;