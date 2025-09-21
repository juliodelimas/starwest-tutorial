const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/login', AuthController.login);
router.get('/users', AuthController.getAllUsers); // For testing purposes

// Protected routes
router.get('/profile', authenticateToken, AuthController.getProfile);

module.exports = router;
