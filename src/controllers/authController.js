const AuthService = require('../services/authService');

class AuthController {
  // Login endpoint
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Email and password are required'
        });
      }

      // Authenticate user
      const result = await AuthService.login(email, password);

      res.status(200).json({
        message: 'Login successful',
        data: result
      });

    } catch (error) {
      res.status(401).json({
        error: 'Authentication failed',
        message: error.message
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      res.status(200).json({
        message: 'User profile retrieved successfully',
        data: {
          user: req.user
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve user profile'
      });
    }
  }

  // Get all users (for testing purposes)
  static async getAllUsers(req, res) {
    try {
      const users = AuthService.getAllUsers();
      
      res.status(200).json({
        message: 'Users retrieved successfully',
        data: {
          users
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve users'
      });
    }
  }
}

module.exports = AuthController;
