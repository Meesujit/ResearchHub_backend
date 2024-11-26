const jwt = require('jsonwebtoken');
require('dotenv').config();

// const JWT_SECRET = process.env.JWT_SECRET;

// Authentication middleware
exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token received:', token);

  if (!token) {
    console.log('Token not provided');
    return res.status(401).json({ error: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Invalid token:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};


// Authorization middleware for admin
exports.authorizeAdmin = async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied!' });
  }
  next();
};
