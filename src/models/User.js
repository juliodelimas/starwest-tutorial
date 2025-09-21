const bcrypt = require('bcryptjs');

class User {
  constructor(id, email, password, name) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.createdAt = new Date();
  }

  // Hash password before storing
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Get user without password for API responses
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt
    };
  }
}

// In-memory storage for users
const users = [];

// Initialize with 3 default users
const initializeUsers = async () => {
  const defaultUsers = [
    {
      id: 1,
      email: 'john.doe@example.com',
      password: 'password123',
      name: 'John Doe'
    },
    {
      id: 2,
      email: 'jane.smith@example.com',
      password: 'password123',
      name: 'Jane Smith'
    },
    {
      id: 3,
      email: 'bob.johnson@example.com',
      password: 'password123',
      name: 'Bob Johnson'
    }
  ];

  for (const userData of defaultUsers) {
    const hashedPassword = await User.hashPassword(userData.password);
    const user = new User(userData.id, userData.email, hashedPassword, userData.name);
    users.push(user);
  }
};

// Initialize users
initializeUsers();

module.exports = {
  User,
  users
};
