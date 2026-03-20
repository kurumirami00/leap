const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.is_superuser) {
    return next();
  }
  res.status(403).json({ error: 'Admin access required' });
};

const isInstructor = (req, res, next) => {
  if (req.user && (req.user.role === 'instructor' || req.user.is_superuser)) {
    return next();
  }
  res.status(403).json({ error: 'Instructor access required' });
};

module.exports = { verifyToken, isAdmin, isInstructor };