const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper functions
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.__v;
  delete userObj.googleId;
  return userObj;
};

// Existing Local Auth Methods
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role.toLowerCase()
    });

    const token = createToken(user);
    const userData = sanitizeUser(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Registration Error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No user found with this email'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    const token = createToken(user);
    const userData = sanitizeUser(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Google OAuth Methods
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Find or create user
    let user = await User.findOne({ 
      $or: [
        { googleId },
        { email }
      ]
    });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        avatar: picture,
        isVerified: true,
        role: 'user'
      });
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = googleId;
      user.isVerified = true;
      await user.save();
    }

    const token = createToken(user);
    const userData = sanitizeUser(user);

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Google Auth Error:', error);
    return res.status(401).json({
      success: false,
      message: 'Google authentication failed',
      error: error.message
    });
  }
};

// Alternative Google OAuth (for server-side flow)
exports.googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/login?error=google_auth_failed');
    }

    const token = createToken(req.user);
    const userData = sanitizeUser(req.user);

    // For API clients
    if (req.accepts('json')) {
      return res.json({
        success: true,
        token,
        user: userData
      });
    }

    // For web clients
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const state = JSON.parse(req.query.state || '{}');
    return res.redirect(state.redirectTo || '/');

  } catch (error) {
    console.error('Google Callback Error:', error);
    return res.redirect('/login?error=server_error');
  }
};

exports.googleFailure = (req, res) => {
  return res.status(401).json({
    success: false,
    message: 'Google authentication failed'
  });
};

// Account Linking
exports.linkGoogleAccount = async (req, res) => {
  try {
    const { credential } = req.body;
    const userId = req.user.id;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;

    // Verify the Google email matches the user's email
    const user = await User.findById(userId);
    if (user.email !== email) {
      return res.status(400).json({
        success: false,
        message: 'Google account email does not match your registered email'
      });
    }

    user.googleId = googleId;
    user.isVerified = true;
    await user.save();

    return res.json({
      success: true,
      message: 'Google account linked successfully'
    });

  } catch (error) {
    console.error('Link Google Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to link Google account'
    });
  }
};