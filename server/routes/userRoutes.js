const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middlewares/auth');

// GET /api/users or /api/users?role=doctor
router.get('/', auth, async (req, res) => {
  try {
    const role = req.query.role;
    const filter = role ? { role } : {};
    const users = await User.find(filter);
    res.json(users);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
