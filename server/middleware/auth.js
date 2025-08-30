const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).lean();
    if (!user || user.isBlocked) return res.status(401).json({ message: 'Unauthorized' });
    req.user = { id: user._id.toString(), role: user.role, name: user.name };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const permit = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};

module.exports = { auth, permit };
