const jwt = require('jsonwebtoken');
const User = require('../models/user')

const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '10m'
  });
};
const generateRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '7d'
  });
};


const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    if (!token || token === null) return res.status(401).json({ message: 'No token, authorization denied, on (auth protect middleware)', result: false, data: null });
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      res.status(401).json({ message: 'Token is not valid, on (auth protect middleware)', result: false, data: null });
    }
  };
  
  const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Admin access only, on (auth adminOnly middleware)', result: false, data: null });
    }
  };
  
module.exports = { protect, adminOnly, generateAccessToken, generateRefreshToken };
