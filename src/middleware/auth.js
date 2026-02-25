const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_jwt_productos_2024');
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Token no válido' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No autorizado, token no proporcionado' });
  }
};

module.exports = { protect };
