const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Configures CORS for the application
const configureCors = () => {
  return cors({
    origin: process.env.CORS_ORIGIN || 'https://assesscurve.vercel.app', // Use either environment or default local
    credentials: true, // Allow credentials like cookies, authorization headers, etc.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
};

// Configures session management with MongoDB store
const configureSession = (mongooseConnection) => {
  return session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/test', // Default local URI if not set
      ttl: 14 * 24 * 60 * 60,  // Sessions expire in 14 days
      collectionName: 'sessions', // Optional: customize collection name for sessions
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // In production, cookies should only be sent over HTTPS
      httpOnly: true,  // Prevent client-side JavaScript from accessing the cookie
      maxAge: 1000 * 60 * 60 * 24 * 7,  // Cookie expires in 7 days
    }
  });
};

module.exports = { configureCors, configureSession };