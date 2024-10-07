const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const config = require('./config/config');

dotenv.config();

const app = express();

// Allow requests from your frontend URL
app.use(cors({
  origin: 'https://assesscurve.vercel.app' // Your frontend URL
}));

app.use(express.json());

mongoose.connect(config.mongoURI, {
  dbName: 'test'  // Ensure this matches your database name
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Load routes
app.use('/api/chat', require('./routes/chatRoutes'));

// // Webhook verification
// app.get('/webhook', (req, res) => {
//   const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

//   const mode = req.query['hub.mode'];
//   const token = req.query['hub.verify_token'];
//   const challenge = req.query['hub.challenge'];

//   if (mode && token) {
//     if (mode === 'subscribe' && token === VERIFY_TOKEN) {
//       console.log("WEBHOOK_VERIFIED");
//       res.status(200).send(challenge);
//     } else {
//       res.sendStatus(403);
//     }
//   } else {
//     res.sendStatus(404);
//   }
// });

// Webhook to receive messages
// app.post('/webhook', (req, res) => {
//   const body = req.body;

//   if (body.object === 'whatsapp_business_account') {
//     body.entry.forEach(entry => {
//       // Handle each message
//       const message = entry.changes[0].value.messages[0];
//       if (message && message.from) {
//         const from = message.from;
//         const msgBody = message.text.body;
//         console.log('Received message from', from, ':', msgBody);
        
//         sendMessage(from, `You said: ${msgBody}`);
//       }
//     });
//     res.status(200).send('EVENT_RECEIVED');
//   } else {
//     res.sendStatus(404);
//   }
// });

// Function to send a message using Meta API
// function sendMessage(recipientPhone, messageText) {
//   axios.post(`https://graph.facebook.com/v13.0/${process.env.PHONE_NUMBER_ID}/messages`, {
//     messaging_product: 'whatsapp',
//     to: recipientPhone,
//     type: 'text',
//     text: { body: messageText }
//   }, {
//     headers: { 
//       'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
//       'Content-Type': 'application/json'
//     }
//   })
//   .then(response => {
//     console.log('Message sent!', response.data);
//   })
//   .catch(error => {
//     console.error('Error sending message:', error.response ? error.response.data : error.message);
//   });
// }

const PORT = config.port || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));