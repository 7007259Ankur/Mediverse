const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
        proxy: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log('Google Profile Received:', {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName
          });

          if (!profile.emails?.[0]?.value) {
            return done(null, false, { message: 'No email provided by Google' });
          }

          const email = profile.emails[0].value.toLowerCase();
          const name = profile.displayName || email.split('@')[0];

          // Find existing user by googleId or email
          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email: email }]
          });

          if (!user) {
            user = new User({
              googleId: profile.id,
              email,
              name,
              role: 'user'
            });
            await user.save();
            console.log('New user created:', user._id);
          } else {
            // Link Google ID if user already exists but has no googleId
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
              console.log('Existing user updated:', user._id);
            }
          }

          return done(null, {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
          });
        } catch (err) {
          console.error('Google Strategy Error:', err);
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('-password -__v');
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
