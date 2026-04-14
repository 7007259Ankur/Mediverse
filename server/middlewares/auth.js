const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // 1. Get and verify token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Authentication required');

    // 2. Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Find COMPLETE user document
    const user = await User.findById(decoded.id).select('-password');
    if (!user) throw new Error('User not found');

    // 4. Attach FULL user document to request
    req.user = user; // This now contains _id and all user fields
    next();
    
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ 
      error: 'Authentication failed',
      details: err.message 
    });
  }
};

module.exports = auth;