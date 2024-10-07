const OpenAI = require('openai');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const config = require('../config/config');
const openai = new OpenAI({ apiKey: config.openAIAPIKey });

// In-memory session storage (consider using Redis or a database for production)
const sessions = {};

// Questions for data collection
const studentQuestions = [
  "What is your name?",
  "What is your age?",
  "What is your class/standard?",
  "What is your stream if you are in 11 or 12? Enter 'general' if not applicable.",
  "What is the name of your school?",
  "What is the board of your school?",
  "What is your e-mail address?",
  "What is your mobile number?"
];

const teacherQuestions = [
  "What is your name?",
  "What is your age?",
  "What subject do you teach?",
  "Which grade levels do you teach?",
  "What is your e-mail address?",
  "What is your mobile number?"
];

// Fetch syllabus details using OpenAI
const fetchSyllabus = async (classStandard, board, stream) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are an educational assistant providing syllabus details.' },
      { role: 'user', content: `Provide the syllabus and key topics covered for class/standard ${classStandard} with stream ${stream} under the ${board} board.` }
    ]
  });

  return completion.choices[0]?.message?.content.trim() || 'No syllabus available.';
};

// Store responses and manage questions
const storeUserResponse = async (req, res) => {
  try {
    const { user, role, step, sessionId } = req.body;
    const currentQuestions = role === 'student' ? studentQuestions : teacherQuestions;
    const session = sessions[sessionId] || {};

    console.log('Received user data:', user);

    if (step >= currentQuestions.length) {
      if (role === 'student') {
        const { name, age, class: classStandard, stream, school, board, email, mobile } = user;

        if (!name || !age || !classStandard || !stream || !school || !board || !email || !mobile) {
          return res.status(400).json({ error: 'Missing required fields. Please ensure all information is provided.' });
        }

        const studentData = {
          name,
          age,
          class: classStandard,
          stream: stream ? stream : 'general',
          school,
          board,
          email,
          mobile
        };

        console.log('Saving student data:', studentData);

        const student = new Student(studentData);
        const savedStudent = await student.save();

        const syllabus = await fetchSyllabus(classStandard, board, stream);
        session.syllabusContext = { classStandard, board, stream, syllabus };
        sessions[sessionId] = session;

        res.status(200).json({
          reply: `We have collected your information. Based on your class/standard (${classStandard}) and board (${board}), here is your syllabus: ${syllabus}. How can I help you further?`,
          nextStep: null,
          complete: true,
        });
      } else if (role === 'teacher') {
        const { name, age, subject, grade_levels, email, mobile } = user;
        
        if (!name || !age || !subject || !grade_levels || !email || !mobile) {
          return res.status(400).json({ error: 'Missing required fields. Please ensure all information is provided.' });
        }

        const teacherData = {
          name,
          age: parseInt(age, 10),
          subject,
          grade_levels,
          email,
          mobile
        };

        console.log('Saving teacher data:', teacherData);

        const teacher = new Teacher(teacherData);
        const savedTeacher = await teacher.save();

        res.status(200).json({
          reply: "We have collected your information. How can I help you further?",
          nextStep: null,
          complete: true,
        });
      }
    } else {
      res.status(200).json({
        message: 'Partial response stored',
        user,
        nextStep: step + 1,
        nextQuestion: currentQuestions[step]
      });
    }
  } catch (error) {
    console.error('Error in storeUserResponse:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Duplicate email detected. Please use a different email address.' });
    } else {
      res.status(500).json({ error: 'An error occurred while saving the response.' });
    }
  }
};

// Handle further requests using OpenAI
const handleFurtherRequests = async (req, res) => {
  try {
    const { message, role, sessionId } = req.body;
    const session = sessions[sessionId];

    if (session && session.syllabusContext) {
      const { classStandard, board, stream, syllabus } = session.syllabusContext;

      const educationalPrompt = `User belongs to class ${classStandard}, board ${board}, stream ${stream}. Their syllabus is: ${syllabus}. ${message}`;

      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: educationalPrompt },
          { role: 'user', content: message }
        ],
        model: 'gpt-4o-mini'
      });

      res.status(200).json({ reply: completion.choices[0]?.message?.content.trim() || 'Sorry, I cannot assist with that request.' });
    } else {
      res.status(400).json({ error: 'Session context unavailable. Please provide class and subject details.' });
    }
  } catch (error) {
    console.error('Error generating OpenAI response:', error);
    res.status(500).json({ error: 'An error occurred while generating the response.' });
  }
};

module.exports = { storeUserResponse, handleFurtherRequests };