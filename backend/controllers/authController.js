const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// Register a new user (Student / Teacher)
const registerUser = async (req, res) => {
  try {
    const {
      username,
      password,
      name,
      email,
      age,
      classStandard, // Students only
      stream,
      school,
      board,
      subject,       // Teachers only
      grade_levels,  // Teachers only
      mobile,
      role
    } = req.body;

    // Log incoming request body for debugging
    console.log('Received registration data:', req.body);

    // Validate role: must be 'student' or 'teacher'
    if (!role || (role !== 'student' && role !== 'teacher')) {
      return res.status(400).json({ error: 'Invalid role provided!' });
    }

    // Additional validation for students
    if (role === 'student' && (!classStandard || !school || !board)) {
      console.error({ error: 'Missing required fields for student' });
      return res.status(400).json({ error: 'Missing required fields for student!' });
    }

    // Additional validation for teachers
    if (role === 'teacher' && (!subject || !grade_levels)) {
      console.error({ error: 'Missing required fields for teacher' });
      return res.status(400).json({ error: 'Missing required fields for teacher!' });
    }

    // Check if email or username is already used
    const existingEmail = await Student.findOne({ email }) || await Teacher.findOne({ email });
    if (existingEmail) return res.status(409).json({ error: 'Email already registered!' });

    const existingUsername = await Student.findOne({ username }) || await Teacher.findOne({ username });
    if (existingUsername) return res.status(409).json({ error: 'Username already exists!' });

    // Hash the password before saving the user
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
      await newStudent.save();  // Save the student to the database
      return res.status(201).json({ message: 'Student registered successfully!', user: newStudent });
      
    } else if (role === 'teacher') {
      // Create a new teacher
      const newTeacher = new Teacher({
        username,
        password: hashedPassword,
        name,
        email,
        age,
        subject,
        grade_levels,
        mobile,
      });
      await newTeacher.save();  // Save the teacher to the database
      return res.status(201).json({ message: 'Teacher registered successfully!', user: newTeacher });
    }

  } catch (error) {
    // Log the actual server error that caused the exception
    console.error('Error during registration: ', error);

    // Send back the error message as a 500 Internal Server Error
    return res.status(500).json({ error: 'Failed to register user due to internal server error.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Ensure username, password, and role are present in req.body
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Please provide username, password, and role.' });
    }

    // Ensure role is valid (either 'student' or 'teacher')
    if (role !== 'student' && role !== 'teacher') {
      return res.status(400).json({ error: 'Invalid role. Must be either "student" or "teacher".' });
    }

    // Fetch the user based on the provided role (Student or Teacher)
    let user;
    if (role === 'student') {
      user = await Student.findOne({ username });
    } else if (role === 'teacher') {
      user = await Teacher.findOne({ username });
    }

    // If user is not found in the database
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    // Compare provided password with the stored hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials! Check your username or password.' });
    }

    // Generate a JWT token with user ID and role, valid for 1 hour
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // **Important**: Retrieve additional user details to send back in the response
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,  // Assuming there's an email field
      role,
      // Add any other necessary fields here
    };

    // Send back the token and complete user details
    res.status(200).json({
      token,
      user: userData
    });
    
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Failed to login due to server error.' });
  }
};

// authController.js (Backend)

const logoutUser = (req, res) => {
  try {
    // If using session authentication, destroy the session on logout
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          console.error('Failed to destroy session:', err);
          return res.status(500).json({ message: 'Failed to log out. Please try again later.' });
        }
        res.clearCookie('connect.sid');  // Clear the session cookie
        return res.status(200).json({ message: 'Logged out successfully.' });
      });
    } else {
      return res.status(200).json({ message: 'No session found to log out, but assuming user is logged out.' });
    }
  } catch (error) {
    console.error('Error logging out:', error);
    return res.status(500).json({ message: 'Failed to log out. Please try again later.' });
  }
};

module.exports = { registerUser, loginUser, logoutUser };