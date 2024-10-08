const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { configureCors, configureSession } = require('./config/middleware');  // Import middleware functions

// Load environment variables from .env file
dotenv.config();

const app = express();

// Logger middleware to show requests
app.use(morgan('dev'));

// CORS Middleware — ensure CORS is configured before sessions or routes
app.use(configureCors());

// Body parser (to handle JSON requests)
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'test',  // Name of your MongoDB database
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Setup Session Middleware
app.use(configureSession(mongoose.connection));  // Use mongoose's connection object

// Load routes (centralized route handler)
app.use('/api', require('./routes'));   // Ensure routes are correctly imported

// Global Error Handler middleware (for catching errors)
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log full error details to the console
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong!' });
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});