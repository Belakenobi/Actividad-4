const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

jest.setTimeout(30000);

beforeAll(async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/productos_test';
  await mongoose.connect(mongoURI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

const generateTestToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret_key_jwt_productos_2024', {
    expiresIn: '1h'
  });
};

module.exports = { generateTestToken };
