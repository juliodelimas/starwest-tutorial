const { users } = require('../models/User');
const { generateToken } = require('../middleware/auth');

class AuthService {
  // Authenticate user and return token
  static async login(email, password) {
    // Find user by email
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await user.verifyPassword(password);
    
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken(user.id);

    return {
      token,
      user: user.toJSON()
    };
  }

  // Get user by ID
  static getUserById(userId) {
    return users.find(u => u.id === userId);
  }

  // Get all users (for admin purposes)
  static getAllUsers() {
    return users.map(user => user.toJSON());
  }
}

module.exports = AuthService;
