/**
 * config.js
 * This file loads environment variables from the .env file using 'dotenv'
 * and exports the required config variables for use across the application.
 */

const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

// Export configuration values
module.exports = {
  mongoURI: process.env.MONGO_URI,          // MongoDB connection URI
  openAIAPIKey: process.env.OPENAI_API_KEY, // API Key for OpenAI
  port: process.env.PORT || 5000,           // Server port
  jwtSecret: process.env.JWT_SECRET,        // JWT secret for token signing
  sessionSecret: process.env.SESSION_SECRET, // Express session secret, if any
  nodeEnv: process.env.NODE_ENV || 'development',  // Environment (dev/prod)
};