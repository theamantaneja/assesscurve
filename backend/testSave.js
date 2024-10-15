const mongoose = require('mongoose');
const Student = require('./models/Student');
const config = require('./config/config');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

mongoose.connect(config.mongoURI, {
  dbName: 'test'  // Ensure this matches your database name
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const testSave = async () => {
  try {
    const student = new Student({
      name: "Test Student",
      age: 20,
      class: "10th Grade",
      school: "Test School",
      board: "CBSE",
      email: "teststudent@example.com",
      mobile: "1234567890"
    });

    const savedStudent = await student.save();
    console.log("Saved student document:", savedStudent);
  } catch (err) {
    console.error("Error saving student document:", err);
  }
};

testSave().then(() => mongoose.disconnect());