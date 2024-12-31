import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET, // Replace with a secure key
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // Session duration (1 day)
    httpOnly: true, // Protect cookies from XSS
    secure: false,  // Set to true in production with HTTPS
  },
});

export default sessionMiddleware;
