const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

module.exports = {
  mongoURI: process.env.MONGO_URI,
  openAIAPIKey: process.env.OPENAI_API_KEY,
  port: process.env.PORT || 5000,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioWhatsAppNumber: process.env.TWILIO_WHATSAPP_NUMBER,
};