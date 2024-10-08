const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  class: { type: String, required: true },
  stream: { type: String, required: true, default: "general"},
  school: { type: String, required: true },
  board: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  // Stream field
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;











const handleFurtherRequests = async (req, res) => {
  try {
    // Destructure all necessary data from the request body
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