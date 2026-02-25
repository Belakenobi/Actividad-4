const jwt = require('jsonwebtoken');

jest.mock('../src/models/User');

const User = require('../src/models/User');
const { protect } = require('../src/middleware/auth');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next with error if no token provided', async () => {
    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'No autorizado, token no proporcionado'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error if token is invalid', async () => {
    req.headers.authorization = 'Bearer invalidtoken';

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token no válido'
    });
  });

  it('should call next and attach user if token is valid', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret_key_jwt_productos_2024');
    
    const mockUser = { _id: userId, username: 'testuser' };
    User.findById = jest.fn().mockResolvedValue(mockUser);

    req.headers.authorization = `Bearer ${token}`;

    await protect(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.username).toBe('testuser');
  });

  it('should return 401 if user not found', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret_key_jwt_productos_2024');
    
    User.findById = jest.fn().mockResolvedValue(null);

    req.headers.authorization = `Bearer ${token}`;

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Usuario no encontrado'
    });
  });
});
