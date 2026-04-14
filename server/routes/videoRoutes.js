// server/routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');


router.get('/token', verifyToken, (req, res) => {
  res.json({ token: generateVideoToken(req.user._id) });
});

function generateVideoToken(userId) {
  // Implement your token generation logic
  return `video-token-${userId}-${Date.now()}`;
}

module.exports = router;