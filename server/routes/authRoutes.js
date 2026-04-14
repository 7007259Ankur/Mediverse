const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {
  register,
  login,
  googleFailure
} = require('../controllers/authController');
const {
  validateRegister,
  validateLogin
} = require('../middlewares/validation');

// ✅ POST /api/auth/register → Register new user
router.post('/register', validateRegister, register);

// ✅ POST /api/auth/login → Login existing user
router.post('/login', validateLogin, login);

// ✅ GET /api/auth/google → Initiate Google OAuth flow
router.get('/google', (req, res, next) => {
  const state = req.query.redirectTo || '/';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: JSON.stringify({
      redirectTo: state,
      role: req.query.role || 'user', // default to 'user'
    }),
    prompt: 'select_account',
  })(req, res, next);
});

// ✅ FIXED: GET /api/auth/google/callback → Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign(
      { role: req.user.role, id: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const redirectUrl = `http://localhost:5173/oauth-success?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`;
res.redirect(redirectUrl);

  }
);

// ✅ GET /api/auth/google/failure → Google OAuth failure route
router.get('/google/failure', googleFailure);

module.exports = router;
