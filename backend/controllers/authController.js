const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const config = require('../config/config');

// Register a new user (Student / Teacher)
const registerUser = async (req, res) => {
  try {
    const {
      username,
      password,
      name,
      email,
      age,
      classStandard,  // Students only
      stream,
      school,
      board,
      subject,        // Teachers only
      grade_levels,   // Teachers only
      mobile,
      role
    } = req.body;

    // Log incoming registration data for debugging purposes
    console.log('Received registration data:', req.body);

    // Validate role: must be 'student' or 'teacher'
    if (!role || (role !== 'student' && role !== 'teacher')) {
      console.error('Invalid role provided:', role);
      return res.status(400).json({ error: 'Invalid role provided!' });
    }
    
    // Check for required fields for students
    if (role === 'student' && (!classStandard || !school || !board)) {
      console.error('Missing required fields for student:', req.body);
      return res.status(400).json({ error: 'Missing required fields for student!' });
    }

    // Check for required fields for teachers
    if (role === 'teacher' && (!subject || !grade_levels)) {
      console.error('Missing required fields for teacher:', req.body);
      return res.status(400).json({ error: 'Missing required fields for teacher!' });
    }

    // Check if email or username already exists in either collections (Student, Teacher)
    const emailExists = await Student.findOne({ email }) || await Teacher.findOne({ email });
    if (emailExists) {
      console.error('Email already exists:', email);
      return res.status(409).json({ error: 'Email already registered!' });
    }

    const usernameExists = await Student.findOne({ username }) || await Teacher.findOne({ username });
    if (usernameExists) {
      console.error('Username already exists:', username);
      return res.status(409).json({ error: 'Username already exists!' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'student') {
      // Create a new student
      const newStudent = new Student({
        username,
        password: hashedPassword,
        name,
        email,
        age,
        classStandard,
        stream,
        school,
        board,
        mobile,
      });
      await newStudent.save();  // Save the student in the database

      return res.status(201).json({ message: 'Student registered successfully!', user: newStudent });
    } 
    else if (role === 'teacher') {
      // Create a new teacher
      const newTeacher = new Teacher({
        username,
        password: hashedPassword,
        name,
        email,
        age,
        subject,
        grade_levels,
        mobile
      });
      await newTeacher.save();  // Save the teacher in the database

      return res.status(201).json({ message: 'Teacher registered successfully!', user: newTeacher });
    }

  } catch (error) {
    console.error('Error during registration:', error);  // Log the actual server error
    return res.status(500).json({ error: 'Registration failed due to server error.' });
  }
};

// Login user (Student / Teacher)
const loginUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validate input
    if (!username || !password || !role) {
      console.error('Missing required fields for login:', req.body);
      return res.status(400).json({ error: 'Please provide username, password, and role.' });
    }

    // Role validation check
    if (role !== 'student' && role !== 'teacher') {
      console.error('Invalid role during login:', role);
      return res.status(400).json({ error: 'Invalid role. Must be either "student" or "teacher".' });
    }

    let user;
    // Fetch user based on role
    if (role === 'student') {
      user = await Student.findOne({ username });
    } else if (role === 'teacher') {
      user = await Teacher.findOne({ username });
    } 

    // If user is not found
    if (!user) {
      console.error('User not found for username:', username);
      return res.status(404).json({ error: 'User not found!' });
    }

    // Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error('Invalid credentials provided for username:', username);
      return res.status(400).json({ error: 'Invalid credentials! Check your username or password.' });
    }

    // Generate a JWT for the authenticated user
    const token = jwt.sign(
      { id: user._id, role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Send back token and user information
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role
      }
    });

  } catch (error) {
    console.error('Error during login:', error);  // Log actual server error
    return res.status(500).json({ error: 'Failed to log in due to server error.' });
  }
};

// Logout user (Session based logout)
const logoutUser = (req, res) => {
  try {
    // Destroy session if it's available
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          console.error('Failed to destroy session:', err);
          return res.status(500).json({ message: 'Failed to log out, please try again later.' });
        }
        res.clearCookie('connect.sid');  // Clear session cookie
        return res.status(200).json({ message: 'Logged out successfully.' });
      });
    } else {
      return res.status(200).json({ message: 'No active session found, considered logged out.' });
    }
  } catch (error) {
    console.error('Error during logout:', error);  // Actual error logging
    return res.status(500).json({ message: 'Failed to log out due to server error.' });
  }
};

module.exports = { registerUser, loginUser, logoutUser };