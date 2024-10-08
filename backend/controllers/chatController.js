const OpenAI = require('openai');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const config = require('../config/config');
const openai = new OpenAI({ apiKey: config.openAIAPIKey });

// Questions for data collection
const studentQuestions = [
  "What is your class/standard?",
  "What is your stream if you are in 11 or 12? Enter 'general' if not applicable.",
  "What is the board of your school?",
];

const teacherQuestions = [
  "What subject do you teach?",
  "Which grade levels do you teach?",
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
    const { user, role, step } = req.body;
    const currentQuestions = role === 'student' ? studentQuestions : teacherQuestions;

    console.log('Received user data:', user);

    if (step >= currentQuestions.length) {
      if (role === 'student') {
        const { class: classStandard, stream, board } = user;

        const studentData = {
          name: user.name || 'Anonymous', // Default name
          age: user.age || null, // Default age
          class: classStandard,
          stream: stream || 'general',
          school: user.school || 'Unknown School', // Default school
          board,
          email: user.email || 'noemail@example.com', // Default email
          mobile: user.mobile || '0000000000' // Default mobile
        };

        console.log('Saving student data:', studentData);

        const student = new Student(studentData);
        const savedStudent = await student.save();
        const syllabus = await fetchSyllabus(classStandard, board, stream);

        res.status(200).json({
          reply: `We have collected your information. Based on your class/standard (${classStandard}) and board (${board}), here is your syllabus: ${syllabus}. How can I help you further?`,
          nextStep: null,
          complete: true,
        });
      } else if (role === 'teacher') {
        const { subject, grade_levels } = user;

        const teacherData = {
          name: user.name || 'Anonymous', // Default name
          age: user.age || null, // Default age
          subject,
          grade_levels,
          email: user.email || 'noemail@example.com', // Default email
          mobile: user.mobile || '0000000000' // Default mobile
        };

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
        nextQuestion: currentQuestions[step],
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
    const { message, role, classStandard, board, stream, subject, grade_levels } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: `Welcome to AssessCurve! 🌟
          You're a dedicated assistant for a ${role} handling inquiries related to the Indian curriculum. 

          Based on the provided details, you can help students and teachers with premium educational assistance.

          For students in ${classStandard} ${board} ${stream}, I can create notes, provide resources, etc.
          For teachers teaching ${subject} to ${grade_levels}, I can assist in lesson planning and question paper design.` 
        },
        { role: 'user', content: message }
      ]
    });
    
    res.status(200).json({ reply: completion.choices[0]?.message?.content.trim() || 'Sorry, I cannot assist with that request.' });

  } catch (error) {
    console.error('Error generating OpenAI response:', error);
    res.status(500).json({ error: 'An error occurred while generating the response.' });
  }
};

module.exports = { storeUserResponse, handleFurtherRequests };