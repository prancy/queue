var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../models/User')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
},
function(accessToken, refreshToken, profile, cb) {
  // a user has logged in with OAuth...
  User.findOne({ 'googleId': profile.id }, function(err, user) {
    if (err) return cb(err);
    if (user) {
      if (!user.avatar) {
        user.avatar = profile.photos[0].value;
        user.save(function(err) {
          return cb(null, user);
        });
      } else {
        return cb(null, user);
      }
    } else {
      // we have a new user via OAuth!
      var newUser = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        googleId: profile.id
      });
      newUser.save(function(err) {
        if (err) return cb(err);
        return cb(null, newUser);
      });
    }
  });
}
));

passport.serializeUser(function(user, done) {
done(null, user.id);
});

passport.deserializeUser(function(id, done) {
User.findById(id, function(err, user) {
  done(err, user);
});
});