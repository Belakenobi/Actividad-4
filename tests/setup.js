const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

jest.setTimeout(30000);

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/productos_test';
    await mongoose.connect(mongoURI);
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
});

const generateTestToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret_key_jwt_productos_2024', {
    expiresIn: '1h'
  });
};

module.exports = { generateTestToken };
