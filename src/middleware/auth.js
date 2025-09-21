const jwt = require('jsonwebtoken');
const { users } = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      message: 'Please provide a valid JWT token in the Authorization header'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid token',
        message: 'The provided token is invalid or expired'
      });
    }

    // Find user by ID from token
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(403).json({
        error: 'User not found',
        message: 'User associated with this token no longer exists'
      });
    }

    // Add user to request object
    req.user = user.toJSON();
    next();
  });
};

// Generate JWT token for user
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  authenticateToken,
  generateToken,
  JWT_SECRET
};
