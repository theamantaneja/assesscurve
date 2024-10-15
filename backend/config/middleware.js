const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Configures CORS for the application with development and production checks
const configureCors = () => {
  const corsOptions = {
    origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'https://assesscurve.vercel.app'],  // Support localhost for development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  };

  return cors(corsOptions);
};

// Configures session management with MongoDB store
const configureSession = (mongooseConnection) => {
  return session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/test', // Local if no MONGO_URI is given
      ttl: 14 * 24 * 60 * 60,  // Set session expiration (14 days in this case)
      collectionName: 'sessions', // Optional: customize collection name
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Only use HTTPS cookies in production
      httpOnly: true,  // Prevent access to the cookie through JavaScript
      maxAge: 1000 * 60 * 60 * 24 * 7,  // Set cookie to expire in 7 days
      sameSite: 'strict',  // Additionally, protect against CSRF attacks
    }
  });
};

module.exports = { configureCors, configureSession };