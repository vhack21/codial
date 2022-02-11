const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");
//Authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    function (email, password, done) {
      User.findOne(
        {
          email: email,
        },
        function (err, user) {
          if (err) {
            console.log("Error in finding user");
            return done(err);
          }
          if (!user || user.password != password) {
            console.log("Invalid Username");
            return done(null, false);
          }
          return done(null, user);
        }
      );
    }
  )
);
// Serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
//deserialize the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding user");
      return done(err);
    }
    return done(null, user);
  });
});

//check if the user is authenticated

passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
